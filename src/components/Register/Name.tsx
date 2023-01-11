import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction } from "react";
import { zodName } from "../../lib/zod";
import { IoMdDoneAll } from "react-icons/io";
import { GrEdit } from "react-icons/gr";

const NameComponent: React.FC<{
  userName: string | undefined;
  changeUserName: Dispatch<SetStateAction<string | undefined>>;
  isNameEditing: boolean;
  changeIsNameEditing: Dispatch<SetStateAction<boolean>>;
  changeErrors: Dispatch<SetStateAction<string[]>>;
}> = ({
  isNameEditing,
  userName,
  changeUserName,
  changeIsNameEditing,
  changeErrors,
}) => {
  const { data: userSession } = useSession();
  if (!userSession || !userSession.user) return <></>;
  return (
    <>
      <div>
        {isNameEditing ? (
          <div className="flex flex-col p-1">
            <h3 className="text-sm opacity-60">Enter Your Name</h3>
            <div className="flex">
              <input
                className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
                type="text"
                value={userName}
                placeholder="Type New Name"
                onChange={(el) => changeUserName(el.target.value)}
              ></input>
              <button
                onClick={() => {
                  const nameValidation = zodName.safeParse(userName);
                  if (nameValidation.success) {
                    changeIsNameEditing(false);
                    changeErrors([]);
                  } else
                    changeErrors(
                      nameValidation.error.errors.map((err) => err.message)
                    );
                }}
              >
                <IoMdDoneAll className="ml-2 hover:scale-110 active:scale-90" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex content-between items-center p-1">
            {userName}
            <button
              onClick={() => {
                changeIsNameEditing(true);
              }}
            >
              <GrEdit className="ml-2 hover:scale-110 active:scale-90" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NameComponent;
