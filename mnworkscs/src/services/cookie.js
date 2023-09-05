import {chash,encrypt,decrypt} from "../services/encrypt";

const setCookie = (name='',value='',time=0) =>{
    // cookies.set(chash(key), encrypt(value), {
    //     path: '/',
    //     httpOnly: true,
    //     secure: false,
    //     maxAge: time
    // })

    // var exdate = new Date();
    // exdate.setDate(exdate.getDate() + time);
    // var cookieValue = value + ((time == null) ? '' : '; expires=' + exdate.toUTCString());
    // document.cookie = name + '=' + cookieValue;
    
    var date = new Date(Date.now() + time)
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';expires=' + date + ';path=/';
}

const getCookie = (name='') => {
    // return document.cookie
    // let matches = document.cookie.match(new RegExp(
    // "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    // ));
    // return matches ? decodeURIComponent(matches[1]) : undefined;
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? decodeURIComponent(value[2]) : null;
}

const delCookie = (cookies = {}, key='') => {
    // cookies.delete(chash(key))
    cookies.set(chash(key), '', {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 0
    })
}

export{
    getCookie,
    setCookie,
    delCookie
}