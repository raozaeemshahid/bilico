import FailedFullBodyComponent from "../components/FailedFullBodyComponent";
import type { NextPage } from "next";

const NotFound: NextPage = () => {
  return <FailedFullBodyComponent text="Content isn't accessible" />;
};

export default NotFound;
