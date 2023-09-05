import { json } from "@sveltejs/kit"; 
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;
    const db = await mysql.createConnection(dbconf);
    let brands = []

    try {
        const [rows, fields] = await db.execute("select * from w_brand_model where 1");
        const data = JSON.parse(rows[0].models)

        data.models.forEach(ele => brands.push(ele.brand))

        result = {msg:'ok', data:brands}
        status  = 200;
    } catch(error) {

    }
    
    db.end()
    return json(result,{status:status});


    /*
    let brands = ['스틸시리즈'];

    result = {msg:'ok',data:brands}
    status  = 200;
    */

    // return json(result,{status:status});
}

