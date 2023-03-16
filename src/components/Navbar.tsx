import { signIn, signOut } from "next-auth/react";
import type { LinkType } from "../lib/NavbarLinkProvider";
import Link from "next/link";
import PagesLinks from "../lib/PagesLink";
import { api } from "../utils/api";

const NavbarLinks: React.FC<{ links?: LinkType[] }> = ({ links }) => {
  return (
    <nav className="flex flex-wrap items-center justify-center text-base md:ml-auto">
      {!!links &&
        links.map((link) => (
          <Link
            href={link.href}
            key={link.Text}
            className="mr-5 rounded-md bg-inherit p-1 px-2 hover:bg-gray-100 hover:text-gray-900"
          >
            {link.Text}
          </Link>
        ))}
    </nav>
  );
};

const SignBtn: React.FC<{ signedOut?: boolean }> = ({ signedOut = false }) => {
  return (
    <button
      onClick={() => void (signedOut ? void signIn("google") : void signOut())}
      className="inline-flex items-center rounded border-0 bg-gray-900 py-1 px-3 text-base hover:bg-gray-700 focus:outline-none md:mt-0"
    >
      {signedOut ? "Sign In (via Google)" : "Sign Out"}
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="ml-1 h-4 w-4"
        viewBox="0 0 24 24"
      >
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </button>
  );
};

const Navbar: React.FC<{
  links?: LinkType[];
  signedOut?: boolean;
}> = ({ links, signedOut = false }) => {
  const deleteMe = api.me.deleteMyAccount.useMutation();

  return (
    <header className="body-font bg-gray-800">
      <div className="container mx-auto flex flex-row flex-wrap items-center justify-between p-4">
        <Link
          href={PagesLinks.HOME_Link}
          className="title-font mx-1 flex flex-wrap items-center justify-center text-base  font-medium"
        >
          <span className="text-2xl font-bold">Bilico</span>
        </Link>
        <NavbarLinks links={links} />
        <div>
          <SignBtn signedOut={signedOut} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
