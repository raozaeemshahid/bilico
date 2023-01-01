import { useSession } from "next-auth/react";

const EmailComponent: React.FC = () => {
  const { data: userSession } = useSession();
  if (!userSession || !userSession.user) return <></>;
  return (
    <>
      <div className="p-1">
        {userSession.user.email && <h2>{userSession.user.email}</h2>}
      </div>
    </>
  );
};

export default EmailComponent;
