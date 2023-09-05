import { json } from '@sveltejs/kit';
import { dbconf } from '../../../../services/mysql';
import mysql from "mysql2/promise.js";

export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400;
    let models = {models:[]};
    let body = await request.json();
    const db = await mysql.createConnection(dbconf);

    try {
        if(body.length>0){
    
            let m =0;
            let b = -1;
            let tmpBrand = '';
    
            for(let item of body){
    
                let nowBrand = item.브랜드;
    
                if(tmpBrand!=nowBrand){
                    tmpBrand = item.브랜드;
                    b = b + 1;
                    models.models[b] = {
                        brand:item.브랜드,
                        model:[item.모델]
                    }
                }else{
                    models.models[b].model.push(item.모델);
                }
    
                m = m + 1;
            }
    
            
            await db.execute(
                "update w_brand_model set models=?,modDate=now()  where idx=1",
                [JSON.stringify(models)]
            );
    
            result = {msg:'ok'}
            status = 200
        }
    } catch(error) {

    }
    db.end()
    return json(result,{status:status})
}