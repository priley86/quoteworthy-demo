export type QuotesSchema = {
  id: number;
  text: string;
  authorName?: string;
  updatedAt?: string;
  sub?: string;
};

export type PaginationSchema = {
  page: number;
  pageSize: number;
  pageCount: number;
  rowCount: number;
};

export enum SortMenuStates {
  UNSORT = 'Unsorted',
  ASC = 'Sort by ASC',
  DESC = 'Sort by DESC'
}

export type QuoteApiResult = {
  results: Array<QuotesSchema>;
  pagination: PaginationSchema;
};

export type QuoteApiResponse = {
  response: QuoteApiResult | null;
  error: { message: string } | null;
  isLoading: boolean;
  refetch: () => void;
};
