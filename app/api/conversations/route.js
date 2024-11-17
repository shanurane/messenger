import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          user: {
            connect: [
              ...members.map((member) => ({ id: member.value })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          user: true,
        },
      });

      newConversation.user.forEach((users) => {
        if (users.email) {
          pusherServer.trigger(
            users.email,
            "conversation:new",
            newConversation
          );
        }
      });

      return NextResponse.json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            UserIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            UserIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        user: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        user: true,
      },
    });

    newConversation.user.map((users) => {
      if (users.email) {
        pusherServer.trigger(users.email, "conversation:new", newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
