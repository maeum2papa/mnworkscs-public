import { json } from '@sveltejs/kit';
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    let body = await request.json();
    const db = await mysql.createConnection(dbconf);
    
    try {
        
        await db.execute(
            "update w_ships set ships=? where idx=1",
            [JSON.stringify(body)]
        );

        result = {msg:'ok'}
        status = 200
    } catch (error) {
        
    }
    
    db.end()
    return json(result,{status:status})
}