import { useSession } from "next-auth/react";
import Loading from "../Loading";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import RequestList from "./List";
import { useState } from "react";
import type { OrderOfDataByTime } from "../../lib/common/names";
import { listOrderOfDataByTime } from "../../lib/common/names";
import Select from "react-select";

const ProfileComponent: React.FC = () => {
  const router = useRouter();
  const { data: userSession } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink());
    },
  });
  const [order, changeOrder] = useState<OrderOfDataByTime>("Newest");

  if (!userSession || !userSession.user)
    return <Loading text="Signing You In" />;
  return (
    <>
      <div>
        <div className="my-3 flex justify-center">
          <h2 className="text-3xl font-bold">Connection Requests</h2>
        </div>

        <div className="flex flex-col rounded-lg bg-gray-700 p-2 font-semibold">
          <div className="flex items-center gap-2">
            <h2>Order by</h2>
            <Select
              className="basic-single"
              styles={{
                control: (style) => ({
                  ...style,
                  border: "0px",
                  backgroundColor: "transparent",
                }),
                singleValue: (style) => ({ ...style, color: "white" }),
              }}
              classNamePrefix="select"
              defaultValue={{ label: listOrderOfDataByTime[0] }}
              isClearable={false}
              isSearchable={false}
              name="order-select"
              onChange={(data) => {
                if (!data || !data.label) return;
                changeOrder(data.label);
              }}
              options={listOrderOfDataByTime.map((order) => ({ label: order }))}
            />
          </div>
        </div>
        <RequestList order={order} />
      </div>
    </>
  );
};

export default ProfileComponent;
