import {db} from "../db";
import {query} from "express";

export async function showTariff() {
    const queryText = 'SELECT * FROM tariff';
    try{
        const result = await db.manyOrNone(queryText)
        console.log(result)
        return result
    }catch(e){
        console.error('Error creating user:', e);
        throw e;
    }
}
