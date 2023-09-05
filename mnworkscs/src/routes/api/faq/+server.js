import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;
    const db = await mysql.createConnection(dbconf);
    let where = [];
    let joinWhere = '1';
    let limit = "";
    let offset = "";

    try {
        let params = await request.json();
        
        if(params.limit && params.page){
            limit = `limit ${params.limit * (params.page - 1)}, ${params.limit}`
        }

        if(params.category){
            where.push("cate='"+params.category+"'");
        }

        //검색 키워드
        if(params.keyword){
            where.push("(subject like '%"+params.keyword+"%' or contents like '%"+params.keyword+"%')");
        }
        
        if (where.length > 0) {
            joinWhere = where.join(' and ');
        }

        //조회수 증가
        if(params.id) {
            await db.execute("update w_faq set hits = hits + 1 where idx="+params.id+" order by sort desc");
        }
        
        const [rows, fields] = await db.execute("select * from w_faq where "+joinWhere+" order by sort desc "+limit);

        const [rows2, fields2] = await db.execute("SELECT count(*) as cnt FROM w_faq where "+joinWhere);
        
        result = {msg:'ok', data: rows, totalDocs: rows2[0].cnt}
        status  = 200;
    } catch(error) {
        // console.log('error:', error);
    }
    db.end();
    return json(result,{status:status});
}