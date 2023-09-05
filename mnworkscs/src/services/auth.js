import { postApi } from '../services/api';

const auth = async()=>{

    const res = await postApi({
        path:'/api/auth'
    });
    
    if(res.msg=="ok"){
        return "ok";
    }else{
        return '';
    }

}

export{
    auth
}