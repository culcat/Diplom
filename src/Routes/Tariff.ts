import express from "express";
import * as db from '../Controllers/Tariff'

const router = express.Router()
/**
 * @swagger
 * /api/tariff:
 *   get:
 *     summary: Get all tariff
 *     responses:
 *       200:
 *         description: Returns all feedback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedback:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: string
 *                       message:
 *                         type: string
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

export default router;