"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";

import { useState } from "react";

import MobileItem from "./MobileItem";
import Avatar from "@/app/components/Avatar";
import SettingsModal from "./SettingsModal";

const MobileFooter = ({ currentUser }) => {
  const routes = useRoutes();
  const { isOpen } = useConversation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isOpen) {
    return null;
  }

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="fixed flex justify-around w-full bottom-0 z-40 gap-x-2 items-center bg-white border-t-[1px] lg:hidden">
        {routes.map((route) => (
          <div key={route.href}>
            <MobileItem
              href={route.href}
              active={route.active}
              icon={route.icons}
              onClick={route.onClick}
            />
          </div>
        ))}

        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer hover:opacity-75 transition"
        >
          <Avatar user={currentUser} />
        </div>
      </div>
    </>
  );
};

export default MobileFooter;
