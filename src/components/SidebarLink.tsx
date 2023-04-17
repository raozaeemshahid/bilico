import Link from "next/link";
import type { LinkType } from "../lib/NavbarLinkProvider";

const SidebarLink: React.FC<{
  link: LinkType;
  count?: number;
  isActive?: boolean;
}> = ({ link, count, isActive = false }) => {
  if (isActive)
    return (
      <div className="flex items-center whitespace-nowrap rounded-lg bg-gray-700 p-1 pl-2 text-lg">
        <link.icon />
        {!!count && count > 0 && <h3 className="pl-2">{count > 9 ? "9+" : count}</h3>}
        <h3 className="pl-2">{link.Text}</h3>
      </div>
    );
  return (
    <Link
      className="flex items-center whitespace-nowrap rounded-lg p-1 pl-2 text-lg hover:bg-gray-700"
      href={link.href}
    >
      <link.icon />
      {!!count && count > 0 && <h3 className="pl-2">{count}</h3>}
      <h3 className="pl-2">{link.Text}</h3>
    </Link>
  );
};

export default SidebarLink;
