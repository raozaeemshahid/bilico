import { useState } from "react";
import Select from "react-select";
import { listOrderOfDataByTime } from "../../../lib/common/names";
import type { OrderOfDataByTime } from "../../../lib/common/names";
import ReactionListComponent from "./List";
import type { AllReactions } from "../../CommentsAndReactions/Reactions";

const listAllReactions: AllReactions[] = ["All", "Agree", "Disagree", "Love"];

const ActivityReactions: React.FC = () => {
  const [order, changeOrder] = useState<OrderOfDataByTime>("Newest");
  const [filter, changeFilter] = useState<AllReactions>("All");

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Reactions</h1>
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
            <h2>Filter</h2>
            <Select
              className="basic-single"
              styles={{
                control: (style) => ({
                  ...style,
                  border: "0px",
                  backgroundColor: "transparent",
                  minWidth: "120px",
                }),
                singleValue: (style) => ({ ...style, color: "white" }),
              }}
              classNamePrefix="select"
              defaultValue={{ label: filter }}
              isClearable={false}
              isSearchable={false}
              name="order-select"
              onChange={(data) => {
                if (!data || !data.label) return;
                changeFilter(data.label);
              }}
              options={listAllReactions.map((order) => ({ label: order }))}
            />
          </div>
        </div>
        <ReactionListComponent order={order} filter={filter} />
      </div>
    </>
  );
};

export default ActivityReactions;
