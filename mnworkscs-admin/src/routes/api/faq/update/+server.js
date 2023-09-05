import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    const db = await mysql.createConnection(dbconf);
    
    try{
        let body = await request.json();
        // console.log('body:', body);
        let where = '';

        const [rows] = await db.execute("update w_faq set cate=?, subject=?, contents=?, modDate=now() where idx="+body.idx+"", [body.cate, body.question, body.answer]);
        result = {msg:'ok'};
        statusCode = 200;

    } catch(error) {
        // console.log('error:', error);
    }
    db.end()
    return json(result,{status:statusCode})

}