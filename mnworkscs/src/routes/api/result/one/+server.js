import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;
    const db = await mysql.createConnection(dbconf);

    try {
        let params = await request.json();
        
        const [rows, fields] = await db.execute("select * from w_as where idx=? limit 1",[params.idx]);

        // const data = JSON.parse(rows[0])
        if(rows.length){
            result = {msg:'ok', data:rows[0]}
            status  = 200;
        }
    } catch(error) {
        // console.log('error:', error);
    }
    db.end()
    return json(result,{status:status});
}