export interface DialogComponent<T = any, R = any> {
  open: (data: T) => void;
  close: () => R;
}
