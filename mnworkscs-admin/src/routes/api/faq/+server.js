import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    const db = await mysql.createConnection(dbconf);
    let limit = ""

    try {
        let body = await request.json();
        // let where = [];
        // let joinWhere = '1';
        if(body.limit && body.page){
            limit = `limit ${body.limit * (body.page - 1)}, ${body.limit}`
        }

        const [rows, fields] = await db.execute(
            "select * from w_faq where 1 order by sort desc "+limit
        );

        const [[{cnt}], fields2] = await db.execute(`SELECT COUNT(*) AS cnt FROM w_faq`)
    
        let res = {
            msg:'ok'
        }
    
        if(res.msg=='ok') {
            result = {msg:'ok',list:rows, totalDocs: cnt};
            statusCode = 200;
        }
    } catch(error) {

    }
    db.end()
    return json(result,{status:statusCode})

}