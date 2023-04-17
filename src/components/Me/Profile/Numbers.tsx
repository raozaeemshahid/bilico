import { useSession } from "next-auth/react";
import { api } from "../../../utils/api";
import CompactNumberFormatter from "../../../utils/CompactNumberFormatter";
import Loading from "../../Loading";

const InfoBox: React.FC<{ number: number; text: string }> = ({
  number,
  text,
}) => {
  return (
    <>
      <div className="flex flex-col items-center rounded bg-gray-800 p-1 py-2">
        <h2 className="text-md">{CompactNumberFormatter.format(number)}</h2>
        <h4 className="text-xs font-bold opacity-70">{text}</h4>
      </div>
    </>
  );
};

const Numbers: React.FC = () => {
  const { status } = useSession();
  const userData = api.me.data.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;
  const dataNumbers = userData.data._count;
  return (
    <>
      <div className="roudned m-2 grid w-full grid-cols-2 gap-2 rounded-lg border-l-2 border-r-2 border-b-2 border-gray-400 bg-gray-800 p-3 xs:grid-cols-3 sm:max-w-fit sm:border-l-0">
        <InfoBox
          number={dataNumbers.ConnectedTo + dataNumbers.ConnectedWith}
          text="Connections"
        />
        <InfoBox number={dataNumbers.Follow} text="Following" />
        <InfoBox number={dataNumbers.FollowedBy} text="Followers" />
        <InfoBox number={dataNumbers.Posts} text="Posts" />
        <InfoBox number={dataNumbers.TrustedBy} text="Trusted" />
      </div>
    </>
  );
};

export default Numbers;
