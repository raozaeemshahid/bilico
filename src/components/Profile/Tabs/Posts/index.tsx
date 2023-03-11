import Postslist from "./PostsList";

const Posts: React.FC = () => {
  return (
    <>
      <div className="flex flex-col gap-4 justify-center">
        <Postslist />
      </div>
    </>
  );
};

export default Posts;
