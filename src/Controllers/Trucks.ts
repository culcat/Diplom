import { db } from "../db";

export async function showTruck(type_id: number) {
    const queryText = 'SELECT * FROM trucks WHERE type_id = $1';
    const values = [type_id];
    try {
        const result = await db.manyOrNone(queryText, values);
        console.log(result);
        return result;
    } catch (e) {
        console.error('Error fetching trucks:', e);
        throw e;
    }
}
