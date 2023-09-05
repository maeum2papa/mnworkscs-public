import { json } from "@sveltejs/kit";
import { dbconf } from "../../../services/mysql";
import mysql from "mysql2/promise.js";
import { chash } from "../../../services/encrypt";
import { orderNumber } from "../../../services/format";
import { category } from "../../../services/constants";
import { nodeMailer } from "../../../services/nodemailer";

export async function POST({request,cookies}){

    let result = {msg:'no'}
    let statusCode  = 400;
    const db = await mysql.createConnection(dbconf);
    try {
        let params = await request.json();
        let {
            recNum,
            brand,
            model,
            symptomFl,
            symptomDetail,
            buyDate,
            storeFl,
            storeDetail,
            name,
            mobile,
            pass,
            email,
            zipcode,
            address,
            addressSub,
            status
        } = params

        email = email.id+'@'+email.domain
        if(email=='@'){
            email='';
        }

        pass = chash(pass)
        
        recNum = orderNumber()
        
        const query = "insert into w_as set recNum=?, brand=?, model=?, symptomFl=?, symptomDetail=?, buyDate=?, storeFl=?, storeDetail=?, name=?, mobile=?, pass=?, email=?, zipcode=?, address=?, regDate=now(), addressSub=?, status=?";
        
        const data = [
            recNum,
            brand,
            model,
            symptomFl,
            symptomDetail,
            buyDate,
            storeFl,
            storeDetail,
            name,
            mobile,
            pass,
            email,
            zipcode,
            address,
            addressSub,
            status
        ]
        
        await db.execute(query, data);

        //접수일
        const d = new Date(Date.now())
        let month = d.getMonth() < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1)
        let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
        const receiptDate = d.getFullYear() + "-" + month + "-" + date

        const subject = '[엠앤웍스 고객센터] AS 접수 완료 안내';
        const content = `안녕하세요.<br>
        <br>
        엠엔웍스 고객센터에 AS가 정상적으로 접수되었습니다.<br>
        <br>
        AS 접수 번호: ${recNum}<br>
        제품명: ${model}<br>
        문제 내용: ${category[Number(symptomFl-1)]}<br>
        AS 요청 일자: ${receiptDate}<br>
        <br>
        접수하신 AS 요청에 대해 저희 팀은 신속하게 처리를 진행할 예정입니다. 또한, 송장번호를 확인하여 AS 처리 과정에서 보다 정확한 업데이트를 제공하기 위해, 아래와 같이 송장번호를 추가로 입력해주시기 바랍니다:<br>
        <br>
        송장번호: https://mnworkscs.co.kr/as/inquiry<br>
        <br>
        우리 팀은 접수된 AS 요청을 조사한 후, 가능한 한 빠른 시일 내에 최적의 해결책을 마련하여 드릴 것입니다.<br>
        <br>
        AS 처리 과정에서 추가적인 문의나 업데이트 사항이 있을 경우, 해당 정보를 이메일 또는 전화로 알려드릴 예정입니다.<br>
        <br>
        만약 기타 문의사항이 있으시면 언제든지 저희 고객센터로 연락주시기 바랍니다.<br>
        <br>
        감사합니다.<br>
        <br>
        좋은 하루 되십시오.<br>
        <br>
        엠앤웍스 고객센터 드림`

        nodeMailer(email,subject,content);
        result = {msg:'ok'}
        status = 200;

    } catch (error) {
        // console.log('error:', error);
    }

    db.end()
    return json(result,{status:statusCode});
}