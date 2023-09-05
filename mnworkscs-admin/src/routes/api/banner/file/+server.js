import { json } from "@sveltejs/kit";
import { dbconf } from "../../../../services/mysql";
import mysql from "mysql2/promise.js";
import { status } from "../../../../services/constants";
import fs from "fs";
import path from "path";
export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let statusCode  = 400;
    const db = await mysql.createConnection(dbconf);
    
    try{
        const now = new Date();
        const timestamp = now.getTime();

        let formData = await request.formData()
        let fileName = formData.get('name')
        let image = await formData.get('image').arrayBuffer();

        //파일명 확장자 제거
        let lastIndex = fileName.lastIndexOf('.') 
        let name = fileName.substr(0,lastIndex)
        let extention = fileName.substr(lastIndex)

        let fileSaveName = `${timestamp}${extention}`
        
        const buf = Buffer.from(image);
        const uploadPath = path.join(process.cwd(), 'static', 'images', fileSaveName);
        
        fs.writeFile(uploadPath, buf, err => {
            if (err) {
                // console.log('err:', err);
            } else {
            }
        });

        const cut = uploadPath.indexOf('/images')
        let url = uploadPath.substr(cut)
        
        result = {msg:'ok', data: url};
        statusCode = 200;

    } catch(error) {
        // console.log('error:', error);
    }

    db.end()
    return json(result,{status:statusCode})

}