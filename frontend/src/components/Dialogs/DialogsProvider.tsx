import React from 'react';
import ConfirmProvider from './Confirm/ConfirmProvider';
import AlertProvider from './Alert/AlertProvider';

const DialogsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ConfirmProvider>
      <AlertProvider>{children}</AlertProvider>
    </ConfirmProvider>
  );
};

export default DialogsProvider;
