import { json } from '@sveltejs/kit';
import { delCookie } from '../../../services/cookie';

export async function GET({request,cookies}){
    
    let result = {msg:'ok'}
    let status = 200
    
    delCookie(cookies,'token');

    return json(result,{status:status})
}