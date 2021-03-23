import LinearProgress from '@material-ui/core/LinearProgress';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';

interface ProgressProps {
  text: string;
}
export default function Progress(props: ProgressProps) {
  const theme = useTheme();
  return (
    <div style={{ padding: theme.spacing(2) }}>
      <p>{props.text}</p>
      <LinearProgress />
    </div>
  );
}
