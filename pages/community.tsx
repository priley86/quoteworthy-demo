import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';

import List from '../components/list';
import Progress from '../components/progress';
import Search from '../components/search';
import { useApi } from '../lib/use-api';
import useInfiniteScroll from '../lib/use-infinite-scroll';
import { QuoteApiResponse, SortMenuStates } from '../types/quotes';
import { getSearchUrl } from './quotes';

export default withPageAuthRequired(function CommunityQuotes(): React.ReactElement {
  // todo: throttle page size based on react-adaptive-hooks:
  // https://github.com/GoogleChromeLabs/react-adaptive-hooks#server-side-rendering-support
  const baseQuotesUrl = '/api/community?pageSize=10';

  const [authorFilter, setAuthorFilter] = React.useState('');
  const [quoteFilter, setQuoteFilter] = React.useState('');
  const [sortByAuthor, setSortByAuthor] = React.useState<SortMenuStates>(SortMenuStates.UNSORT);
  const [sortByQuote, setSortByQuote] = React.useState<SortMenuStates>(SortMenuStates.UNSORT);

  const searchUrl = React.useMemo(() => {
    return getSearchUrl(sortByAuthor, authorFilter, sortByQuote, quoteFilter, baseQuotesUrl);
  }, [sortByAuthor, sortByQuote, quoteFilter, authorFilter, baseQuotesUrl]);

  const { response, error, isLoading }: QuoteApiResponse = useApi(searchUrl);

  // used for infinite scroll
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pagesExausted, setPagesExausted] = React.useState(false);
  const [appendedItems, setAppendedItems] = React.useState([]);
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, '#scroll-container', 80);

  async function fetchMoreListItems() {
    setTimeout(async () => {
      const totalPages = response?.pagination?.pageCount ?? -1;
      if (totalPages > 0 && currentPage < totalPages) {
        const nextPage = currentPage + 1;
        const res = await fetch(`${searchUrl}&page=${nextPage}`);
        const json = await res.json();
        if (res.status === 200 && json) {
          setAppendedItems((prevState) => [...prevState, ...json.results]);
          setCurrentPage(nextPage);
        }
      } else if (currentPage === totalPages && !pagesExausted) {
        setPagesExausted(true);
      }
      setIsFetching(false);
    }, 1000); //reduces overfetching and provides smoother transition
  }

  const updateSearchResults = () => {
    setCurrentPage(1);
    setPagesExausted(false);
    setAppendedItems([]);
  };

  const onQuoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteFilter(event.target.value);
    updateSearchResults();
  };

  const onQuoteSortChange = (sort: SortMenuStates) => {
    setSortByQuote(sort);
  };

  const onAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorFilter(event.target.value);
    updateSearchResults();
  };

  const onAuthorSortChange = (sort: SortMenuStates) => {
    setSortByAuthor(sort);
  };

  return (
    <div>
      {isLoading && <Progress text="Loading public quotes..." />}

      {response && (
        <>
          <Search
            onAuthorChange={onAuthorChange}
            authorValue={authorFilter}
            onAuthorSortChange={onAuthorSortChange}
            onQuoteChange={onQuoteChange}
            quoteValue={quoteFilter}
            onQuoteSortChange={onQuoteSortChange}
          />
          <List
            results={[...response.results, ...appendedItems]}
            pagination={response.pagination}
            filtered={quoteFilter.length > 0 || authorFilter.length > 0}
            isFetching={isFetching && !pagesExausted}
          />
        </>
      )}

      {error && (
        <>
          <h4>Error</h4>
          <pre>{error.message}</pre>
        </>
      )}
    </div>
  );
});
