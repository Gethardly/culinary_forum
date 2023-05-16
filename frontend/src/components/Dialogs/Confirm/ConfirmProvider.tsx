import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

export interface ConfirmType {
  open: boolean;
  title: string;
  text: string;
}

export interface ConfirmControls {
  show: (title: string, text: string) => void;
  hide: () => void;
}

export const initialState: ConfirmType = {
  open: false,
  title: '',
  text: '',
};

export const ConfirmContext = React.createContext<(ConfirmType & ConfirmControls) | null>(null);

const ConfirmProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState(initialState);

  const show = (title: string, text: string) => setState((prev) => ({ ...prev, open: true, title, text }));
  const hide = () => setState((prev) => ({ ...prev, open: false }));

  return (
    <ConfirmContext.Provider value={{ ...state, show, hide }}>
      {children}
      <ConfirmDialog />
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
