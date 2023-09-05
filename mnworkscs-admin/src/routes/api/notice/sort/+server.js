import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    const db = await mysql.createConnection(dbconf);
    
    try {
        let body = await request.json();
        // console.log('body:', body);

        const { notices } = body;

        for(let i=0; i<notices.length; i++){
            await db.execute(
                'update w_notice set sort=? where idx=?',
                [notices[i].sort, notices[i].idx]
            );

        }


        result = {msg:'ok'};
        statusCode = 200;

    } catch(error) {
        // console.log('error:', error);
    }
    db.end()
    return json(result,{status:statusCode})

}