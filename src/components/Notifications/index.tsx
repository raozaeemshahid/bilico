import { useSession } from "next-auth/react";
import Loading from "../Loading";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import NotificationList from "./List";

const ProfileComponent: React.FC = () => {
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
      <div>
        <div className="my-3 flex justify-center">
          <h2 className="text-3xl font-bold">Notifications</h2>
        </div>
        <NotificationList />
      </div>
    </>
  );
};

export default ProfileComponent;
