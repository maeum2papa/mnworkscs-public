const won = (number)=>{
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const dateFormat = (enterDate) => {
        
    // let res = '';

    // if(date!=null){
    //     if(date!='0000-00-00'){
    //         res = date.replace("T"," ");
    //         res = res.replace(".000Z","");
            
    //     }
    // }

    // return res;
    if(enterDate) {
        let date = new Date(enterDate);
        // const getTime = d.getTime() 
        // const date = new Date(getTime)
        
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()

        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;
        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;
    
        return date.getFullYear() + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second

    } else {
        return ""
    }
}

const linkToThumbnail = (link) => {
    const index = link.indexOf('v=')
    const id = link.substr(index+2, 11)
    const thumbnail = 'https://img.youtube.com/vi/'+id+'/0.jpg'
    return thumbnail
}

const nullRemove = (data) => {
    if(data === null) {
        return ""
    } else {
        return data
    }
}


export{
    won,
    dateFormat,
    linkToThumbnail,
    nullRemove
}