import {db} from "../db";
import {query} from "express";

export async function showFeedback() {
    const queryText = 'SELECT * FROM feedback';
    try {
        const feedback = await db.manyOrNone(queryText);
        const feedbackWithUsernames = await Promise.all(feedback.map(async (item) => {
            const user = await getUserById(item.user_id);
            return { ...item, username: user.firstname };
        }));
        console.log(feedbackWithUsernames);
        return feedbackWithUsernames;
    } catch (e) {
        console.error('Error getting feedback:', e);
        throw e;
    }
}

async function getUserById(userId:number) {
    const queryText = 'SELECT firstname FROM public."Users" WHERE id = $1';
    try {
        const user = await db.one(queryText, [userId]);
        return user;
    } catch (e) {
        console.error('Error getting user by ID:', e);
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
export async function deleteFeedback(id:number) {
    const queryText = 'DELETE FROM feedback WHERE id = $1';
    const values = [id];
    try{
        const result = await db.none(queryText, values)
        return result
    }catch(e){
        console.error('Error creating user:', e);
        throw e;
    }
}