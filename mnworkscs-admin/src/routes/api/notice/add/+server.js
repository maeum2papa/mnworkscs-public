import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let status  = 400;
    const db = await mysql.createConnection(dbconf);

    try{
        let body = await request.json();
        
        const sql = "insert into w_notice (subject, contents, file, writer, regDate, hits, sort) values (?,?,?,'mnworks',now(), 0, (select ifnull(max(T.sort), 0)+1 from w_notice T))"

        await db.execute(sql, [
            body.subject, body.contents, body.file
        ]);

        result = {msg:'ok'};
        status = 200;

    } catch(error) {
        // console.log('error:', error);
    }
    db.end()
    return json(result,{status:status})
}