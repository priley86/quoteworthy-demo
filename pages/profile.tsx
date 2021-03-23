import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import Card from '../components/card';
import Layout from '../components/layout';
import { useContentStyles } from '../styles/contents';

const useStyles = makeStyles({
  grid: {
    padding: '1.2rem'
  }
});

export default withPageAuthRequired(function Profile(): React.ReactElement {
  const { user, error, isLoading } = useUser();
  const classes = useContentStyles();
  const gridClasses = useStyles();

  return (
    <Layout>
      <div className={classes.root}>
        <div className={classes.background}>
          <h1>Auth0 Profile</h1>

          {isLoading && <p>Loading profile...</p>}

          {error && (
            <>
              <h4>Error</h4>
              <pre>{error.message}</pre>
            </>
          )}

          {user && (
            <Grid className={gridClasses.grid} container direction="row" justify="center" alignItems="center">
              <Grid item>
                <Card
                  title="User Profile Structure"
                  actions={
                    <Button href="https://auth0.com/docs/users/user-profile-structure" target="_blank" size="small">
                      Learn More
                    </Button>
                  }
                  json={JSON.stringify(user, null, 2)}
                />
              </Grid>
            </Grid>
          )}
        </div>
      </div>
    </Layout>
  );
});
