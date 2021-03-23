import { render, screen } from '@testing-library/react';
import React from 'react';

import List from '../../components/list';
import { QuoteApiResult } from '../../types/quotes';

describe('list ui tests', () => {
  it('should show user quotes list with Edit and Delete actions', async () => {
    const response: QuoteApiResult = {
      results: [{ id: 1, text: 'text', updatedAt: '2021-03-28T05:54:09.859Z' }],
      pagination: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        rowCount: 1
      }
    };
    render(
      <List
        results={response.results}
        pagination={response.pagination}
        filtered={false}
        isFetching={false}
        handleEdit={jest.fn()}
        handleDelete={jest.fn()}
      />
    );
    expect(screen.getByText('Your quote on 3/28/2021, 1:54:09 AM.')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  it('should show public quotes list with author name and no actions', async () => {
    const response: QuoteApiResult = {
      results: [{ id: 1, text: 'text', authorName: 'Einstein' }],
      pagination: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        rowCount: 1
      }
    };
    render(
      <List
        results={response.results}
        pagination={response.pagination}
        filtered={false}
        isFetching={false}
        handleEdit={jest.fn()}
        handleDelete={jest.fn()}
      />
    );
    expect(screen.getByText('Einstein')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
