import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";
import { chash } from "../../../services/encrypt";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;
    const db = await mysql.createConnection(dbconf);
    let where = [];
    let joinWhere = '1';

    try {
        let params = await request.json();
        // console.log('params:', params);
        if(params.name!=''){
            where.push("name='"+params.name+"'");
        }
    
        if(params.mobile!=''){
            where.push("mobile='"+params.mobile+"'");
        }

        if(params.pass!=''){
            where.push("pass='"+chash(params.pass)+"'");
        }

        if (where.length > 0) {
            joinWhere = where.join(' and ');
        }
        const [rows, fields] = await db.execute("select * from w_as where "+joinWhere+" order by idx desc limit "+(params.limit * (params.page - 1))+","+params.limit+"");

        const [[{cnt}], fields2] = await db.execute("SELECT count(*) as cnt FROM w_as where "+joinWhere);

        // const data = JSON.parse(rows[0])
        if(rows.length){
            result = {msg:'ok', data:rows, totalDocs: cnt}
            status  = 200;
        }
    } catch(error) {
        // console.log('error:', error);
    }
    db.end()
    return json(result,{status:status});
}