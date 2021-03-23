import { default as MUICard } from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles({
  card: {
    maxWidth: 700,
    margin: '16px auto',
    overflow: 'auto'
  },
  header: {
    fontSize: 16
  },
  pos: {
    marginBottom: 12
  },
  div: {
    textAlign: 'left'
  },
  pre: {
    fontSize: 13,
    whiteSpace: 'pre-wrap'
  },
  mediaWrap: {
    width: '80%',
    margin: 'auto'
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  quote: {
    fontSize: 17,
    fontWeight: 500,
    margin: 'auto',
    width: '80%',
    padding: '8px',
    textAlign: 'left'
  }
});

function randomPhoto(i: number) {
  switch (i % 7) {
    case 0:
      return 'https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8MTYlM0E5fGVufDB8fDB8&ixlib=rb-1.2.1&w=1000&q=80';
    case 1:
      return 'https://images.unsplash.com/photo-1595835018349-198460e1d309?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1778&q=80';
    case 2:
      return 'https://images.unsplash.com/photo-1599522336242-0db868a98cb1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1778&q=80';
    case 3:
      return 'https://images.unsplash.com/photo-1610037391125-8ce522f92a07?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';
    case 4:
      return 'https://images.unsplash.com/photo-1517147304304-313dc873b3d4?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80';
    case 5:
      return 'https://images.unsplash.com/photo-1604348033618-3e42a96a2c1d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1780&q=80';
    case 6:
      return 'https://images.unsplash.com/photo-1557331670-5346fb439f59?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1778&q=80';
    case 7:
      return 'https://images.unsplash.com/photo-1581194898056-92c4db54f64d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80';
    default:
      return 'https://images.unsplash.com/photo-1581194898056-92c4db54f64d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80';
  }
}

interface CardProps {
  title?: string;
  header?: React.ReactNode;
  headerActions?: React.ReactNode;
  actions?: React.ReactNode;
  json?: string;
  body?: React.ReactNode;
  includePhoto?: boolean;
  photoIndex?: number;
}

export default function Card(props: CardProps): React.ReactElement {
  const { title, header, headerActions, actions, json, body, includePhoto, photoIndex } = props;

  const cardClasses = useStyles();
  const cardContent = (
    <CardContent>
      {title && (
        <Typography className={cardClasses.pos} color="textPrimary">
          {title}
        </Typography>
      )}
      {json && (
        <div className={cardClasses.div}>
          <pre className={cardClasses.pre} data-testid="profile">
            {json}
          </pre>
        </div>
      )}
      {body && (
        <Typography className={cardClasses.quote} variant="body2" color="textSecondary" component="p">
          {'"'}
          {body}
          {'"'}
        </Typography>
      )}
    </CardContent>
  );
  return (
    <MUICard className={cardClasses.card}>
      {header && (
        <CardHeader
          className={cardClasses.header}
          action={headerActions}
          title={header}
          titleTypographyProps={{ className: cardClasses.header }}
        />
      )}
      {includePhoto && (
        <CardActionArea>
          <div className={cardClasses.mediaWrap}>
            <CardMedia className={cardClasses.media} image={randomPhoto(photoIndex ?? 0)} title="Quote Icon" />
          </div>
          {cardContent}
        </CardActionArea>
      )}
      {!includePhoto && cardContent}
      {actions && <CardActions>{actions}</CardActions>}
    </MUICard>
  );
}
