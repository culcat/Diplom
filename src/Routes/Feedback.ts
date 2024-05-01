import express from "express";
import * as db from '../Controllers/Feedback'

const router = express.Router()
/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Get all feedback
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
 *   post:
 *     summary: Create a new feedback
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               message:
 *                 type: number
 *     responses:
 *       200:
 *         description: Feedback created successfully
 *       400:
 *         description: Bad request, missing required fields
 *       500:
 *         description: Internal server error
 */


router.get('/feedback',
    async (req: express.Request, res: express.Response) => {
        try {
            const feedbacks = await db.showFeedback();
            res.status(200).json({ feedbacks });
        } catch (err: any) {
            res.status(500).send({ error: err.message });
        }
    });


router.post('/feedback', (req: express.Request, res: express.Response) => {
    try {
        const { user_id, message } = req.body;
        if (!user_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
       db.createFeedback(user_id, message);
        res.status(200).json({message:'create'})
    }catch(err: any) {
        res.status(500).send({error: err.message})
    }
})

export default router;