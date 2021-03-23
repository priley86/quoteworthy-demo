import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

import prisma from '../../../lib/prisma';
import { findOrInsertUser } from '../quotes';

export default withApiAuthRequired(async function post(req, res) {
  try {
    const { user } = getSession(req, res);
    const { text } = req.body;

    if (!user.sub) {
      return res.status(500).json({
        error: 'missing_sub',
        error_description: 'Token does not contain the Auth0 user sub.'
      });
    }

    if (!text) {
      return res.status(400).json({
        error: 'missing_text',
        error_description: 'Missing quote text.'
      });
    }
    const dbuser = await findOrInsertUser(user.sub, `${user.given_name} ${user.family_name}`);
    if (dbuser) {
      const result = await prisma.quote.create({
        data: {
          text: text,
          author: { connect: { sub: user.sub } }
        }
      });
      return res.json(result);
    } else {
      return res.status(400).json({
        error: 'unable_to_create_or_find_user',
        error_description: 'Unable to find or create user.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message
    });
  }
});
