import { useState } from "react";
import PreviewNewWork from "./PreviewNewWork";
import CreateNewWork from "./CreateNewWork";
import { api } from "../../../../../utils/api";
import { toast } from "react-toastify";
import zodWork from "../../../../../lib/zod/zodWork";


const CreateWork: React.FC = () => {
  const [workBody, changeWorkBody] = useState("");
  const [isInPreview, changeIsInPreview] = useState(false);

  const utilsApi = api.useContext();

  const createWorkApi = api.me.createWork.useMutation();
  const createWork = () => {
    const parsedWork = zodWork.safeParse(workBody);
    if (!parsedWork.success)
      return parsedWork.error.errors.forEach((err) => toast.error(err.message));
    changeIsInPreview(false);
    changeWorkBody("");
    void toast.promise(
      createWorkApi
        .mutateAsync({
          workBody,
        })
        .then(() => utilsApi.publicApi.getAllWork.invalidate()),
      {
        success: "Created",
        error: "Couldn't Create",
        pending: "Creating",
      }
    );
  };

  if (isInPreview) {
    return (
      <PreviewNewWork
        createWork={createWork}
        changeIsInPreview={changeIsInPreview}
        workBody={workBody}
      />
    );
  }
  return (
    <CreateNewWork
      changeIsInPreview={changeIsInPreview}
      changeWorkBody={changeWorkBody}
      workBody={workBody}
    />
  );
};
export default CreateWork;
