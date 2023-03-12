import { useSession } from "next-auth/react";
import Loading from "../Loading";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import Profile from "./Profile";
import Tabs from "./Tabs";
import { createContext } from "react";

export const UserIdContext = createContext("");

const ProfileComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const router = useRouter();
  const { data: userSession } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink());
    },
  });

  if (!userSession || !userSession.user)
    return <Loading text="Signing You In" />;
  return (
    <>
      <UserIdContext.Provider value={userId}>
        <div>
          <Profile />
          <Tabs />
        </div>
      </UserIdContext.Provider>
    </>
  );
};

export default ProfileComponent;
