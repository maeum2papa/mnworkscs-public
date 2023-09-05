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
        let where = [];
        let joinWhere = '1';
        
        const {
            startRegDate,
            endRegData,
            recNum,
            recInvoice,
            name,
            mobile,
            forInvoice,
            status,
            brand,
            model
        } = body;
        
        if(startRegDate!=null && endRegData!=null){
    
            where.push("regDate>='"+startRegDate+" 00:00:00'");
            where.push("regDate<='"+endRegData+" 23:59:59'");
        
        } else if(startRegDate!=null && endRegData==null){
        
            where.push("regDate>='"+startRegDate+" 00:00:00'");
        
        } else if(startRegDate==null && endRegData!=null){
        
            where.push("regDate<='"+endRegData+" 23:59:59'");
        
        }

        if(recNum!=''){
            where.push("recNum='"+recNum+"'")
        }
        if(recInvoice!=''){
            where.push("recInvoice='"+recInvoice+"'")
        }

        if(name!=''){
            where.push("name='"+name+"'");
        }

        if(mobile!=''){
            where.push("mobile='"+mobile+"'");
        }

        if(forInvoice!=''){
            where.push("forInvoice='"+forInvoice+"'")
        }

        if(status!=''){
            where.push("status='"+status+"'")
        }
        
        if(brand!=''){
            where.push("brand='"+brand+"'");
        }
    
        if(model!=''){
            where.push("model='"+model+"'");
        }
    
        if (where.length > 0) {
            joinWhere = where.join(' and ');
        }

        if(body.limit && body.page){
            limit = `limit ${body.limit * (body.page - 1)}, ${body.limit}`
        }

        // console.log('joinWhere:', joinWhere);
        
        const [rows, fields] = await db.execute(
            "select * from w_as where "+joinWhere+" order by idx desc "+limit
        );

        //데이터 총 개수
        const [[{cnt}], fields2] = await db.execute(`SELECT COUNT(*) AS cnt FROM w_as`)
        
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