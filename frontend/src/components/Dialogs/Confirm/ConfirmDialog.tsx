import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import useConfirm from './useConfirm';

const Confirm = () => {
  const { open, title, text, onConfirm, onCancel } = useConfirm();

  return (
    <Dialog open={open} onClose={onCancel} fullWidth={true} maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Подтверждаю</Button>
        <Button onClick={onCancel}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirm;
