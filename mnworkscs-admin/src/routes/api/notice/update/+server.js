import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";
import { status } from "../../../../services/constants";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    const db = await mysql.createConnection(dbconf);
    
    try{
        let body = await request.json();

        await db.execute("update w_notice set subject=?, file=?, contents=?, modDate=now() where idx="+body.idx+"", [body.subject, body.file, body.contents]);

        result = {msg:'ok'};
        statusCode = 200;
    } catch(error) {
        // console.log('error:', error);
    }
    db.end()
    return json(result,{status:statusCode})

}