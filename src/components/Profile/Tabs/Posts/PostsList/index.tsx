import { api } from "../../../../../utils/api";
import BadWordsFilter from "../../../../../utils/BadWordFilter";
import moment from "moment";
import Image from "next/image";
import Loading from "../../../../Loading";
import ReactionsAndComments from "./ReactionsAndComments";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  listOrderOfDataByTime,
  OrderOfDataByTime,
} from "../../../../../lib/common/names";
import PostsListComponent from "./List";

const Postslist: React.FC<{userId: string}> = ({userId}) => {
  const [order, changeOrder] = useState<OrderOfDataByTime>("Newest");

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Posts</h1>
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
                singleValue: style => ({...style, color: "white"})
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
        <PostsListComponent order={order} userId={userId} />
      </div>
    </>
  );
};

export default Postslist;