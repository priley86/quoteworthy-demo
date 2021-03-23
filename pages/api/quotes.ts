import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';

import prisma from '../../lib/prisma';
import { Prisma } from '.prisma/client';

export const findOrInsertUser = async (sub: string, authorName: string) => {
  const user = await prisma.user.findUnique({
    where: {
      sub: sub
    }
  });
  if (!user) {
    const createdUser = await prisma.user.create({
      data: {
        sub: sub,
        authorName: authorName
      }
    });
    return createdUser;
  } else return user;
};

export function toInteger(val: number | string | null | undefined): number | null {
  if (Number.isInteger(val as number)) {
    return val as number;
  } else {
    const casted = val ? Number(val) : null;
    return casted && Number.isInteger(casted) ? casted : null;
  }
}

export default withApiAuthRequired(async function quotes(req, res) {
  try {
    const { user } = getSession(req, res);
    const { authorName, text, sortBy, page, pageSize } = req.query;

    const queryPage = toInteger(page as string) ?? 1;
    const queryPageSize = toInteger(pageSize as string) ?? 10;
    const orderBy = [];
    const whereFilter = [];

    if (sortBy) {
      if (sortBy.includes(',')) {
        const sortByFields = (sortBy as string).split(',');
        sortByFields.forEach((f) => {
          const dir = f.includes('-') ? 'desc' : 'asc';
          const field = f.replace('-', '');
          orderBy.push({ [field]: dir });
        });
      } else {
        const dir = sortBy.includes('-') ? 'desc' : 'asc';
        const field = (sortBy as string).replace('-', '');
        orderBy.push({ [field]: dir });
      }
    }

    if (text) {
      whereFilter.push({ text: { contains: text as string, mode: Prisma.QueryMode.insensitive } });
    }

    if (authorName) {
      whereFilter.push({ authorName: { contains: authorName as string, mode: Prisma.QueryMode.insensitive } });
    }

    if (queryPage < 1) {
      return res.status(400).json({
        error: 'invalid_query_page',
        error_description: `Query page: '${page}' is invalid.`
      });
    }
    if (queryPageSize < 1 || queryPageSize > 50) {
      return res.status(400).json({
        error: 'invalid_query_page_size',
        error_description: `Query page size: '${pageSize}' is invalid.`
      });
    }
    if (user.sub) {
      const dbuser = await findOrInsertUser(user.sub, `${user.given_name} ${user.family_name}`);
      whereFilter.push({ author: { id: dbuser.id } });

      const quotes = await prisma.quote.findMany({
        orderBy: orderBy,
        skip: queryPageSize * (queryPage - 1),
        take: queryPageSize,
        where: {
          AND: whereFilter
        },
        select: {
          id: true,
          text: true,
          updatedAt: true
        }
      });

      const rowCount = await prisma.quote.count({
        where: {
          AND: whereFilter
        }
      });

      res.status(200).json({
        results: quotes,
        pagination: {
          page: queryPage,
          pageSize: queryPageSize,
          rowCount: rowCount,
          pageCount: Math.ceil(rowCount / queryPageSize)
        }
      });
    } else {
      return res.status(500).json({
        error: 'missing_sub',
        error_description: 'Token does not contain the Auth0 user sub.'
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
