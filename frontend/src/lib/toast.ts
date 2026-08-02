type ToastType = "success" | "error" | "info";
type Listener = (message: string, type: ToastType) => void;

const listeners: Listener[] = [];

export function showToast(message: string, type: ToastType = "success") {
  listeners.forEach((fn) => fn(message, type));
}

export function subscribeToast(fn: Listener) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i > -1) listeners.splice(i, 1);
  };
}