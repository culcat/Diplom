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

export async function createTariff(name:string,price:number,icon:string,max_weight:string) {
    const queryText = 'INSERT into tariff (name, max_weight, price, icon) values ($1,$2,$3,$4) RETURNING id;'
    const values = [name,max_weight,price,icon];
    try{
         const result = await  db.one(queryText, values)
        return result.id;
    }catch(e){
        console.error('Error creating user:', e);
    }
}

export async function deleteTariff(id:number) {
    const queryText = 'DELETE FROM tariff WHERE id = $1';
    const values = [id];
    try{
        const result = await db.none(queryText, values)
        return result
    }catch(e){
        console.error('Error creating user:', e);
        throw e;
    }
}