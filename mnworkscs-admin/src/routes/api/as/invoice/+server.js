import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    const db = await mysql.createConnection(dbconf);

    try {
        
        let body = await request.json();
        let where = [];
        let joinWhere = '1';
        
        const [rows, fields] = await db.execute(
            "select * from w_as where "+joinWhere+" order by idx desc limit 1000"
        );
        
        let res = {
            msg:'ok'
        }
    
        if(res.msg=='ok') {
            result = {msg:'ok',list:rows};
            statusCode = 200;
        }
    } catch(error) {

    }
    db.end()
    return json(result,{status:statusCode})

}