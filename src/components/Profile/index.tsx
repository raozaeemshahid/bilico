import Profile from "./Profile";
import Tabs from "./Tabs";
import { createContext } from "react";

export const UserIdContext = createContext("");

const ProfileComponent: React.FC<{ userId: string }> = ({ userId }) => {
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
