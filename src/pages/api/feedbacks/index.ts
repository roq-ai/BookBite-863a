import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { feedbacksValidationSchema } from 'validationSchema/feedbacks';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getFeedbacks();
    case 'POST':
      return createFeedbacks();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFeedbacks() {
    const data = await prisma.feedbacks.findMany({});
    return res.status(200).json(data);
  }

  async function createFeedbacks() {
    await feedbacksValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.feedbacks.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
