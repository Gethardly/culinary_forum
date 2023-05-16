import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import useAlert from './useAlert';

const AlertDialog = () => {
  const { title, text, open, onClose } = useAlert();

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Ок</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
