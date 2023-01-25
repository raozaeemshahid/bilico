import { signIn, useSession } from "next-auth/react";

import type { NextPage } from "next";
import Loading from "../components/loading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCallbackUrlFromRouter } from "../lib/helperFunctions";
import Head from "next/head";

const SignIn: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const [isSigningIn, changeIsSigningIn] = useState(false);
  useEffect(() => {
    changeIsSigningIn(false);
    if (!router.isReady) return;
    if (status == "authenticated")
      router.push(getCallbackUrlFromRouter(router));
  }, [router, router.isReady, status]);
  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="body-font flex h-screen ">
        <div className="container mx-auto flex flex-wrap items-center px-5 py-24">
          <div className="pr-0 md:w-1/2 md:pr-16 lg:w-3/5 lg:pr-0">
            <h1 className="title-font text-3xl font-medium text-white">
              Bilico - Let&apos;s Connect, Learn and Grow Together
            </h1>
            <p className="mt-4 leading-relaxed">
              A place to find friends and spaces of your interest, ask
              questions, teach what you know, learn from others and share your
              stories.
            </p>
          </div>
          <div className="mt-10 flex w-full flex-col rounded-lg bg-gray-800 bg-opacity-50 p-8 md:ml-auto md:mt-0 md:w-1/2 lg:w-2/6">
            {status == "unauthenticated" && !isSigningIn ? (
              <>
                <h2 className="title-font mb-5 text-2xl font-medium text-white">
                  Login
                </h2>
                <button
                  onClick={() => {
                    changeIsSigningIn(true);
                    signIn("google");
                  }}
                  className="rounded border-0 bg-blue-500 py-2 px-8 text-lg text-white hover:bg-blue-600 focus:outline-none"
                >
                  Continue with Google
                </button>
                <p className="mt-3 text-center text-sm">
                  If you aren&apos;t already registered, we&apos;ll set you up.{" "}
                </p>
              </>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </section>
    </>
  );
};
export default SignIn;
