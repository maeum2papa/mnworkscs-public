import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;
    const db = await mysql.createConnection(dbconf);
    const models = []

    try {
        let params = await request.json();
        
        const [rows, fields] = await db.execute("select * from w_brand_model where 1");
        const data = JSON.parse(rows[0].models)

        data.models.forEach(ele => {
            if(ele.brand === params.brand) {
                ele.model.forEach(ele => models.push(ele))
            }
        })

        result = {msg:'ok',data:models,brand:params.brand}
        status  = 200;
    } catch(error) {

    }
    db.end()
    return json(result,{status:status});
}