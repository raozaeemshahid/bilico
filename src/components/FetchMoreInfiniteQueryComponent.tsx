import Loading from "./Loading";

const FetchMoreInfiniteComponent: React.FC<{
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  endingMsg: "You've reached the end of your feed!" | "You're all caught up!" | "" | undefined
}> = ({ fetchNextPage, hasNextPage, isFetchingNextPage, endingMsg }) => {
  if (isFetchingNextPage) return <Loading />;
  if (hasNextPage)
    return (
      <div className="flex justify-center">
        <button
          className="text-lg text-blue-200 hover:underline"
          onClick={() => {
            fetchNextPage();
          }}
        >
         show more
        </button>
      </div>
    );
  return (
    <>
      <div className="flex justify-center">
        <h3 className="text-gray-400  text-lg p-1 px-3 rounded-lg">{endingMsg}</h3>
      </div>
    </>
  );
};
export default FetchMoreInfiniteComponent;
