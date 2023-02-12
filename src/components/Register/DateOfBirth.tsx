import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction } from "react";
import moment, { type Moment } from "moment";
import Select from "react-select";
import dynamic from "next/dynamic";

const IoMdDoneAll = dynamic(() =>
  import("react-icons/io").then((icons) => icons.IoMdDoneAll)
);
const GrEdit = dynamic(() =>
  import("react-icons/gr").then((icons) => icons.GrEdit)
);

export const MINIMUM_AGE_REQUIREMENT = 12;

export const MonthsList = moment.monthsShort();
export const getDateList = (m: Moment) => {
  const dates: number[] = [];
  const lastDate = m.daysInMonth();
  for (let i = 1; i <= lastDate; i++) dates.push(i);
  return dates;
};
export const getYearsList = () => {
  const years: number[] = [];
  const LastYear = moment().year();
  for (let i = LastYear - 100; i <= LastYear; i++) years.push(i);
  return years.reverse();
};

const DateOfBirthComponent: React.FC<{
  dateOfBirth: Moment;
  changeDateOfBirth: Dispatch<SetStateAction<Moment>>;
  isDateOfBithEditing: boolean;
  changeIsDateOfBirthEditing: Dispatch<SetStateAction<boolean>>;
  changeErrors: Dispatch<SetStateAction<string[]>>;
}> = ({
  changeErrors,
  changeDateOfBirth,
  dateOfBirth,
  changeIsDateOfBirthEditing,
  isDateOfBithEditing,
}) => {
  const { data: userSession } = useSession();
  if (!userSession || !userSession.user) return <></>;
  return (
    <>
      <div>
        {isDateOfBithEditing ? (
          <div className="my-3">
            <h3 className="text-sm opacity-60">Date Of Birth</h3>
            <div className="flex">
              <div className="flex flex-wrap">
                <Select
                  options={getDateList(dateOfBirth).map((date) => ({
                    label: date,
                  }))}
                  placeholder="Date"
                  components={{ IndicatorSeparator: null }}
                  styles={{}}
                  onChange={(val) => {
                    if (!val) return;
                    dateOfBirth.set("date", val.label);
                    changeDateOfBirth(moment.utc(dateOfBirth.toDate()));
                  }}
                  value={{ label: dateOfBirth.date() }}
                />
                <Select
                  options={MonthsList.map((month) => ({ label: month }))}
                  placeholder="Month"
                  components={{ IndicatorSeparator: null }}
                  value={{ label: MonthsList[dateOfBirth.month()] }}
                  onChange={(val) => {
                    if (!val || !val.label) return;
                    const month = MonthsList.findIndex(
                      (month) => month === val.label
                    );
                    if (month < 0) {
                      changeErrors(["Invalid Month"]);
                      return;
                    }
                    dateOfBirth.set("month", month);
                    changeDateOfBirth(moment.utc(dateOfBirth.toDate()));
                  }}
                />
                <Select
                  options={getYearsList().map((year) => ({
                    label: year,
                  }))}
                  components={{
                    IndicatorSeparator: null,
                  }}
                  placeholder="Year"
                  onChange={(val) => {
                    if (!val) return;
                    dateOfBirth.set("year", val.label);
                    changeDateOfBirth(moment.utc(dateOfBirth.toDate()));
                  }}
                  value={{ label: dateOfBirth.year() }}
                />
              </div>

              <button
                onClick={() => {
                  changeIsDateOfBirthEditing(false);
                }}
              >
                <IoMdDoneAll className="ml-2 hover:scale-110 active:scale-90" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex content-between items-center p-1">
            {`${moment().diff(dateOfBirth, "year", false)} Years Old`}
            <button
              onClick={() => {
                changeIsDateOfBirthEditing(true);
              }}
            >
              <GrEdit className="ml-2 hover:scale-110 active:scale-90" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DateOfBirthComponent;
