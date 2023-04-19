import CreateWork from "./CreateWork";
import WorkList from "./WorkList";

const Posts: React.FC = () => {
  return (
    <>
      <div className="flex flex-col gap-4 justify-center">
        <CreateWork />
        <WorkList />
      </div>
    </>
  );
};

export default Posts;
