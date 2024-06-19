import {db} from "../db";
import {query} from "express";

export async function showServices() {
    const queryText = 'SELECT * FROM services';
    try{
        const result = await db.manyOrNone(queryText)
        console.log(result)
        return result
    }catch(e){
        console.error('Error creating user:', e);
        throw e;
    }
}
export async function createService(name:string,price:number,icon:string) {
     const queryText = 'INSERT into services (name, price, img) values ($1,$2,$3) RETURNING id;'
    const values = [name,price,icon];
    try{
         const result = await  db.one(queryText, values)
        return result.id;
    }catch(e){
        console.error('Error creating user:', e);
    }
}

export async function deleteService(id:number) {
    const queryText = 'DELETE FROM services WHERE id = $1';
    const values = [id];
    try{
        const result = await db.none(queryText, values)
        return result
    }catch(e){
        console.error('Error creating user:', e);
        throw e;
    }
}