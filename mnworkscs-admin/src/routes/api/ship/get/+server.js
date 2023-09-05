import { json } from '@sveltejs/kit';
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    let body = await request.json();
    const db = await mysql.createConnection(dbconf);
    
    try {
        
        const [rows,fields] = await db.execute(
            "select ships from w_ships where idx=1"
        );
            
        const data = JSON.parse(rows[0].ships)

        result = {msg:'ok', data: data}
        status = 200
    } catch (error) {
        
    }
    
    db.end()
    return json(result,{status:status})
}