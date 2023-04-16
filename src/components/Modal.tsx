import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { zodNote } from "../lib/zod";
import { ModalContext } from "../pages/_app";

const Modal: React.FC = () => {
  const modalControl = useContext(ModalContext);
  const [note, changeNote] = useState("");
  if (!modalControl.modal) return <></>;
  return (
    <>
      <div
        className="fixed top-0 left-0 z-[49] h-screen w-screen bg-gray-100 opacity-[0.15]"
        onClick={() => {
          modalControl.changeModal(undefined);
        }}
      ></div>
      <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-900 p-10 shadow-xl shadow-gray-800">
          <h2 className="text-lg text-gray-300">{modalControl.modal.text}</h2>
          {!!modalControl.modal.includeNote && (
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder-gray-400 shadow-sm shadow-gray-800 focus:border-blue-500 focus:ring-blue-500"
              placeholder={modalControl.modal.noteText || `Write a note`}
              value={note}
              onChange={(e) => changeNote(e.target.value)}
            />
          )}
          <div className="flex gap-1">
            <h2
              className="cursor-pointer rounded-lg bg-green-600 p-1 px-3 hover:bg-green-700"
              onClick={() => {
                modalControl.changeModal(undefined);
              }}
            >
              Cancel
            </h2>
            <h2
              className="cursor-pointer rounded-lg bg-blue-600 p-1 px-3 hover:bg-blue-700"
              onClick={() => {
                if (modalControl.modal?.includeNote) {
                  const parsedNote = zodNote.safeParse(note);
                  if (!parsedNote.success) {
                    return parsedNote.error.errors.forEach((err) =>
                      toast.error(err.message)
                    );
                  }
                }
                if (modalControl.modal) modalControl.modal.confirm(note);
                modalControl.changeModal(undefined);
              }}
            >
              {modalControl.modal.confirmText}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
