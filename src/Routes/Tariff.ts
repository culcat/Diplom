import express from "express";
import * as db from '../Controllers/Tariff'

const router = express.Router()
/**
 * @swagger
 * /api/tariff:
 *   get:
 *     summary: Get all tariffs
 *     tags:
 *       - Tariff
 *     responses:
 *       200:
 *         description: Returns all tariffs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tariff:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       icon:
 *                         type: string
 *                       max_weight:
 *                         type: number
 *   post:
 *     summary: Create a new tariff
 *     tags:
 *       - Tariff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Standard"
 *               price:
 *                 type: number
 *                 example: 100.50
 *               icon:
 *                 type: string
 *                 example: ""
 *               max_weight:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Returns the created tariff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tariff:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     icon:
 *                       type: string
 *                     max_weight:
 *                       type: number
 *   delete:
 *     summary: Delete a tariff
 *     tags:
 *       - Tariff
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the tariff to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the tariff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tariff deleted successfully"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 */

router.get('/tariff',
    async (req: express.Request, res: express.Response) => {
        try {
            const tariff = await db.showTariff();
            res.status(200).json({ tariff });
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    });


router.post('/tariff',
    async (req: express.Request, res: express.Response) => {
        try {
            const tariff = await db.createTariff(req.body.name,req.body.price,req.body.icon,req.body.max_weight);
            res.status(200).json({ tariff });
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    });

router.delete('/tariff',
    async (req: express.Request, res: express.Response) => {
        try {
            const tariff = await db.deleteTariff(Number(req.query));
            res.status(200).json({ tariff });
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    });

export default router;