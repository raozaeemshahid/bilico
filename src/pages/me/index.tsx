import type { NextPage } from "next";
import Navbar from "../../components/Navbar";
import { NavbarLinkCreator } from "../../lib/NavbarLinkProvider";
import Head from "next/head";

const MyProfile: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta
          name="description"
          content="Let's Connect, Learn and Grow Together"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar links={[NavbarLinkCreator.HomeLink()]} />
    </>
  );
};

export default MyProfile;
