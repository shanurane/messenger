import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { User } from "@prisma/client";
import useConversation from "@/app/hooks/useConversation";

const useOtherUser = (conversations) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    const otherUser = conversations.user.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser[0];
  }, [session?.data?.user?.email, conversations.user]);
  return otherUser;
};

export default useOtherUser;
