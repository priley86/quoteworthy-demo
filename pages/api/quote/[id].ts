import { withApiAuthRequired } from '@auth0/nextjs-auth0';

import prisma from '../../../lib/prisma';

export default withApiAuthRequired(async function quote(req, res) {
  try {
    const {
      query: { id },
      method
    } = req;

    if (method === 'PUT') {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({
          error: 'missing_text',
          error_description: 'Missing quote text.'
        });
      }
      const quote = await prisma.quote.update({
        where: { id: Number(id) },
        data: { text: text as string }
      });
      return res.json(quote);
    }

    if (method === 'DELETE') {
      const quote = await prisma.quote.delete({
        where: { id: Number(id) }
      });
      return res.json(quote);
    }

    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message
    });
  }
});
