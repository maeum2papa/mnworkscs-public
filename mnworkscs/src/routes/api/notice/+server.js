import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;

    let where = [];
    let joinWhere = '1';

    const db = await mysql.createConnection(dbconf);

    try {
        let params = await request.json();
        
        if(params.keyword){
            where.push("subject like '%"+params.keyword+"%' or contents like '%"+params.keyword+"%'");
        } 

        if (where.length > 0) {
            joinWhere = where.join(' and ');
        }

        //조회수 증가
        if(params.id) {
            await db.execute("update w_notice set hits = hits + 1 where idx="+params.id+" order by idx desc");
        }

        const [rows, fields] = await db.execute("select * from w_notice where "+joinWhere+" order by idx desc limit "+(params.limit * (params.page - 1))+","+params.limit+"");
        
        //데이터 총 개수
        const [rows2, fields2] = await db.execute(`SELECT COUNT(*) AS cnt FROM w_notice`)


        result = {msg:'ok', data: rows, totalDocs: rows2[0].cnt}
        status  = 200;
    } catch(error) {

    }
    db.end()
    return json(result,{status:status});
}