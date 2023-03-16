import { signOut, useSession } from "next-auth/react";
import { api } from "../../utils/api";
import Loading, { LoadingFullScreen } from "../Loading";
import { useEffect, useState } from "react";
import { zodName } from "../../lib/zod";
import PagesLinks from "../../lib/PagesLink";
import { useRouter } from "next/router";
import NameComponent from "./Name";
import ImageComponent from "./Image";
import ProceedComponent from "./Proceed";
import GenderComponent from "./Gender";
import EmailComponent from "./Email";
import moment from "moment";
import type { Moment } from "moment";
import DateOfBirthComponent, { MINIMUM_AGE_REQUIREMENT } from "./DateOfBirth";
import CountryComponent from "./Country";
import { toast } from "react-toastify";

const Register: React.FC = () => {
  const { data: userSession, status } = useSession();
  const RegisterMe = api.me.confirmRegistration.useMutation({
    onSuccess(data) {
      if (data.success) {
        if (data.name !== userSession?.user?.name) {
          void signOut();
          void router.push(PagesLinks.getLoginLink());
        }
        void router.push(PagesLinks.HOME_Link);
        return;
      }
      if (data.alreadyRegistered) {
        toast.error("You've already registered");
        return;
      }
      if (data.userNotFound) {
        void signOut();
        void router.push(PagesLinks.getLoginLink(router));
      }
    },
  });
  const [isNameEditing, changeIsNameEditing] = useState(false);
  const [userName, changeUserName] = useState<string>();
  const [gender, changeGender] = useState<"Male" | "Female" | "Other">();

  const [isDateOfBithEditing, changeIsDateOfBirthEditing] = useState(true);
  const [dateOfBirth, changeDateOfBirth] = useState<Moment>(
    moment.utc(
      Date.UTC(moment.utc().year(), moment.utc().month(), moment.utc().date())
    )
  );

  const [country, changeCountry] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !userSession.user ||
      !userSession.user.name
    )
      return;
    changeUserName(userSession.user.name);
  }, [status, userSession]);

  const validateInfo = () => {
    if (!userName) return;
    const nameValidation = zodName.safeParse(userName);
    if (!nameValidation.success) {
      nameValidation.error.errors.forEach((err) => toast.error(err.message));
      return;
    }
    if (isNameEditing) changeIsNameEditing(false);
    if (!gender) {
      toast.error("Please Select a Gender");
      return;
    }

    if (
      moment.utc().diff(dateOfBirth, "year", false) < MINIMUM_AGE_REQUIREMENT
    ) {
      toast.error(
        `You have to be atleast ${MINIMUM_AGE_REQUIREMENT} years old`
      );
      return;
    }
    changeIsDateOfBirthEditing(false);
    if (!country) {
      toast.error("Please Select Your Country");
      return;
    }
    return {
      name: userName,
      gender,
      country,
      dateOfBirth: dateOfBirth.toDate().toISOString(),
    };
  };
  const FnCompleteRegistratoin = () => {
    if (!router.isReady) return;
    const info = validateInfo();
    if (!info) return;

    RegisterMe.mutate({
      name: info.name,
      gender: info.gender,
      country: info.country,
      dateOfBirth: info.dateOfBirth,
    });
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
                  changeIsNameEditing={changeIsNameEditing}
                  changeUserName={changeUserName}
                  isNameEditing={isNameEditing}
                  userName={userName}
                />
                <EmailComponent />
                <GenderComponent changeGender={changeGender} gender={gender} />
                <DateOfBirthComponent
                  dateOfBirth={dateOfBirth}
                  changeDateOfBirth={changeDateOfBirth}
                  isDateOfBithEditing={isDateOfBithEditing}
                  changeIsDateOfBirthEditing={changeIsDateOfBirthEditing}
                />
                <CountryComponent
                  country={country}
                  changeCountry={changeCountry}
                />
              </div>
            </div>
            {RegisterMe.isLoading ? (
              <Loading />
            ) : (
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
