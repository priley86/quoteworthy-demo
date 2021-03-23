import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import { PaginationSchema, QuotesSchema } from '../types/quotes';
import Card from './card';
import Menu, { MenuOption } from './menu';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function localDateString(updatedAt: string) {
  const d = new Date(updatedAt);
  return `${d.toLocaleString()}`;
}

type EditOptionValue = { id: number; text: string };
type DeleteOptionValue = { id: number };

enum QuoteMenuOptions {
  Edit = 'Edit',
  Delete = 'Delete'
}

interface ListProps {
  results: Array<QuotesSchema>;
  pagination: PaginationSchema;
  filtered: boolean;
  isFetching: boolean;
  handleEdit?: (id: number, text: string) => void;
  handleDelete?: (id: number) => void;
}

export default function List(props: ListProps): React.ReactElement {
  const { results, pagination, filtered, isFetching, handleEdit, handleDelete } = props;
  let contents = <p>No quotes to display.</p>;

  const handleOptionClick = (o: MenuOption) => {
    if (o.optionName === QuoteMenuOptions.Edit) {
      const value = o.optionValue as EditOptionValue;
      handleEdit && handleEdit(value.id, value.text);
    }
    if (o.optionName === QuoteMenuOptions.Delete) {
      const value = o.optionValue as DeleteOptionValue;
      handleDelete && handleDelete(value.id);
    }
  };

  const renderActions = (r: QuotesSchema) => {
    return r.authorName ? null : (
      <Menu
        options={[
          { optionName: QuoteMenuOptions.Edit, optionValue: { id: r.id, text: r.text } },
          { optionName: QuoteMenuOptions.Delete, optionValue: { id: r.id } }
        ]}
        handleOptionClick={handleOptionClick}
      />
    );
  };

  if (results?.length) {
    contents = (
      <>
        {results.map((r, i) => {
          return (
            <Card
              key={i}
              header={r.authorName || r.sub || `Your quote on ${localDateString(r.updatedAt as string)}.`}
              headerActions={renderActions(r)}
              body={r.text}
              photoIndex={i}
              includePhoto
            />
          );
        })}
      </>
    );
  }
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      {pagination && filtered && (
        <Grid xs={12} item>
          <p>{numberWithCommas(pagination.rowCount)} quotes found.</p>
        </Grid>
      )}
      <Grid xs={12} item>
        {contents}
      </Grid>
      {isFetching && (
        <Grid xs={12} item>
          <div>
            <CircularProgress />
            <p>Fetching more quotes...</p>
          </div>
        </Grid>
      )}
    </Grid>
  );
}
