import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let status  = 400;
    const db = await mysql.createConnection(dbconf);

    try{
        let body = await request.json();
        let i = 0;
        let tmpStorage = '';
    
        for (let item of body) {

            if(i>1 && item.__EMPTY_9 && item.__EMPTY_10 && item.__EMPTY_9!='' && item.__EMPTY_10!=''){
                const [rows, fields] = await db.execute(
                    "select count(*) as cnt from w_serial where serial=?",
                    [item.__EMPTY_10]
                );

                if (rows[0].cnt == 0) {
                    if(tmpStorage!=''){
                        tmpStorage = tmpStorage + ",('"+item.__EMPTY_10+"')";
                    }else{
                        tmpStorage = "('"+item.__EMPTY_10+"')";
                    }
                }
            }
      
            i = i + 1;
        }
    
        if(tmpStorage!=''){
            await db.execute("insert into w_serial(serial) values" + tmpStorage);
        };

        result = {msg:'ok'};
        status = 200;

    } catch(error) {

    }
    db.end()
    return json(result,{status:status})
}