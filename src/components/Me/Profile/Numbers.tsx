import { useSession } from "next-auth/react";
import type { ProfileNumbersListTexts } from ".";
import { api } from "../../../utils/api";
import CompactNumberFormatter from "../../../utils/CompactNumberFormatter";
import Loading from "../../Loading";
import type { Dispatch, SetStateAction } from "react";

const InfoBox: React.FC<{
  number: number;
  text: ProfileNumbersListTexts;
  changeShowList: Dispatch<
    SetStateAction<
      | {
        list: ProfileNumbersListTexts;
        count: number;
      }
      | undefined
    >
  >;
}> = ({ number, text, changeShowList }) => {
  return (
    <>
      <div
        onClick={() => {
          changeShowList((list) =>
            list && list.list == text
              ? undefined
              : { list: text, count: number }
          );
        }}
        className={`flex flex-col ${text !== "Posts" ? "cursor-pointer hover:bg-gray-700" : ""
          } items-center rounded-lg bg-gray-800 p-1 py-2`}
      >
        <h2 className="text-md">{CompactNumberFormatter.format(number)}</h2>
        <h4 className="text-xs font-bold opacity-70">{text}</h4>
      </div>
    </>
  );
};

const Numbers: React.FC<{
  changeShowList: Dispatch<
    SetStateAction<
      | {
        list: ProfileNumbersListTexts;
        count: number;
      }
      | undefined
    >
  >;
}> = ({ changeShowList }) => {
  const { status } = useSession();
  const userData = api.me.data.useQuery(undefined, {
    enabled: status == "authenticated",
  });

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;
  const {
    Posts,
    Follow,
    TrustedBy,
    FollowedBy,
    ConnectedTo,
    ConnectedWith,
    Trust,
  } = userData.data._count;
  return (
    <>
      <div className="roudned grid w-full grid-cols-2 gap-2 rounded-lg border-l-2 border-r-2 border-b-2 border-gray-400 bg-gray-800 p-3 xs:grid-cols-3 sm:max-w-fit sm:border-l-0">
        <InfoBox
          number={ConnectedWith + ConnectedTo}
          text="Connections"
          changeShowList={changeShowList}
        />
        <InfoBox
          number={Follow}
          text="Following"
          changeShowList={changeShowList}
        />
        <InfoBox
          number={FollowedBy}
          text="Followers"
          changeShowList={changeShowList}
        />
        <InfoBox number={Posts} text="Posts" changeShowList={changeShowList} />
        <InfoBox
          number={TrustedBy}
          text="Trusted"
          changeShowList={changeShowList}
        />
        <InfoBox number={Trust} text="Trusts" changeShowList={changeShowList} />
      </div>
    </>
  );
};

export default Numbers;
