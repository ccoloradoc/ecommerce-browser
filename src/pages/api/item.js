import ItemService from "browser/service/ItemService";

export default async function handler(req, res) {
    const { query } = req
    if (req.method === 'GET') {
      const items = await ItemService.findItems(query)
      res.status(200).json(items)
    } if(req.method === 'POST') {
        const body = JSON.parse(req.body)
        res.status(400).json(body)
    } else {
        res.status(400)
    }
  }