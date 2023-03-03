import Link from "next/link";
import { LinkType } from "../lib/NavbarLinkProvider";

const SidebarLink: React.FC<{
  link: LinkType;
  count?: number;
  isActive?: boolean;
  children?: JSX.Element | JSX.Element[];
}> = ({ link, count, isActive = false, children }) => {
  if (isActive)
    return (
      <h3 className="flex text-lg items-center whitespace-nowrap rounded-lg bg-gray-700 p-1 pl-2">
        <link.icon />
        {!!count && count > 0 && <h3 className="pl-2">{count}</h3>}
        <h3 className="pl-2">{link.Text}</h3>
      </h3>
    );
  return (
    <Link
      className="flex items-center text-lg whitespace-nowrap rounded-lg p-1 pl-2 hover:bg-gray-700"
      href={link.href}
    >
      <link.icon />
      {!!count && count > 0 && <h3 className="pl-2">{count}</h3>}
      <h3 className="pl-2">{link.Text}</h3>
    </Link>
  );
};

export default SidebarLink;
