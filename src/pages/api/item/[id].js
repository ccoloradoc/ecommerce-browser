import ItemService from "browser/service/ItemService";

export default async function handler(req, res) {
    const { id } = req.query
    if (req.method === 'GET') {
      const items = await ItemService.findOne({
        id: id
      })
      res.status(200).json(items)
    } if(req.method === 'PUT') {
        const response = await ItemService.save(id, req.body)
        res.status(200).json(response)
        
    } else {
        res.status(400)
    }
  }