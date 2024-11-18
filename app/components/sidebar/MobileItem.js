"use client";

import Link from "next/link";
import clsx from "clsx";

const MobileItem = ({ href, icon: Icon, active, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      return onClick;
    }
  };

  return (
    <Link
      onClick={onClick}
      href={href}
      className={clsx(
        `group flex gap text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-600 hover:text-black hover:bg-gray-100`,
        active && "bg-gray-100 text-black"
      )}
    >
      <Icon size={24} />
    </Link>
  );
};

export default MobileItem;
