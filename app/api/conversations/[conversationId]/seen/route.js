import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";

import prisma from "@/app/libs/prismadb";

export async function POST(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //find the existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        user: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    //find the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    //Update seen of last message
    const updateMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updateMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(conversationId, "message:update", updateMessage);

    return NextResponse.json(updateMessage);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
