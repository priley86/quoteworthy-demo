import type { NextApiRequest, NextApiResponse } from 'next';

export default async function quotes(req: NextApiRequest, res: NextApiResponse) {
  try {
    const baseURL = 'https://auth0-exercise-quotes-api.herokuapp.com';
    const quotesURI = '/api/quotes';
    const queryParams = Object.keys(req.query)
      .map((key) => {
        return key + '=' + req.query[key];
      })
      .join('&');
    const url = `${baseURL}${quotesURI}${queryParams ? '?' + queryParams : ''}`;
    const response = await fetch(url);
    const quotes = await response.json();

    return res.status(response.status || 200).json(quotes);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message
    });
  }
}
