import { signOut, useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { LoadingFullScreen } from "../loading";
import Image from "next/image";
import { GrEdit, GrTroubleshoot } from "react-icons/gr";
import { IoMdDoneAll } from "react-icons/io";
import { useCallback, useEffect, useState } from "react";
import { zodName } from "../../lib/zod";
import PagesLinks from "../../lib/PagesLink";
import { useRouter } from "next/router";
import NameComponent from "./Name";
import ImageComponent from "./Image";
import ErrorsComponent, { GenderError } from "./Errors";
import ProceedComponent from "./Proceed";
import GenderComponent from "./Gender";
import EmailComponent from "./Email";
import moment, { type Moment } from "moment";
import DateOfBirthComponent, { MINIMUM_AGE_REQUIREMENT } from "./DateOfBirth";
import CountryComponent from "./Country";

const Register: React.FC = () => {
  const { data: userSession, status } = useSession();
  const RegisterMe = trpc.me.confirmRegistration.useMutation();
  const [isNameEditing, changeIsNameEditing] = useState(false);
  const [userName, changeUserName] = useState<string>();
  const [gender, changeGender] = useState<"Male" | "Female" | "Other">();

  const [isDateOfBithEditing, changeIsDateOfBirthEditing] = useState(true);
  const [dateOfBirth, changeDateOfBirth] = useState<Moment>(moment.utc());

  const [country, changeCountry] = useState<string>();
  const [errors, changeErrors] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    changeErrors([]);
  }, [
    isNameEditing,
    gender,
    isDateOfBithEditing,
    country,
    dateOfBirth,
    userName,
  ]);

  useEffect(() => {
    if (!userSession || !userSession.user) return;
    changeUserName(userSession.user.name ? userSession.user.name : "");
  }, [status]);

  const validateInfo = () => {
    if (!userName) return;
    const nameValidation = zodName.safeParse(userName);
    if (!nameValidation.success) {
      changeErrors(nameValidation.error.errors.map((err) => err.message));
      return;
    }
    if (isNameEditing) changeIsNameEditing(false);
    if (!gender) {
      changeErrors([GenderError]);
      return;
    }

    if (
      moment.utc().diff(dateOfBirth, "year", false) < MINIMUM_AGE_REQUIREMENT
    ) {
      changeErrors([
        `You have to be atleast ${MINIMUM_AGE_REQUIREMENT} years old`,
      ]);
      return;
    }
    changeIsDateOfBirthEditing(false);
    if (!country) {
      changeErrors(["Please Select Your Country"]);
      return;
    }
    return {
      name: userName,
      gender,
      country,
      dateOfBirth: dateOfBirth.toDate().toISOString(),
    };
  };

  const FnCompleteRegistratoin = async () => {
    if (!router.isReady) return;
    const info = validateInfo();
    if (!info) return;
    const registered = await RegisterMe.mutateAsync({
      name: info.name,
      gender: info.gender,
      country: info.country,
      dateOfBirth: info.dateOfBirth,
    });
    if (registered.success) {
      router.push(PagesLinks.HOME_Link);
      return;
    }
    if (registered.alreadyRegistered) {
      changeErrors(["You've already registered"]);
      return;
    }
    if (registered.userNotFound) {
      signOut();
      router.push(PagesLinks.getLoginLink(router));
    }
  };

  if (!userSession || !userSession.user) return <LoadingFullScreen />;
  return (
    <>
      <section className="body-font flex h-screen ">
        <div className=" mx-auto flex flex-wrap items-center  md:py-2 md:px-2">
          <div className=" flex flex-col rounded-lg bg-white px-4 py-10 text-gray-800  sm:px-10">
            <h2 className="text-center text-xl">
              You Are Creating New Account
            </h2>
            <div className="my-6 flex flex-col items-center p-2">
              <ImageComponent />
              <div className="w-full">
                <NameComponent
                  changeErrors={changeErrors}
                  changeIsNameEditing={changeIsNameEditing}
                  changeUserName={changeUserName}
                  isNameEditing={isNameEditing}
                  userName={userName}
                />
                <EmailComponent />
                <GenderComponent
                  changeGender={changeGender}
                  gender={gender}
                  changeErrors={changeErrors}
                  errors={errors}
                />
                <DateOfBirthComponent
                  dateOfBirth={dateOfBirth}
                  changeDateOfBirth={changeDateOfBirth}
                  changeErrors={changeErrors}
                  isDateOfBithEditing={isDateOfBithEditing}
                  changeIsDateOfBirthEditing={changeIsDateOfBirthEditing}
                />
                <CountryComponent
                  country={country}
                  changeCountry={changeCountry}
                />
              </div>
            </div>
            {errors.length > 0 && <ErrorsComponent errors={errors} />}
            {errors.length == 0 && (
              <ProceedComponent
                FnCompleteRegistratoin={FnCompleteRegistratoin}
                isInfoEditing={
                  isNameEditing || !gender || isDateOfBithEditing || !country
                }
                changeIsInfoEditing={validateInfo}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
