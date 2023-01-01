import type { NextPage } from "next";
import Navbar from "../../components/Navbar";
import { NavbarLinkCreator } from "../../lib/NavbarLinkProvider";

// export { getServerSideProps } from "../../lib/common/signedInAndNotBanned";

const MyProfile: NextPage = () => {
  return (
    <>
      <Navbar links={[NavbarLinkCreator.HomeLink()]} />
    </>
  );
};

export default MyProfile;
