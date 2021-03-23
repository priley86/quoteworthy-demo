import { useEffect, useState } from 'react';

const useInfiniteScroll = (callback: () => void, scrollContainerSelector: string, scrollOffset: number) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  function handleScroll() {
    const scrollContainer = document.querySelector(scrollContainerSelector) as HTMLElement;
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        ((scrollContainer && scrollContainer.offsetHeight) || 0) + scrollOffset &&
      !isFetching
    ) {
      setIsFetching(true);
    }
    return;
  }

  return [isFetching, setIsFetching] as const;
};

export default useInfiniteScroll;
