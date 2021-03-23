import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

import { SortMenuStates } from '../types/quotes';
import Menu, { MenuOption } from './menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      padding: '8px 0 8px 0'
    },
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      margin: theme.spacing(1)
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    divider: {
      height: 28,
      margin: 4
    },
    margin: {
      margin: theme.spacing(1)
    }
  })
);

interface SearchProps {
  onAuthorChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAuthorSearchClick?: () => void; //optional if not firing search onChange
  onAuthorSortChange?: (sort: SortMenuStates) => void;
  authorValue?: string;
  onQuoteChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onQuoteSearchClick?: () => void; //optional if not firing search onChange
  onQuoteSortChange: (sort: SortMenuStates) => void;
  quoteValue: string;
  onAddClick?: () => void;
}

export default function Search(props: SearchProps) {
  const classes = useStyles();
  const {
    onAuthorChange,
    onAuthorSearchClick,
    onAuthorSortChange,
    authorValue,
    onQuoteChange,
    onQuoteSearchClick,
    onQuoteSortChange,
    quoteValue,
    onAddClick
  } = props;
  const [selectedQuoteSortIndex, setSelectedQuoteSortIndex] = React.useState(0);
  const [selectedAuthorSortIndex, setSelectedAuthorSortIndex] = React.useState(0);

  const handleQuoteSortOptionClick = (o: MenuOption, index: number) => {
    onQuoteSortChange(o.optionValue as SortMenuStates);
    setSelectedQuoteSortIndex(index);
  };
  const handleAuthorSortOptionClick = (o: MenuOption, index: number) => {
    onAuthorSortChange && onAuthorSortChange(o.optionValue as SortMenuStates);
    setSelectedAuthorSortIndex(index);
  };

  return (
    <Grid className={classes.grid} container direction="row" justify="center" alignItems="center">
      <Grid item>
        {onAddClick && (
          <IconButton aria-label="delete" className={classes.margin} onClick={onAddClick}>
            <AddCircleIcon color="action" fontSize="large" />
          </IconButton>
        )}
      </Grid>
      <Grid item>
        <Grid container direction="row" justify="center" alignItems="center">
          {onAuthorChange && (
            <Grid item>
              <Grid container direction="row" justify="center" alignItems="center">
                <Grid item xs={11} md={10}>
                  <Paper component="form" className={classes.root}>
                    <InputBase
                      className={classes.input}
                      placeholder="Search Authors"
                      inputProps={{ 'aria-label': 'search authors' }}
                      value={authorValue}
                      onChange={onAuthorChange}
                    />
                    <IconButton onClick={onAuthorSearchClick} className={classes.iconButton} aria-label="search">
                      <SearchIcon />
                    </IconButton>
                  </Paper>
                </Grid>
                <Grid item xs={1} md={2}>
                  <Menu
                    options={[
                      { optionName: SortMenuStates.UNSORT, optionValue: SortMenuStates.UNSORT },
                      { optionName: SortMenuStates.ASC, optionValue: SortMenuStates.ASC },
                      { optionName: SortMenuStates.DESC, optionValue: SortMenuStates.DESC }
                    ]}
                    handleOptionClick={handleAuthorSortOptionClick}
                    selectedIndex={selectedAuthorSortIndex}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={11} md={10}>
                <Paper component="form" className={classes.root}>
                  <InputBase
                    className={classes.input}
                    placeholder="Search Quotes"
                    inputProps={{ 'aria-label': 'search quotes' }}
                    value={quoteValue}
                    onChange={onQuoteChange}
                  />
                  <IconButton onClick={onQuoteSearchClick} className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Grid>
              <Grid item xs={1} md={2}>
                <Menu
                  options={[
                    { optionName: SortMenuStates.UNSORT, optionValue: SortMenuStates.UNSORT },
                    { optionName: SortMenuStates.ASC, optionValue: SortMenuStates.ASC },
                    { optionName: SortMenuStates.DESC, optionValue: SortMenuStates.DESC }
                  ]}
                  handleOptionClick={handleQuoteSortOptionClick}
                  selectedIndex={selectedQuoteSortIndex}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
