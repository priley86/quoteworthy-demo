import { makeStyles } from '@material-ui/core/styles';

export const useContentStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    height: 'calc(100vh - 64px)',
    position: 'relative'
  },
  background: {
    top: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingTop: '3%'
  }
}));
