// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // fetch from https://asia-southeast2-sejutacita-app.cloudfunctions.net/fee-assessment-categories
  const data = await fetch('https://asia-southeast2-sejutacita-app.cloudfunctions.net/fee-assessment-categories')
  const json = await data.json()
  res.status(200).json(json)
  // res.status(200).json({ name: 'John Doe' })
}


