import { useContext } from 'react';
import { ConfirmContext, ConfirmControls, ConfirmType } from './ConfirmProvider';

let resolveCallback: (value: boolean | PromiseLike<boolean>) => void;

const useConfirm = () => {
  const { show, hide, title, text, open } = useContext(ConfirmContext) as ConfirmType & ConfirmControls;
  const onConfirm = () => {
    closeConfirm();
    resolveCallback(true);
  };

  const onCancel = () => {
    closeConfirm();
    resolveCallback(false);
  };

  const confirm = (title: string, text: string) => {
    show(title, text);
    return new Promise<boolean>((res) => {
      resolveCallback = res;
    });
  };

  const closeConfirm = () => hide();

  return { confirm, onConfirm, onCancel, title, text, open };
};

export default useConfirm;
