import { json } from "@sveltejs/kit";
import { setCookie } from "../../../services/cookie";

export async function POST({request,cookies}){
    
    let result  = {msg:'no'};
    let status  = 400;
    let params = await request.json()
    
    if( params.email === 'admin' && params.password === 'mk194215' ){
        setCookie(cookies,'token','adminadminadminmnsworkcs',(60 * 60 * 24));
        result = {msg:'ok'};
        status = 200;
    }

    return json(result,{status:status})

}