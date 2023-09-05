import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;
    const db = await mysql.createConnection(dbconf);
    
    try {
        let params = await request.json();
        
        const [rows, fields] = await db.execute(
            'SELECT COUNT(*) AS cnt FROM w_serial WHERE serial=?',
            [params.serial]
        );
    
        if(rows[0].cnt === 1) {
            result = {msg:'ok'}
            status  = 200;
        }

    } catch(error) {

    }
    db.end()
    return json(result,{status:status});
}