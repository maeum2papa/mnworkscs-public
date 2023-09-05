import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    
    const db = await mysql.createConnection(dbconf);

    try {
        
        
        const [rows, fields] = await db.execute(
            "select ships from w_ships where idx=1"
        );
        
        result = {msg:'ok',data:JSON.parse(rows[0].ships)};
        statusCode = 200;

    } catch(error) {
        // console.log('error:', error);
    }
    db.end()
    return json(result,{status:statusCode})

}