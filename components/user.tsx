import { useUser } from '@auth0/nextjs-auth0';
import { Button, List, ListItem, Paper, Popover, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { useRouter } from 'next/router';
import React from 'react';

const useStyles = makeStyles({
  avatar: {
    marginRight: 10
  },
  root: {
    marginLeft: 'auto',
    display: 'flex',
    padding: '10px 10px'
  },
  text: {
    margin: 'auto'
  },
  dropDownIcon: {
    marginRight: 8
  }
});

export function User() {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  if (user) {
    return (
      <>
        <Button aria-describedby={id} className={classes.root} onClick={handleOpen} color="secondary">
          <Avatar alt={user.name ?? undefined} src={user.picture ?? undefined} className={classes.avatar} />
          <Typography className={classes.text} variant="body2">
            {user.name}
          </Typography>
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <Paper>
            <List>
              <ListItem
                button
                onClick={() => {
                  router.push('/api/auth/logout');
                }}
              >
                <ExitToApp className={classes.dropDownIcon} />
                Logout
              </ListItem>
            </List>
          </Paper>
        </Popover>
      </>
    );
  } else {
    return (
      <Button color="secondary" className={classes.root} href="/api/auth/login">
        Login
      </Button>
    );
  }
}
