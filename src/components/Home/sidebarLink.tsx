import Link from "next/link";
import { type LinkType } from "../../lib/NavbarLinkProvider";

const SidebarLink: React.FC<{ link: LinkType; count?: number }> = ({
  link,
  count,
}) => {
  return (
    <Link
      className="mt-4 flex items-center rounded-lg p-1 pl-2 text-lg hover:bg-gray-700"
      href={link.href}
    >
      <link.icon />
      <h3 className="pl-2">{count && count > 0 ? `${count}` : ""}</h3>
      <h3 className="pl-2">{link.Text}</h3>{" "}
    </Link>
  );
};

export default SidebarLink;
