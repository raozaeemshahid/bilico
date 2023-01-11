import { type Dispatch, type SetStateAction } from "react";
import { GrEdit } from "react-icons/gr";
import Select from "react-select";
import { countries } from "countries-list";

export const countriesList = Object.values(countries)
  .map((country) => country.name)
  .sort();
const CountryComponent: React.FC<{
  country: string | undefined;
  changeCountry: Dispatch<SetStateAction<string | undefined>>;
}> = ({ country, changeCountry }) => {
  return (
    <>
      {country === undefined ? (
        <div className="my-2 flex flex-col">
          <h3 className="text-sm opacity-60">Select Your Country</h3>
          <div className=" mt-1 flex ">
            <Select
              className="w-full"
              options={countriesList.map((country) => ({ label: country }))}
              onChange={(val) => {
                changeCountry(val?.label);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex content-between items-center p-1">
          {country}
          <button
            onClick={() => {
              changeCountry(undefined);
            }}
          >
            <GrEdit className="ml-2 hover:scale-110 active:scale-90" />
          </button>
        </div>
      )}
    </>
  );
};

export default CountryComponent;
