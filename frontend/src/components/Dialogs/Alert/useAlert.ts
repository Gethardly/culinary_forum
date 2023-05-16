import { useContext } from 'react';
import { AlertContext, AlertControls, AlertType } from './AlertProvider';

const useAlert = () => {
  const { title, text, open, show, hide } = useContext(AlertContext) as AlertType & AlertControls;

  const alert = (title: string, text: string) => show(title, text);

  const onClose = () => hide();

  return { alert, onClose, text, title, open };
};

export default useAlert;
