const won = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


//날짜 형식
const dateFormat = (enterDate) => {
    // const TIME_ZONE = 9 * 60 * 60 * 1000;
    // const d = new Date(date).getTime() + TIME_ZONE
    
    // return new Date(d).toISOString().replace('T', ' ').slice(0, -5);
    if(enterDate) {
        let d = new Date(enterDate);

        const getTime = d.getTime() 
        const date = new Date(getTime)
        
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
        // console.log(date.getFullYear() + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second)
        return date.getFullYear() + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second

    } else {
        return ""
    }
}


//접수번호
function randomNumber(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] % charactersLength));
    }

    return result;
}

function orderNumber() {
    const datePart = getFormattedDate(); //날짜
    const randomNumberPart = randomNumber(6);
    return String(datePart + randomNumberPart);
}

function getFormattedDate() {
    const today = new Date();
    // const year = today.getFullYear().toString().slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return month + day;
}


export {
    won,
    dateFormat,
    orderNumber
}