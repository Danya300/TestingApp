import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const forms = await prisma.form.findMany()
    res.status(200).json(forms)
  } else if (req.method === "POST") {
    const { title, questions } = req.body
    const form = await prisma.form.create({
      data: {
        title,
        questions: {
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
    res.status(201).json(form)
  } else {
    res.status(405).end()
  }
}

