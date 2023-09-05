import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    const db = await mysql.createConnection(dbconf);

    try{
        let body = await request.json();
        let where = '';

        if(body.idx.length>0){
            where = body.idx.join(',');
        }
    
        if(where!=''){
            await db.execute("delete from w_serial where idx in("+where+")");
        }

        result = {msg:'ok'};
        statusCode = 200;
    } catch(error) {

    }
    db.end()
    return json(result,{status:statusCode})

}