import { json } from "@sveltejs/kit";
import convert from "heic-convert";
import { promisify } from "util";
import fs from "fs";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let status  = 400;
    let params = await request.formData();
    const file = await params.get("file").arrayBuffer();
    // console.log(file);
    // let timeStamp = Math.floor((new Date()).getTime() / 1000)
    // fs.promises.writeFile(`./static/tmp/heic/${timeStamp}.heic`, Buffer.from(file));

    // console.log(params)

    // const inputBuffer = await promisify(fs.readFile)('./static/sample1.heic');
    const outputBuffer = await convert({
        buffer: Buffer.from(file), // the HEIC file buffer
        format: 'JPEG',      // output format
        quality: 1           // the jpeg compression quality, between 0 and 1
    });
    
    // await promisify(fs.writeFile)('./static/sample1.jpg', outputBuffer);
    result = {
        msg: 'ok',
        data: outputBuffer
    }
    db.end()
    return json(result,{status:status})
    
}