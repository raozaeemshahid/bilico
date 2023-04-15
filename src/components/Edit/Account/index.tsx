import { useSession } from "next-auth/react";
import { LoadingFullScreen } from "../../Loading";
import EditBody from "./EditBody";

const EditAccount: React.FC = () => {
  const { data: userSession } = useSession();

  if (!userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;
  return <EditBody />;
};

export default EditAccount;
