import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    let body = await request.json();
    const db = await mysql.createConnection(dbconf);

    try{
        let where = '';

        if(body.idx.length>0){
            where = body.idx.join(',');
        }
    
        if(where!=''){
            await db.execute("update w_serial set name='', mobile='', email='', brand='',model='', buyDate = null, receipt='', ad='', regDate = null, personalUseDetail = null where idx in("+where+")");
        };

        result = {msg:'ok'};
        statusCode = 200;

    } catch(error) {

    }
    db.end()
    return json(result,{status:statusCode})

}