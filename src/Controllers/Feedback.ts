import {db} from "../db";
import {query} from "express";

export async function showFeedback() {
    const queryText = 'SELECT * FROM feedback';
    try{
        const result = await db.manyOrNone(queryText)
        console.log(result)
        return result
    }catch(e){
    console.error('Error creating user:', e);
    throw e;
    }
}


export async function createFeedback(user_id:number,message:string) {
    const queryText = 'INSERT into feedback (message,user_id) values ($1,$2) RETURNING id;'
    const values = [user_id,message];
    try{
         const result = await  db.one(queryText, values)
        return result.id;
    }catch(e){
        console.error('Error creating user:', e);
    }

}