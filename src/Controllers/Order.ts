import {db} from "../db";

interface Order {
    truk_id: number;
    user_id: number;
    type_id: number;
    from: string;
    where: string;
    distanceCalc: number;
    weight: number;
    endprice: number;
    status: boolean;
    created_at: Date;
}

export const createOrder = async (order: Order): Promise<Order> => {
    const result = await db.one(
        'INSERT INTO "order" (truk_id, user_id, type_id, "from", "Where", distance, weight, endprice, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [order.truk_id, order.user_id, order.type_id, order.from, order.where, order.distanceCalc, order.weight, order.endprice, order.status, order.created_at]
    );
    return result;

};

export  const getOrder = async (userid:Number): Promise<Order[]> => {
    const result = await db.manyOrNone('SELECT * FROM "order" WHERE user_id = $1', [userid]);
    return result;
}

export const changeStatus = async (id: number): Promise<void> => {
    const result = await db.one('UPDATE "order" SET status = true WHERE id = $1', [id]);
    return result;
}