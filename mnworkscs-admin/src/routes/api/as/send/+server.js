import { json } from '@sveltejs/kit';
import { nodeMailer } from '../../../../services/nodemailer';
import { dbconf } from '../../../../services/mysql';
import mysql from "mysql2/promise.js";
import { status } from '../../../../services/constants';


export async function POST({request,cookies}){
    
    let result = {msg:'no'}
    let statusCode = 400
    const db = await mysql.createConnection(dbconf);
    
    let body  = await request.json();
    // console.log('body:', body);

    try{
        
        let where = '';
        
        if(body.idx.length>0){
            where = body.idx.join(',');
        }
        const [rows] = await db.execute("select * from w_as where idx in("+where+")");
        
        const d = new Date(Date.now())
        let month = d.getMonth() < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1)
        let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
        const sendDate = d.getFullYear() + "-" + month + "-" + date

        for ( let i = 0; i < rows.length; i++){
            if(rows[i].status === status[1]){

                let subject = '[엠앤웍스 고객센터] AS 상품 입고 안내'

                let content = `안녕하세요.<br>
                <br>
                고객님의 AS 상품이 고객센터로 도착하였고, 처리 절차가 시작되었습니다.<br>
                <br>
                아래는 AS 상품 입고에 관한 상세 정보입니다:<br>
                <br>
                AS 접수 번호: ${rows[i].recNum}<br>
                제품명: ${rows[i].model}<br>
                송장번호: ${rows[i].recCourier ? rows[i].recCourier : ""} ${rows[i].recInvoice ? rows[i].recInvoice : ""}<br>
                입고 일자: ${sendDate}<br>
                <br>
                상품을 신속하게 점검하고 필요한 조치를 취한 후, 가능한 한 빠른 시일 내에 AS 상품을 해결하여 고객님께 정상적인 제품으로 보내드릴 것입니다.<br>
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
                nodeMailer(rows[i].email,subject,content);
            } else if(rows[i].status === status[3]){
                let subject = '[엠앤웍스 고객센터] AS 상품 발송 안내'
                let content = `안녕하세요.<br>
                <br>
                고객님의 AS 상품에 대한 처리가 완료되었으며, 정상적인 제품으로 발송되었음을 안내드립니다.<br>
                <br>
                아래는 AS 상품 발송에 관한 상세 정보입니다:<br>
                <br>
                AS 접수 번호: ${rows[i].recNum}<br>
                제품명: ${rows[i].model}<br>
                송장번호: ${rows[i].forCourier} ${rows[i].forInvoice}<br>
                발송 일자: ${sendDate}<br>
                <br>
                고객님의 AS 상품은 신속하게 점검 및 조치되었으며, 안전한 포장 후 발송되었습니다. 해당 상품은 배송 당사자인 ${rows[i].forCourier}택배를 통해 고객님의 주소로 안전하게 전달될 예정입니다.<br>
                <br>
                추가로, 송장번호를 통해 배송 상태를 실시간으로 확인하실 수 있습니다. 고객님은 ${rows[i].forCourier} 웹사이트 또는 앱을 통해 배송 추적 서비스를 이용하실 수 있습니다.<br>
                <br>
                만약 기타 문의사항이 있으시면 언제든지 저희 고객센터로 연락주시기 바랍니다.<br>
                <br>
                감사합니다.<br>
                <br>
                좋은 하루 되십시오.<br>
                <br>
                엠앤웍스 고객센터 드림`
                nodeMailer(rows[i].email,subject,content);
            } 
        }
        result = {msg:'ok'}
        statusCode = 200;

    } catch(error){

    }

    db.end();
    return json(result,{status:statusCode})
}
