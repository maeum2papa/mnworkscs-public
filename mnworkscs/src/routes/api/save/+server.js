import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;
    const db = await mysql.createConnection(dbconf);

    try {
        let params = await request.json();
        let {
            name, 
            mobile, 
            email, 
            brand, 
            model, 
            serial, 
            buyDate, 
            receipt,
            personalUseDetail
        } = params
        
        //데이터베이스에 저장
        email = email.id+'@'+email.domain
        if(email=='@'){
            email='';
        }
    
        if(name!='' && serial!='' && mobile!=''){
    
            const query = "update w_serial set name=?, mobile=?, email=?,buyDate=?, receipt=?, regDate=now(), personalUseDetail=?,brand=?,model=? where serial=?";
            const data = [name, mobile, email, buyDate, receipt, JSON.stringify(personalUseDetail),brand, model,serial]
            
            await db.execute(query, data);
        }
    
        result = {msg:'ok'}
        status  = 200;
    } catch (error) {

    }
    db.end()
    return json(result,{status:status});
}