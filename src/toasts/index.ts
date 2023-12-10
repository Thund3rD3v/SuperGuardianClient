import toast from "react-hot-toast";

export function errorToast(message: string) {
  toast.error(message, {
    className: "error-toast",
  });
}

export function successToast(message: string) {
  toast.success(message, {
    className: "success-toast",
  });
}
