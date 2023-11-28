import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;

  const chats = await client.chatRoom.findUnique({
    where: {
      id: +id!.toString(),
    },
    include: {
      chats: {
        select: {
          id: true,
          chat: true,
          created: true,
          user: { select: { id: true, avatar: true } },
        },
      },
    },
  });

  res.json({
    ok: true,
    chats,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
