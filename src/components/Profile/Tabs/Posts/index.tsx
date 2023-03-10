import Postslist from "./PostsList";

const Posts: React.FC<{userId: string}> = ({userId}) => {
  return (
    <>
      <div className="flex flex-col gap-4 justify-center">
        <Postslist userId={userId} />
      </div>
    </>
  );
};

export default Posts;
