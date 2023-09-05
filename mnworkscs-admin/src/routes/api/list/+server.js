import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    const db = await mysql.createConnection(dbconf);

    try {
        
        let body = await request.json();
        let where = [];
        let joinWhere = '1';
        
        const {
            startSaleDate,
            endSaleDate,
            startRegDate,
            endRegDate,
            status,
            brand,
            name,
            mobile,
            model,
            serial,
            page
        } = body;
        
        if(startSaleDate!=null && endSaleDate!=null){
    
            where.push("regDate>='"+startSaleDate+" 00:00:00'");
            where.push("regDate<='"+endSaleDate+" 11:59:59'");
        
        } else if(startSaleDate!=null && endSaleDate==null){
        
            where.push("regDate>='"+startSaleDate+" 00:00:00'");
        
        } else if(startSaleDate==null && endSaleDate!=null){
        
            where.push("regDate<='"+endSaleDate+" 11:59:59'");
        
        }
    
        if(startRegDate!=null && endRegDate!=null){
    
            where.push("regDate>='"+startRegDate+" 00:00:00'");
            where.push("regDate<='"+endRegDate+" 11:59:59'");
        
        } else if(startRegDate!=null && endRegDate==null){
        
            where.push("regDate>='"+startRegDate+" 00:00:00'");
        
        } else if(startRegDate==null && endRegDate!=null){
        
            where.push("regDate<='"+endRegDate+" 11:59:59'");
        
        }

        if(status!=''){
            if(status=='등록'){
                where.push("name!=''");
            }else if(status=='대기'){
                where.push("name=''");
            }
        }
        
        if(brand!=''){
            where.push("brand='"+brand+"'");
        }
    
        if(name!=''){
            where.push("name='"+name+"'");
        }
    
        if(mobile!=''){
            where.push("mobile='"+mobile+"'");
        }
    
        if(model!=''){
            where.push("model='"+model+"'");
        }
    
        if(serial!=''){
            const array = []
            serial.split('\n').forEach(ele=>{
                if(ele !== '') {
                    array.push("serial='"+ele.replace(/[\s]/g, "")+"'")
                }
            })
    
            where.push('('+array.join(' or ')+')');
        }
    
        if (where.length > 0) {
            joinWhere = where.join(' and ');
        }
        
        const [rows, fields] = await db.execute(
            "select * from w_serial where "+joinWhere+" order by idx desc limit 1000"
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