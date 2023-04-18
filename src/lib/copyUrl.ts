import { toast } from "react-toastify"

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const copyUrlToClipboard = (path: string) => {
  navigator.clipboard.writeText(getBaseUrl() + path)
  toast.info("Copied url: " + getBaseUrl())
}