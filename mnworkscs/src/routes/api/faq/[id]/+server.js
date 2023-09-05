import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;

    let where = [];
    let joinWhere = '1';

    const db = await mysql.createConnection(dbconf);

    try {
        let params = await request.json();
        
        const [rows, fields] = await db.execute("select * from w_faq where idx="+params.id+" order by idx desc");
        // const data = JSON.parse(rows)
        
        result = {msg:'ok', data: rows[0]}
        status  = 200;
    } catch(error) {

    }
    db.end()
    return json(result,{status:status});
}