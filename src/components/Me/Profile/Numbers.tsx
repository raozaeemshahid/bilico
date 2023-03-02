import { useSession} from "next-auth/react";
import { api } from "../../../utils/api";
import Loading from "../../Loading";

const InfoBox: React.FC<{number: number, text: string}> = ({number, text}) => {
  return <>
    <div className="rounded p-1 py-2 flex flex-col bg-gray-900 items-center">
      <h2 className="text-md">{number}</h2>
      <h4 className="text-xs font-bold opacity-60">{text}</h4>
    </div>
  </>
  }

const Numbers: React.FC = () => {
  const { status } = useSession();
  const userData = api.me.data.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;
  const dataNumbers = userData.data._count
  return <>
     
      <div className="roudned m-2 grid grid-cols-2 xs:grid-cols-3 gap-2 w-full sm:max-w-fit rounded-lg bg-gray-900 p-3">
          <InfoBox number={dataNumbers.ConnectedTo + dataNumbers.ConnectedWith} text="Connections" />
          <InfoBox number={dataNumbers.Follow} text="Following" />
          <InfoBox number={dataNumbers.FollowedBy} text="Followers" />
          <InfoBox number={dataNumbers.Posts} text="Posts" />
          <InfoBox number={dataNumbers.Answers} text="Answers" />
          <InfoBox number={dataNumbers.TrustedBy} text="Trusted By" />
        
      </div>
  </>;
};

export default Numbers;
