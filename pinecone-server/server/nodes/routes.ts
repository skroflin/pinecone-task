import { Router, Request, Response, NextFunction } from 'express'
import {
    getNodeById,
    getAllNodes,
    insertNode,
    updateNode,
    moveNode,
    changeNodeOrder,
    deleteNode
} from './service'

const router = Router()

router.get("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await getAllNodes())
    } catch (e) {
        next(e)
    }
})

router.get("/:id", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        res.json(await getNodeById(id))
    } catch (e) {
        next(e)
    }
})

router.post("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { title, parentNodeId, ordering } = req.body
        res.json(await insertNode(title, parentNodeId, ordering))
    } catch (e) {
        next(e)
    }
})

router.put("/:id", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const { title } = req.body
        res.json(await updateNode(id, title))
    } catch (e) {
        next(e)
    }
})

router.put("/:id/move", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const { parentNodeId } = req.body
        res.json(await moveNode(id, parentNodeId))
    } catch (e) {
        next(e)
    }
})

router.put("/:id/order", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const { ordering } = req.body
        const node = await getNodeById(id)
        res.json(await changeNodeOrder(id, ordering, node.parentNodeId))
    } catch (e) {
        next(e)
    }
})

router.delete("/:id", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        await deleteNode(id)
        res.sendStatus(200)
    } catch (e) {
        next(e)
    }
})

module.exports = router