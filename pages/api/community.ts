import { withApiAuthRequired } from '@auth0/nextjs-auth0';

import prisma from '../../lib/prisma';
import { toInteger } from './quotes';
import { Prisma } from '.prisma/client';

export default withApiAuthRequired(async function quotes(req, res) {
  try {
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
      whereFilter.push({
        author: {
          authorName: { contains: authorName as string, mode: Prisma.QueryMode.insensitive }
        }
      });
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
        updatedAt: true,
        author: {
          select: {
            sub: true,
            authorName: true
          }
        }
      }
    });

    const rowCount = await prisma.quote.count({
      where: {
        AND: whereFilter
      }
    });

    const quotesMapped = quotes.length
      ? quotes.map((q) => {
          return {
            id: q.id,
            text: q.text,
            updatedAt: q.updatedAt,
            sub: q.author.sub,
            authorName: q.author.authorName
          };
        })
      : [];

    res.status(200).json({
      results: quotesMapped,
      pagination: {
        page: queryPage,
        pageSize: queryPageSize,
        rowCount: rowCount,
        pageCount: Math.ceil(rowCount / queryPageSize)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message
    });
  }
});
