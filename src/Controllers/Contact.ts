import {db} from "../db";

export async function getAdmin() {
    const queryText = 'SELECT tgid FROM public."Users" where role = $1';
    const values = ['admin'];
    try{
        const result = await db.manyOrNone(queryText,values)
        console.log(result)
        return result
    }catch(e){
        console.error('Error creating user:', e);
        throw e;
    }
}

export async function getCustomer(id:Number) {
    const queryText = 'SELECT * FROM public."Users" where id = $1';
    const values = [id];
    try{
        const result = await db.manyOrNone(queryText,values)
        console.log(result)
        return result
    }catch(e){
        console.error('Error creating user:', e);
        throw e;
    }
}