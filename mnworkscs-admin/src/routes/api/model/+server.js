import { json } from '@sveltejs/kit';
import { getCookie } from '../../../services/cookie';
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";


export async function GET({request,cookies}) {
    let result = {msg:'no'}
    let status = 400
    const db = await mysql.createConnection(dbconf);

    try {
        const [rows, fields] = await db.execute(
            "select * from w_brand_model where 1"
        );

        const data = JSON.parse(rows[0].models)
        
        result = {msg:'ok', data: data.models}
        status = 200;
    } catch(error) {

    }
    db.end()
    return json(result,{status:status})
    
}

export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400
    let body = await request.json();
    const db = await mysql.createConnection(dbconf);
    
    try {
        const access_token = getCookie(cookies,'access_token');
        let modDate = new Date();
        const newModel = {"models":body};
    
        await db.execute(
            "update w_brand_model set models=?,modDate=now()  where idx=1",
            [JSON.stringify(newModel)]
        );
        result = {msg:'ok'}
        status = 200
    } catch (error) {
        
    }
    
    db.end()
    return json(result,{status:status})
}