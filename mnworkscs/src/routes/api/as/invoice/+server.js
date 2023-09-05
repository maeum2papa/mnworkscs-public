import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    
    const db = await mysql.createConnection(dbconf);

    try {
        let params = await request.json();
        
        const [rows, fields] = await db.execute(
            "update w_as set recCourier=?, recInvoice=? where idx=?", [params.recCourier, params.recInvoice, params.idx]
        );
        
        let res = {
            msg:'ok'
        }
    
        if(res.msg=='ok') {
            result = {msg:'ok',list:rows};
            statusCode = 200;
        }
    } catch(error) {
        // console.log('error:', error);
    }
    db.end()
    return json(result,{status:statusCode})

}