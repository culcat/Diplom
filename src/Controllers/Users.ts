import { db } from "../db";

export async function createUser(
    phone_number: string,
    password_hashed: string,
    email: string,
    firstname: string,
    lastname: string,
    thirdname: string,
    tgid: string,
    company: string,
) {
    const queryText =
        'INSERT INTO public."Users" (phone_number, password_hashed,email,firstname,lastname,thirdname,tgid,company) VALUES ($1, $2) RETURNING id';
    const values = [
        phone_number,
        password_hashed,
        email,
        firstname,
        lastname,
        thirdname,
        tgid,
        company,
    ];

    try {
        const result = await db.one(queryText, values);
        return result.id;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

export async function getUserByUsername(phone_number: string) {
    const queryText = 'SELECT * FROM public."Users" WHERE phone_number = $1';
    const values = [phone_number];

    try {
        const user = await db.oneOrNone(queryText, values);
        console.log(user)
        return user;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}

// export async function updateCode(username:string,code:number) {
//     const queryText = "UPDATE public.users SET code=$1 WHERE username=$2;"
//     const values = [code,username]
//     await db.oneOrNone(queryText,values)
//     return code
// }

// export async function checkCode(username:string){
//     const queryText = "SELECT code FROM users WHERE username = $1"
//     const values =[username]
//     const code = await db.oneOrNone(queryText,values)
//     return code
//
// }

// export async function GetTgID(username:string) {
//     const queryText = 'SELECT tgid FROM users WHERE username = $1'
//     const values = [username]
//     const ID = await db.oneOrNone(queryText,values)
//     return ID
// }
