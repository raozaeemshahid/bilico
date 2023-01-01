import { Dispatch, SetStateAction } from "react";

const ProceedComponent: React.FC<{
  FnCompleteRegistratoin: () => Promise<void>;
  isInfoEditing: boolean;
  changeIsInfoEditing: () => void;
}> = ({ FnCompleteRegistratoin, changeIsInfoEditing, isInfoEditing }) => {
  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <h2>Wish To Proceed? </h2>
        {isInfoEditing ? (
          <button
            onClick={changeIsInfoEditing}
            className="rounded bg-blue-500 py-1 px-2 text-sm font-bold  text-white hover:bg-blue-700"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={FnCompleteRegistratoin}
            className="rounded bg-blue-500 py-1 px-2 text-sm font-bold  text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        )}
      </div>
      <p className="text-xs">Note: You can&apos;t change your info later</p>
    </>
  );
};

export default ProceedComponent;
