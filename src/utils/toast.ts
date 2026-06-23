import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOAST_CONFIG = {
  position: "top-right" as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    ...TOAST_CONFIG,
  });
};

export const notifyError = (message: string) => {
  toast.error(message, {
    ...TOAST_CONFIG,
  });
};

export const notifyInfo = (message: string) => {
  toast.info(message, {
    ...TOAST_CONFIG,
  });
};

export const notifyWarning = (message: string) => {
  toast.warn(message, {
    ...TOAST_CONFIG,
  });
};

export default toast;
