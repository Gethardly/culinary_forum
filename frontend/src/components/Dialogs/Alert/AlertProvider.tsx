import React, { useState } from 'react';
import AlertDialog from './AlertDialog';

export interface AlertType {
  open: boolean;
  title: string;
  text: string;
}

export interface AlertControls {
  show: (title: string, text: string) => void;
  hide: () => void;
}

export const initialState: AlertType = {
  open: false,
  title: '',
  text: '',
};

export const AlertContext = React.createContext<(AlertType & AlertControls) | null>(null);

const AlertProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState(initialState);

  const show = (title: string, text: string) => setState((prev) => ({ ...prev, title, text, open: true }));
  const hide = () => setState((prev) => ({ ...prev, open: false }));

  return (
    <AlertContext.Provider value={{ ...state, show, hide }}>
      {children}
      <AlertDialog />
    </AlertContext.Provider>
  );
};

export default AlertProvider;
