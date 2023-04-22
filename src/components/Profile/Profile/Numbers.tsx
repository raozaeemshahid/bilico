import CompactNumberFormatter from "../../../utils/CompactNumberFormatter";

const InfoBox: React.FC<{
  number: number;
  text: string;
}> = ({ number, text }) => {
  return (
    <>
      <div className="flex flex-col items-center rounded bg-gray-800 p-1 py-2">
        <h2 className="text-md">{CompactNumberFormatter.format(number)}</h2>
        <h4 className="text-xs font-bold opacity-70">{text}</h4>
      </div>
    </>
  );
};

const Numbers: React.FC<{
  _count: {
    connections: number;
    following: number;
    followers: number;
    posts: number;
    trusted: number;
    trusts: number;
  };
}> = ({ _count }) => {
  const { connections, followers, following, posts, trusted, trusts } = _count;
  return (
    <>
      <div className="roudned m-2 grid w-full grid-cols-2 gap-2 rounded-lg border-l-2 border-r-2 border-b-2 border-gray-400 bg-gray-800 p-3 xs:grid-cols-3 sm:max-w-fit sm:border-l-0">
        <InfoBox number={connections} text="Connections" />
        <InfoBox number={following} text="Following" />
        <InfoBox number={followers} text="Followers" />
        <InfoBox number={posts} text="Posts" />
        <InfoBox number={trusted} text="Trusted" />
        <InfoBox number={trusts} text="Trusts" />
      </div>
    </>
  );
};

export default Numbers;
