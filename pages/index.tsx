import { useUser } from '@auth0/nextjs-auth0';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import FavoriteIcon from '@material-ui/icons/Favorite';
import GroupIcon from '@material-ui/icons/Group';
import PublicIcon from '@material-ui/icons/Public';
import React from 'react';

import Layout from '../components/layout';
import { useContentStyles } from '../styles/contents';
import CommunityQuotes from './community';
import PublicQuotes from './publicQuotes';
import Quotes from './quotes';

interface TabPanelProps {
  className: string;
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { className, children, value, index, ...other } = props;

  return (
    <div
      className={className}
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: 'auto',
      width: '80%'
    },
    publicRoot: {
      flexGrow: 1,
      margin: 'auto',
      width: '80%',
      background: theme.palette.secondary.light
    },
    tabPanel: {
      background: theme.palette.secondary.light
    }
  })
);

export default function Home(): React.ReactElement {
  const { user, error, isLoading } = useUser();
  const contentClasses = useContentStyles();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent, newValue: number) => {
    setValue(newValue);
  };

  let quotesContent = null;

  if (!isLoading && !error) {
    if (user) {
      quotesContent = (
        <Paper square className={classes.root}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="icon label tabs example"
          >
            <Tab icon={<PublicIcon />} label="Public" {...a11yProps(0)} />
            <Tab icon={<GroupIcon />} label="Community" {...a11yProps(1)} />
            <Tab icon={<FavoriteIcon />} label="My Quotes" {...a11yProps(2)} />
          </Tabs>

          <TabPanel className={classes.tabPanel} value={value} index={0}>
            <PublicQuotes />
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={value} index={1}>
            <CommunityQuotes />
          </TabPanel>
          <TabPanel className={classes.tabPanel} value={value} index={2}>
            <Quotes />
          </TabPanel>
        </Paper>
      );
    } else {
      quotesContent = (
        <Paper square className={classes.publicRoot}>
          <PublicQuotes />
        </Paper>
      );
    }
  }
  return (
    <Layout>
      <div className={contentClasses.root}>
        <div className={contentClasses.background}>
          <h2>Next.js, Auth0, and Material-UI Example</h2>

          {isLoading && (
            <div>
              <CircularProgress />
              <p>Loading quotes...</p>
            </div>
          )}

          {error && (
            <>
              <h4>Error</h4>
              <pre>{error.message}</pre>
            </>
          )}
          <div id="scroll-container">{quotesContent}</div>
        </div>
      </div>
    </Layout>
  );
}
