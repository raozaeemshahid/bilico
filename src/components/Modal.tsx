import { useContext } from "react";
import { ModalContext } from "../pages/_app";

const Modal: React.FC = () => {
  const conrolModal = useContext(ModalContext);
  if (!conrolModal.modal) return <></>;
  return (
    <>
      <div
        className="fixed top-0 left-0 z-[49] h-screen w-screen bg-gray-100 opacity-[0.15]"
        onClick={() => {
          conrolModal.changeModal(undefined);
        }}
      ></div>
      <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-900 p-10 shadow-xl shadow-gray-800">
          <h2 className="text-lg text-gray-300">{conrolModal.modal.text}</h2>
          <div className="flex gap-1">
            <h2
              className="cursor-pointer rounded-lg bg-green-600 p-1 px-3 hover:bg-green-700"
              onClick={() => {
                conrolModal.changeModal(undefined);
              }}
            >
              Cancel
            </h2>
            <h2
              className="cursor-pointer rounded-lg bg-blue-600 p-1 px-3 hover:bg-blue-700"
              onClick={() => {
                if (conrolModal.modal) conrolModal.modal.confirm();
                conrolModal.changeModal(undefined);
              }}
            >
              {conrolModal.modal.confirmText}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
