import React, { PropsWithChildren, ReactNode } from 'react';
import { Dialog, DialogContent } from '@mui/material';

interface Props extends PropsWithChildren {
  children: ReactNode;
  isOpen: boolean;
  onClose: React.MouseEventHandler;
}

const ModalBody: React.FC<Props> = ({ children, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default ModalBody;
