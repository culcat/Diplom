import express from "express";
import * as db from '../Controllers/Services'

const router = express.Router()
/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags:
 *       - Services
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


router.get('/services',
    async (req: express.Request, res: express.Response) => {
        try {
            const services = await db.showServices();
            res.status(200).json({ services });
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    });

export default router;