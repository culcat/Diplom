import express from "express";
import { showTruck } from '../Controllers/Trucks';

const router = express.Router();

/**
 * @swagger
 * /api/trucks:
 *   get:
 *     summary: Get trucks by type
 *     description: Retrieve a list of trucks based on the provided type header parameter.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *         required: true
 *         description: The type of trucks to retrieve.
 *     responses:
 *       200:
 *         description: A list of trucks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trucks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       type:
 *                         type: integer
 *                       model:
 *                         type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Type header parameter is required
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 */

router.get('/trucks', async (req: express.Request, res: express.Response) => {
    const type = req.query.type;
    if (!type) {
        return res.status(400).json({ error: 'Type header parameter is required' });
    }

    try {
        const trucks = await showTruck(Number(type));
        res.status(200).json({ trucks });
    } catch (err: any) {
        res.status(500).send({ error: err.message });
    }
});

export default router;
