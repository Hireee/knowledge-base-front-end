import { Router } from "express"


const router = Router()

router.get("/", (req: any, res: any) => {
  return res.status(200).send({ message: "Welcome to the Sales First API!" })
})


export default router