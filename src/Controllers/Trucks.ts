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

export async function deleteTruck(id: number) {
    const queryText = 'DELETE FROM trucks WHERE id = $1';
    const values = [id];
    try {
        const result = await db.none(queryText, values);
        console.log(result);
        return result;
    } catch (e) {
        console.error('Error deleting truck:', e);
        throw e;
    }
}
export async function createTruck(load_capacity: number, Length: number,Height: number,Volume: number, type_id: number, Brand: number, experience: number, img: string) {
    const queryText = 'INSERT INTO trucks (load_capacity, "Length", "Height", "Volume", type_id, "Brand", experience, img) VALUES ($1, $2,$3,$4, $5, $6, $7, $8) RETURNING id';
    const values = [load_capacity, Length,Height,Volume, type_id, Brand, experience, img];
    try {
        const result = await db.one(queryText, values);
        console.log(result);
        return result;
    } catch (e) {
        console.error('Error creating truck:', e);
        throw e;
    }
}