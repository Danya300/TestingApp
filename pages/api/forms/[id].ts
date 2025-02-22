import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    const form = await prisma.form.findUnique({
      where: { id: String(id) },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    })
    if (form) {
      res.status(200).json(form)
    } else {
      res.status(404).end()
    }
  } else if (req.method === "PUT") {
    const { title, questions } = req.body
    const updatedForm = await prisma.form.update({
      where: { id: String(id) },
      data: {
        title,
        questions: {
          deleteMany: {},
          create: questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: {
              create: q.options,
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    })
    res.status(200).json(updatedForm)
  } else if (req.method === "DELETE") {
    await prisma.form.delete({
      where: { id: String(id) },
    })
    res.status(204).end()
  } else {
    res.status(405).end()
  }
}

