import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import { NavbarLinkCreator } from "../lib/NavbarLinkProvider";
import { LoadingFullScreen } from "../components/loading";

const NotFound: NextPage = () => {
  const { data: userSession, status } = useSession();
  if (status == "loading") return <LoadingFullScreen />;
  return (
    <div>
      {status === "authenticated" ? (
        <Navbar
          links={[
            NavbarLinkCreator.BlogLink(),
            NavbarLinkCreator.questionLink(),
            NavbarLinkCreator.storyLink(),
            NavbarLinkCreator.HomeLink(),
            NavbarLinkCreator.profileLink(userSession),
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
  );
};

export default NotFound;
