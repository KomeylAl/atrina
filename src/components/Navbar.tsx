import { getDictionary } from "@/locales/dictionaries";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({
  dict,
}: {
  dict: any;
}) => {
  const navLinks = dict.header.navLinks;

  const currentPageName = usePathname();
  return (
    <div>
      {navLinks.map((link: any) => (
        <Link
          key={link.path}
          href={link.path}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentPageName === link.path
              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
