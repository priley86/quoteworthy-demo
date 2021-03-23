import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Snackbar from '@material-ui/core/Snackbar';
import Alert, { Color } from '@material-ui/lab/Alert';
import React from 'react';

import List from '../components/list';
import Modal from '../components/modal';
import Progress from '../components/progress';
import Search from '../components/search';
import { useApi } from '../lib/use-api';
import useInfiniteScroll from '../lib/use-infinite-scroll';
import { QuoteApiResponse, SortMenuStates } from '../types/quotes';

type ModalProps = { open: boolean; id: number | undefined; text: string; isSaving: boolean };
type ToastProps = { open: boolean; alert: string; severity: Color };

export function getSearchUrl(
  sortByAuthor: SortMenuStates,
  authorFilter: string,
  sortByQuote: SortMenuStates,
  quoteFilter: string,
  baseQuotesUrl: string,
  updatedAtSort?: boolean
) {
  let textFilters = '';
  let authorNameFilters = '';
  const sortByFilters = [];
  const sortByArg = '&sortBy=';

  if (sortByAuthor === SortMenuStates.ASC || sortByAuthor === SortMenuStates.DESC) {
    sortByFilters.push(sortByAuthor === SortMenuStates.ASC ? 'authorName' : '-authorName');
  }
  if (sortByQuote === SortMenuStates.ASC || sortByQuote === SortMenuStates.DESC) {
    sortByFilters.push(sortByQuote === SortMenuStates.ASC ? 'text' : '-text');
  }
  if (updatedAtSort) {
    sortByFilters.push('-updatedAt');
  }
  if (quoteFilter) {
    textFilters = `&text=${quoteFilter}`;
  }
  if (authorFilter) {
    authorNameFilters = `&authorName=${authorFilter}`;
  }
  const sortBy = sortByFilters.length ? `${sortByArg}${sortByFilters.join(',')}` : '';
  return `${baseQuotesUrl}${textFilters}${authorNameFilters}${sortBy}`;
}

export default withPageAuthRequired(function Quotes(): React.ReactElement {
  // todo: throttle page size based on react-adaptive-hooks:
  // https://github.com/GoogleChromeLabs/react-adaptive-hooks#server-side-rendering-support
  const baseQuotesUrl = '/api/quotes?pageSize=10';

  const [quoteFilter, setQuoteFilter] = React.useState('');
  const [sortByQuote, setSortByQuote] = React.useState<SortMenuStates>(SortMenuStates.UNSORT);

  const [modalProps, setModalProps] = React.useState<ModalProps>({
    open: false,
    id: undefined,
    text: '',
    isSaving: false
  });
  const [toastProps, setToastProps] = React.useState<ToastProps>({ open: false, alert: '', severity: 'success' });

  const searchUrl = React.useMemo(() => {
    return getSearchUrl(null, '', sortByQuote, quoteFilter, baseQuotesUrl, true);
  }, [sortByQuote, quoteFilter, baseQuotesUrl]);

  const { response, error, isLoading, refetch }: QuoteApiResponse = useApi(searchUrl);

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

  const onQuoteSortChange = (sort: SortMenuStates) => {
    setSortByQuote(sort);
  };

  const onQuoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteFilter(event.target.value);
    updateSearchResults();
  };

  const handleQuoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModalProps((prev) => ({ ...prev, text: event.target.value }));
  };

  const showSuccessAlert = (alert: string) => {
    setToastProps({ open: true, alert: alert, severity: 'success' });
  };

  const showErrorAlert = (alert: string) => {
    setToastProps({ open: true, alert: alert, severity: 'error' });
  };

  const handleCloseAlert = () => {
    setToastProps((prev) => ({ ...prev, open: false }));
  };

  const handleAddClick = () => {
    setModalProps({ open: true, id: undefined, text: '', isSaving: false });
  };

  const handleClose = () => {
    setModalProps((prev) => ({ ...prev, open: false }));
  };

  const handleSuccess = (msg: string) => {
    refetch();
    showSuccessAlert(msg);
    setModalProps({ open: false, id: undefined, text: '', isSaving: false });
  };

  const handleError = (msg: string) => {
    showErrorAlert(msg);
    setModalProps((prev) => ({ ...prev, isSaving: false }));
  };

  const handleEdit = (id: number, text: string) => {
    setModalProps({ open: true, id: id, text: text, isSaving: false });
  };

  const handleAddEditQuote = async () => {
    setModalProps((prev) => ({ ...prev, isSaving: true }));
    try {
      const request = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: modalProps.text })
      };
      if (modalProps.id) {
        const response = await fetch(`/api/quote/${modalProps.id}`, {
          method: 'PUT',
          ...request
        });
        if (response.status === 200) {
          handleSuccess('Updated quote successfully!');
        } else {
          handleError('Failed updating quote. Please try again.');
        }
      } else {
        const response = await fetch('/api/quote', {
          method: 'POST',
          ...request
        });
        if (response.status === 200) {
          handleSuccess('Added quote successfully!');
        } else {
          handleError('Failed adding quote. Please try again.');
        }
      }
    } catch (error) {
      console.error(error);
      handleError('Something unexpected happened. Please try again.');
    }
  };

  const handleDeleteQuote = async (id: number) => {
    try {
      const response = await fetch(`/api/quote/${id}`, {
        method: 'DELETE'
      });
      if (response.status === 200) {
        handleSuccess('Quote deleted successfully!');
      } else {
        handleError('Failed deleting quote. Please try again.');
      }
    } catch (error) {
      console.error(error);
      handleError('Something unexpected happened. Please try again.');
    }
  };

  return (
    <div>
      {isLoading && <Progress text="Loading your quotes..." />}

      {response && (
        <>
          <Search
            onQuoteChange={onQuoteChange}
            quoteValue={quoteFilter}
            onQuoteSortChange={onQuoteSortChange}
            onAddClick={handleAddClick}
          />
          <List
            results={[...response.results, ...appendedItems]}
            pagination={response.pagination}
            filtered={quoteFilter.length > 0}
            isFetching={isFetching && !pagesExausted}
            handleEdit={handleEdit}
            handleDelete={handleDeleteQuote}
          />
          <Modal
            open={modalProps.open}
            handleClose={handleClose}
            handleAddEdit={handleAddEditQuote}
            handleChange={handleQuoteChange}
            text={modalProps.text}
            id={modalProps.id}
            isSaving={modalProps.isSaving}
          />
          <Snackbar
            open={toastProps.open}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={handleCloseAlert}
          >
            <Alert variant="filled" severity={toastProps.severity}>
              {toastProps.alert}
            </Alert>
          </Snackbar>
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
