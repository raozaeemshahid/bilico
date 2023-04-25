import { toast } from "react-toastify";

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  if (process.env.NODE_ENV == "production") return 'https://bilico.vercel.app'
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const copyUrlToClipboard = (path: string) => {
  navigator.clipboard
    .writeText(getBaseUrl() + path)
    .then(() => {
      toast.info("Copied");
    })
    .catch(() => {
      toast.error("Couln't Copy");
    });
};
