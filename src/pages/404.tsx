import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import { NavbarLinkCreator } from "../lib/NavbarLinkProvider";
import { LoadingFullScreen } from "../components/loading";
import Head from "next/head";
const NotFound: NextPage = () => {
  const { data: userSession, status } = useSession();
  if (
    status == "loading" ||
    !userSession ||
    !userSession.user ||
    !userSession.user.name
  )
    return <LoadingFullScreen text="Signing You In" />;

  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {status === "authenticated" ? (
          <Navbar
            links={[
              NavbarLinkCreator.BlogLink(),
              NavbarLinkCreator.questionLink(),
              NavbarLinkCreator.storyLink(),
              NavbarLinkCreator.HomeLink(),
              NavbarLinkCreator.profileLink(userSession.user.name),
            ]}
          />
        ) : (
          <Navbar
            links={[
              NavbarLinkCreator.BlogLink(),
              NavbarLinkCreator.questionLink(),
              NavbarLinkCreator.storyLink(),
            ]}
            signedOut={true}
          />
        )}
        <div className="container mx-auto px-5 py-24 lg:w-2/3">
          <div className="mb-12 flex w-full flex-col">
            <h1 className="title-font mb-4 text-center font-medium text-white sm:text-2xl md:text-4xl">
              Content Is Not Accessible
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
