import { render, screen } from '@testing-library/react';
import React from 'react';

import * as useApiHook from '../../lib/use-api';
import QuotesPage from '../../pages/quotes';
import { QuoteApiResult } from '../../types/quotes';
import { user, withUserProvider } from '../fixtures/withUserProvider';

describe('quotes ui tests', () => {
  it('should show loading text when isLoading is true', async () => {
    jest.spyOn(useApiHook, 'useApi').mockImplementation(() => ({
      response: null,
      error: null,
      isLoading: true
    }));
    render(<QuotesPage />, { wrapper: withUserProvider({ user: user }) });
    expect(screen.getByText('Loading your quotes...')).toBeInTheDocument();
  });
  it('should show a quote when response exists', async () => {
    const response: QuoteApiResult = {
      results: [{ id: 1, text: 'text', updatedAt: '2021-03-28T05:54:09.859Z' }],
      pagination: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        rowCount: 1
      }
    };
    jest.spyOn(useApiHook, 'useApi').mockImplementation(() => ({
      response: response,
      error: null,
      isLoading: false
    }));
    render(<QuotesPage />, { wrapper: withUserProvider({ user: user }) });
    expect(screen.getByText('Your quote on 3/28/2021, 1:54:09 AM.')).toBeInTheDocument();
  });
});
