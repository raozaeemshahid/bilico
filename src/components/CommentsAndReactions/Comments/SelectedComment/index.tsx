import { Dispatch, SetStateAction, useContext, useState } from "react";
import type { SelectedComment } from "../";
import { BiArrowBack } from "react-icons/bi";
import { api } from "../../../../utils/api";
import { toast } from "react-toastify";
import Loading from "../../../Loading";
import CommentItem from "../CommentItem";
import Image from "next/image";
import Link from "next/link";
import PagesLinks from "../../../../lib/PagesLink";
import BadWordsFilter from "../../../../utils/BadWordFilter";
import dynamic from "next/dynamic";
import { ModalContext } from "../../../../pages/_app";
import FetchMoreInfiniteComponent from "../../../FetchMoreInfiniteQueryComponent";
import {
  listOrderOfDataByTime,
  OrderOfDataByTime,
} from "../../../../lib/common/names";
import Select from "react-select";
import Replies from "./Replies";

const MdVerified = dynamic(() =>
  import("react-icons/md").then((icons) => icons.MdVerified)
);

const SelectedCommentComponent: React.FC<{
  selectedComment: SelectedComment;
  changeSelectedComment: Dispatch<SetStateAction<SelectedComment | undefined>>;
}> = ({ changeSelectedComment, selectedComment }) => {
  const [order, changeOrder] = useState<OrderOfDataByTime>("Oldest");

  return (
    <>
      <div className="h-full rounded-lg py-2 md:px-3">
        <div className="flex items-center gap-2 rounded-lg border-b-4 border-gray-700 text-center text-sm">
          <div
            onClick={() => changeSelectedComment(selectedComment.ReplyTo)}
            className="cursor-pointer rounded-full p-2 text-lg hover:bg-gray-800"
          >
            <BiArrowBack />
          </div>
          Replies
        </div>
        <div className="flex items-center gap-2">
          <div>
            {!!selectedComment.CreatedBy.image && (
              <Link
                href={PagesLinks.getProfileLink(selectedComment.CreatedBy.id)}
              >
                <Image
                  alt="Profile Pic"
                  className="rounded-full"
                  width={30}
                  height={30}
                  src={selectedComment.CreatedBy.image}
                />
              </Link>
            )}
          </div>
          <div className="p-2">
            <Link
              href={PagesLinks.getProfileLink(selectedComment.CreatedBy.id)}
            >
              <div className="flex items-center gap-1 text-sm hover:underline">
                <h3 className="whitespace-nowrap font-semibold">
                  {selectedComment.CreatedBy.name}
                </h3>
                <h3>
                  {selectedComment.CreatedBy.isVerified && <MdVerified />}
                </h3>
              </div>
            </Link>
            <h4 className="text-sm text-gray-100 opacity-95">
              {BadWordsFilter.clean(selectedComment.Comment)}
            </h4>
          </div>
        </div>
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
            defaultValue={{ label: order }}
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
        <div className="ml-1 flex flex-col gap-1 border-l-2 border-gray-800  pl-2">
          <Replies
            order={order}
            selectedComment={selectedComment}
            changeSelectedComment={changeSelectedComment}
          />
        </div>
      </div>
    </>
  );
};
export default SelectedCommentComponent;
