import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { formId, answers } = req.body

    // Save the submission
    const submission = await prisma.submission.create({
      data: {
        formId,
        answers: JSON.stringify(answers),
      },
    })

    // Calculate the score (this is a simple example, you can implement more complex logic)
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { questions: true },
    })

    const totalQuestions = form.questions.length
    const answeredQuestions = Object.keys(answers).length
    const score = (answeredQuestions / totalQuestions) * 100

    res.status(201).json({ submission, score })
  } else {
    res.status(405).end()
  }
}

