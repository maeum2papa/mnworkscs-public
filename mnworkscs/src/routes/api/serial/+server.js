import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let status  = 400;
    const db = await mysql.createConnection(dbconf);

    try {

        let params = await request.json();
    
        const [rows, fields] = await db.execute(
            'SELECT COUNT(*) AS cnt FROM w_serial WHERE serial=?',
            [params.serial]
        );

        if(rows[0].cnt==0){
    
        }else{
    
            if(rows[0].cnt == 1){
                //브랜드&모델과 맞는 시리얼 번호가 있고, 등록한 사용자가 있을 때
                const [rows2, fields2] = await db.execute(
                    "SELECT COUNT(*) AS cnt FROM w_serial WHERE serial=? and name!=''",
                    [params.serial]
                );
    
                if(rows2[0].cnt == 1) {
                    result = {msg:'duplication'}
                }else{
                     //브랜드&모델과 맞는 시리얼 번호가 없을 때
                    result = {msg:'ok'}
                    status  = 200;   
                }
            }
        }
    } catch(error){
        
    }
    db.end()
    return json(result,{status:status});
}