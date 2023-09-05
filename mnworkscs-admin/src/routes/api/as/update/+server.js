import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";
import { status } from "../../../../services/constants";

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
        
        if(where!='' && body.status){
            await db.execute("update w_as set status=? where idx in("+where+")", [body.status]);
            if(body.status === status[1]) {
                await db.execute("update w_as set status=?, recDate=now() where idx in("+where+")", [body.status]);
            }
            if(body.status === status[3]) {
                await db.execute("update w_as set status=?, forDate=now() where idx in("+where+")", [body.status]);
            }
        }
        
        if(body.forInvoice){
            await db.execute("update w_as set forCourier=?, forInvoice=? where idx="+body.idx+"", [body.forCourier, body.forInvoice]);
        }

        result = {msg:'ok'};
        statusCode = 200;
    } catch(error) {
        // console.log('error:', error);
    }
    db.end()
    return json(result,{status:statusCode})

}