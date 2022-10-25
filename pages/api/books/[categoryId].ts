// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch from https://asia-southeast2-sejutacita-app.cloudfunctions.net/fee-assessment-books with query strings
    const queryStrings = req.query;
  const data = await fetch(
    'https://asia-southeast2-sejutacita-app.cloudfunctions.net/fee-assessment-books?categoryId=' + queryStrings.categoryId + '&page=' + queryStrings.page + '&size=' + queryStrings.size
  );
  
  const json = await data.json();
  res.status(200).json(json);
}
