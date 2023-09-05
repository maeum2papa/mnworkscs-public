import { json } from '@sveltejs/kit';
import { getCookie,setCookie } from '../../../services/cookie'
 
export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let status = 400

    let token = getCookie(cookies,'token');
    
    if(token=='adminadminadminmnsworkcs'){
        result = {msg:'ok'}
        status = 200
    }
    
    return json(result,{status:status});
}