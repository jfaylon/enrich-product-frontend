// ToastContainer.tsx
import { Toaster, toast } from "react-hot-toast";

export const ToastContainer = () => {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      toastOptions={{
        duration: 2000,
        style: {
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
      }}
    />
  );
};

// Success Toast Function
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    style: {
      background: "#4ade80", // Tailwind emerald-400
      color: "white",
    },
    iconTheme: {
      primary: "white",
      secondary: "#4ade80",
    },
  });
};

// Error Toast Function
export const showErrorToast = (message: string) => {
  toast.error(message, {
    style: {
      background: "#f87171", // Tailwind red-400
      color: "white",
    },
    iconTheme: {
      primary: "white",
      secondary: "#f87171",
    },
  });
};
