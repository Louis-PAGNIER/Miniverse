export type ToastType = 'success' | 'danger' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration: number | null;
}