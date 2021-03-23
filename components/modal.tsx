import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddEdit: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  isSaving: boolean;
  id?: number;
}

export default function Modal(props: ModalProps): React.ReactElement {
  const { open, handleClose, handleAddEdit, handleChange, text, isSaving, id } = props;
  const theme = useTheme();
  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{id !== undefined ? `Edit Quote: ${id}` : 'Add Quote'}</DialogTitle>
      <DialogContent>
        <DialogContentText>Add a quoteworthy quote, share your imagination...</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="quote"
          label="Quote"
          value={text}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          onChange={handleChange}
          disabled={isSaving}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleAddEdit} color="primary" disabled={isSaving}>
          {isSaving && <CircularProgress style={{ marginRight: theme.spacing(1) }} size={12} />}
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
