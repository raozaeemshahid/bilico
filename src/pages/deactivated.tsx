import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import PagesLinks from "../lib/PagesLink";
import { LoadingFullScreen } from "../components/Loading";
const Deactivated: NextPage = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push(PagesLinks.getLoginLink(router));
    },
  });

  if (status == "loading" || !userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;
  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default Deactivated;
