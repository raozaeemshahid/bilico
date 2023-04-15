import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { createContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import { api } from "../utils/api";

import "../styles/globals.css";
import Head from "next/head";
import Modal from "../components/Modal";

interface Modal {
  text: string;
  confirm: (note: string) => void;
  confirmText?: string;
  includeNote?: boolean;
  noteText?: string;
}

export const ModalContext = createContext<{
  modal: Modal | undefined;
  changeModal: (newModal: Modal | undefined) => void;
}>({ changeModal(newModal) { newModal }, modal: undefined });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [modal, changeModal] = useState<Modal>();
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ModalContext.Provider
        value={{ modal, changeModal: (newModal) => changeModal(newModal) }}
      >
        <Modal />
        <Component {...pageProps} />
      </ModalContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="dark"
      />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
