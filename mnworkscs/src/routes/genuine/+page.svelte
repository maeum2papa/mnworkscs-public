<script>

    import GenuineHeader from "../../components/GenuineHeader.svelte";
    import Serialguide from "../../components/Serialguide.svelte";
    import Storeguide from "../../components/Storeguide.svelte";
    import { captcha } from "../../services/captcha";
    import { onMount } from "svelte";
    import { Loading, cAlert } from "../../stores/store";
    import { postApi } from "../../services/api";
    import { resizeImage } from "../../services/resizeimage";
    // import heic2any from "heic2any";
    
    const type = 'genuine';
    let captchaData = captcha();
    let captchaText = captchaData.text;
    let personalDetailClass = 'personal3-area';
    let files;
    let fileName = '선택된 파일 없음';
    let code = '';
    let serialCheck = false;
    
    let inputs = {
        name : {},
        mogile : {},
        brand : {},
        model : {},
        serial : {},
        store : {},
        capcha : {},
        receipt: {},
        code : {},
        personal:{},
        buttonSerial:{}
    }

    let serialGuide = false;
    let storeGuide = false;


    let formData = {
        name : '',
        mobile : '',
        brand : '',
        model : '',
        serial : '',
        store : '',
        buyDate:'',
        email : {
            id:'',
            domain : ''
        },
        receipt : '',
        personal : false,
        personalUse : false,
        personalUseDetail : {
            mobile : false,
            sms : false,
            email : false,
            kakao : false
        }
    }

    let brands = [];
    let models = [];

    const emailDomains = ['google.com','naver.com','kakao.com','daum.net',];

    let receiptImage = '';
    let previewImage = '';

    const handlePersonalDetail = ()=>{
        if(personalDetailClass=='personal3-area'){
            personalDetailClass = 'personal3-area on';
        }else{
            personalDetailClass = 'personal3-area';
        }
    }

    const handleSerialGuide = () =>{
        serialGuide = true;
    }

    const handleStoreGuide = () =>{
        storeGuide = true;
    }

    const handleCapchaRefresh = () =>{
        captchaData = captcha();
        captchaText = captchaData.text;
    }

    const handelSerialCheck = async() =>{
        if (formData.serial == '') {
            $cAlert = {flag:true,msg:'시리얼번호를 입력해 주세요.',feedback:()=>{inputs.buttonSerial.focus()}};
            serialCheck = false;
            return
        }

        const data = {
            serial: formData.serial
        }

        const res = await postApi({
            path:"/api/serial",
            data,
        });

        if (res.msg=='ok'){
            $cAlert = {flag:true,msg:'정품등록 할 수 있는 시리얼번호 입니다.',feedback:()=>{inputs.buyDate.focus()}}
            serialCheck = true;
        } else if (res.msg == 'duplication') {
            $cAlert = {flag:true,msg:'이미 등록한 사용자가 있습니다.',feedback:()=>{inputs.serial.focus()}}
            serialCheck = false;
        } else {
            $cAlert = {flag:true,msg:'정품등록 할 수 없는 시리얼번호 입니다.',feedback:()=>{inputs.serial.focus()}}
            serialCheck = false;
        }
    }


    const handleFileChange = async(e) => {
        
        if(files[0]){

            //heic 확장자
            const fileNameExt = files[0].name.split('.')[1] //파일 확장자
            if(fileNameExt === 'heic') {
                
                //heic -> binary
                const data = new FormData()
                data.append('file', files[0]);
                
                const res = await fetch('/api/img', {
                    method: 'POST',
                    body: data
                })
                const result = await res.json()
                let binary = '';
                let bytes = new Uint8Array( result.data.data );
                let len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode( bytes[i] );
                }
                

                //binary -> byte
                let byteArrays = [];
                
                for (var i = 0; i < binary.length; i++) {
                    byteArrays.push(binary.charCodeAt(i));
                }

                //byte -> blob
                let blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });

                //blob -> file
                let tmpFile = new File([blob], "tmp.jpg", {
                    lastModified: new Date().getTime(),
                    type: blob.type,
                });
                
                //file -> filelist update
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(tmpFile);

                files = dataTransfer.files;
                
            }

            fileName = files[0].name;
            receiptImage = await resizeImage(files[0],600,1350);
            // formData.receipt = receiptImage; //저장용
            previewImage = receiptImage; //미리보기용

            setTimeout(()=>{

                const image = document.querySelector(".uploadFile img");
                const canvas = document.createElement(`canvas`);
                const ctx = canvas.getContext(`2d`);
                
                // if(image.width>=600){
                    canvas.width = image.width;
                    canvas.height = image.height; //canvas 사이즈 안넣으면 기본값 300*150으로 출력
                // }else if(image.width<600){
                    // const rate = image.height / image.width;
                    // canvas.width = 600;
                    // canvas.height = 600*rate;
                //     canvas.width = image.width;
                //     canvas.height = image.height;
                // }

                ctx.drawImage(image,0,0, image.width, image.height); //넣어줘야 비율대로 출력

                previewImage = canvas.toDataURL("image/jpeg",0.5);

                formData.receipt = previewImage;
                
            },500)


        }else{
            fileName = '선택된 파일 없음';
        }
    }

    const handleFile = () => {
        inputs.receipt.click();
    }

    const handleSubmit = async () => {
      
        if(!formData.mobile.includes('-')){
            let mobile1 = formData.mobile.substring(0,3);
            let mobile2 = formData.mobile.substring(3,7);
            let mobile3 = formData.mobile.substring(7,11);

            formData.mobile = mobile1+'-'+mobile2+'-'+mobile3;

        }

        //유효성 검사
        if(formData.name==''){
            $cAlert = {flag:true,msg:'이름을 입력해 주세요.',feedback:()=>{inputs.name.focus()}};
            return false;
        }

        if(formData.mobile==''){
            $cAlert = {flag:true,msg:'핸드폰을 입력해 주세요.',feedback:()=>{inputs.mobile.focus()}};
            return false;
        }

        if(formData.brand==''){
            $cAlert = {flag:true,msg:'구매 브랜드을 선택해 주세요.',feedback:()=>{inputs.brand.focus()}};
            return false;
        }

        if(formData.model==''){
            $cAlert = {flag:true,msg:'구매 모델을 선택해 주세요.',feedback:()=>{inputs.model.focus()}};
            return false;
        }

        if(formData.serial==''){
            $cAlert = {flag:true,msg:'시리얼 번호를 입력해 주세요.',feedback:()=>{inputs.serial.focus()}};
            return false;
        }

        if(formData.store==''){
            $cAlert = {flag:true,msg:'제품 구매처를 입력해 주세요.',feedback:()=>{inputs.store.focus()}};
            return false;
        }

        if(formData.receipt==''){
            $cAlert = {flag:true,msg:'영수증을 등록해 주세요.',feedback:()=>{inputs.receipt.focus()}};
            return false;
        }

        if(code==''){
            $cAlert = {flag:true,msg:'보안코드를 입력해 주세요.',feedback:()=>{inputs.code.focus()}};
            return false;
        }

        if(code!=captchaText){
            $cAlert = {flag:true,msg:'보안코드가 틀렸습니다.',feedback:()=>{inputs.code.focus()}};
            return false;
        }

        if(!formData.personal){
            $cAlert = {flag:true,msg:'개인정보 활용 동의해 주세요.',feedback:()=>{inputs.personal.focus()}};
            return false;
        }

        if(!serialCheck){
            $cAlert = {flag:true,msg:'시리얼번호를 확인해 주세요.',feedback:()=>{inputs.buttonSerial.focus()}};
            return false;
        }

        $Loading = {flag:true};

        const res = await postApi({
            path:'/api/save',
            data:formData
        });

        if(res.msg=='ok'){
            $cAlert = {flag:true,msg:'정품등록 되었습니다.',feedback:()=>{location.reload()}};
        }

        $Loading = {flag:false};

    }

    const handleMask = () => {
        serialGuide = false;
        storeGuide = false;
    }

    const handleEmailDomain = (e) =>{
        formData.email.domain = e.target.value;
    }

    const handleGetModel = async() =>{
        //모델 가져오기
       const res = await postApi({
            path:"/api/model",
            data : {brand:formData.brand}
       });
       if(res.msg=='ok'){
            models = res.data;
       }
    }   

    const handleChecked = async (e) => {
        if(e.target.checked) {
            formData.personalUseDetail.mobile = true
            formData.personalUseDetail.sms = true
            formData.personalUseDetail.email = true
            formData.personalUseDetail.kakao = true
        } else {
            formData.personalUseDetail.mobile = false
            formData.personalUseDetail.sms = false
            formData.personalUseDetail.email = false
            formData.personalUseDetail.kakao = false
        }
    }

    const handleMobileBlur = () => {
        
        if(!formData.mobile.includes('-')){
            let mobile1 = formData.mobile.substring(0,3);
            let mobile2 = formData.mobile.substring(3,7);
            let mobile3 = formData.mobile.substring(7,11);

            formData.mobile = mobile1+'-'+mobile2+'-'+mobile3;
        }

    }

    const handleSerialChange = ()=>{
        serialCheck = false;
    }
    

    onMount(async()=>{
       inputs.name.focus();
       //구매 브랜드 가져오기
       const res = await postApi({
            path:"/api/brand"
       });

       if(res.msg=='ok'){
            brands = res.data;
       }

    });
    

</script>

<GenuineHeader {type}></GenuineHeader>
<div class="wrap">
    <section>
        <h2><span>정품등록 접수</span></h2>

        <ul>
            <li>
                <div class="title require">이름</div>
                <div><input type="text" bind:value={formData.name} bind:this={inputs.name}></div> 
            </li>
            <li>
                <div class="title require">핸드폰</div>
                <div><input type="text" placeholder="010-0000-0000" maxlength="13" bind:value={formData.mobile} bind:this={inputs.mobile} on:blur={handleMobileBlur}></div> 
            </li>
            <li>
                <div class="title require">구매브랜드</div>
                <div>
                    <div class="select">
                        <select bind:value={formData.brand}  bind:this={inputs.brand} on:change={handleGetModel}>
                            <option value="">선택하세요</option>
                            {#each brands as item}
                            <option value={item}>{item}</option>
                            {/each}
                        </select>
                    </div>
                </div> 
            </li>
            <li>
                <div class="title require">구매모델</div>
                <div>
                    <div class="select">
                        <select bind:value={formData.model} bind:this={inputs.model}>
                            <option value="">선택하세요</option>
                            {#each models as item}
                            <option value={item}>{item}</option>
                            {/each}
                        </select>
                    </div>
                </div> 
            </li>
            <li class="serial-area">
                <div class="title require">시리얼번호</div>
                <div><input type="text" class="short3" bind:value={formData.serial} bind:this={inputs.serial} on:change={handleSerialChange}><button type='button' class="type2" on:click={handelSerialCheck} bind:this={inputs.buttonSerial}>시리얼확인</button><button type='button' on:click={handleSerialGuide}>가이드</button></div> 
            </li>
            <li>
                <div class="title">구매날짜</div>
                <div><input type="date" bind:value={formData.buyDate} bind:this={inputs.buyDate}></div> 
            </li>
            <li class="store-area">
                <div class="title require">제품구매처</div>
                <div><input type="text" class="short5" bind:value={formData.store} bind:this={inputs.store}><button type='button' on:click={handleStoreGuide}>가이드</button></div> 
            </li>
            <li class="email-area">
                <div class="title">이메일</div>
                <div>
                    <div>
                        <input type="text" class="short" bind:value={formData.email.id}> @ <input type="text" class="short" bind:value={formData.email.domain}>
                    </div>
                    <div>
                        <div class="select" on:change={handleEmailDomain}>
                            <select>
                                <option value="">직접입력</option>
                                {#each emailDomains as item}
                                <option value={item}>{item}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div> 
            </li>
            <li class="receipt-area">
                <div class="title require">영수증등록</div>
                <div>
                    <input type="file" bind:files bind:this={inputs.receipt} on:change={handleFileChange}><button type='button' on:click={handleFile} >파일 선택</button><span>{fileName}</span>
                    {#if receiptImage!=''}
                        <div class="uploadFile"><img src={previewImage}></div>
                    {/if}
                    <p>이미지 파일만 업로드할 수 있습니다.</p>
                </div> 
            </li>
            <li>
                <div class="title require">보안코드</div>
                <div><img src={captchaData.image} class='capcha' ><input type="text" class="short2 short4" bind:value={code} bind:this={inputs.code}><button type='button' on:click={handleCapchaRefresh}>새로고침</button></div> 
            </li>
        </ul>
    </section>

    <section class="personal-area">
        <h2><span>개인정보 활용 동의</span></h2>

        <ul>
            <li>개인정보 제공 받는자: 엠앤웍스, 디지월드</li>
            <li>개인정보 수집 범위: 고객명, 연락처, 이메일</li>
            <li>개인정보 수집 및 이용 목적: 엠앤웍스, 디지월드에서 상담에 활용(전화, SMS, E-mail)</li>
            <li>개인정보 보유 및 이용</li>
        </ul>
    </section>

    <section class="personal2-area">
        <h2></h2>

        <ul>
            <li>입력하신 정보는 추후 A/S에도 활용될 수 있음에 동의합니다.</li>
            <li>검색되지 않는 제품은 고객센터 1566-8104로 문의 바랍니다.</li>
            <li><div class="strong"><p>영수증을 통한 구매일자 확인이 불가할 경우 해당 제품 시리얼 조회를 통해 당사 출고 일자를 기준으로 보상기간을 산정 하오니 이에 따라 불이익이 발생할 수 있습니다.</p></div></li>
        </ul>
    </section>

    <section class="agree-area">
        <input type="checkbox" id="check1" bind:checked={formData.personal} bind:this={inputs.personal}><label for="check1">동의합니다.</label>
    </section>
</div>

<section class={personalDetailClass}>
    <div class="wrap">
        <div class="title">
            <div>개인정보 활용 상세내용 확인</div>
            <div>
                <button type="button" class="circle" on:click={handlePersonalDetail}></button>
            </div>
        </div>
        <div class="contents">
            <ul>
                <li>
                    앰앤웍스, 디지월드는 이용자의 개인정보 관리 및 보다 다양한 서비스 제공을 위하여
                    이용자의 별도 동의를 얻어 다음과 같이 개인정보를 활용(제공)할 예정임을 안내 드립니다.
                    <table>
                        <tr>
                            <th>대상</th>
                            <td>주) 엠앤웍스, 디지월드 (내부 활용만 하며, 제3자에게 제공하지 않음)</td>
                        </tr>
                        <tr>
                            <th>항목</th>
                            <td>구매자 정보(이름, 이메일, 휴대폰 번호) 및 구매 제품 정보</td>
                        </tr>
                        <tr>
                            <th>목적</th>
                            <td>AS 접수 고객의 구매 정보 참고 및 맞춤형 정보(신제품 출시, 프로모션 해택 등) 제공/ 활용</td>
                        </tr>
                        <tr>
                            <th>기간</th>
                            <td>AS 접수 시점 기준 2년 이내</td>
                        </tr>
                    </table>
                </li>
                <li>
                    회사는 이용자의 동의가 있거나 관련법령의 규정에 의한 경우를 제외하고는, 
                    제2조에서 고지한 범위를 넘어 이용자의 개인정보를 이용하거나 제3자에게 제공하지 않습니다. 
                </li>
                <li>
                    다만, 다음 각 호의 경우는 이용자의 별도 동의 없이 제공될 수 있습니다. 
                    서비스 제공에 따른 요금정산을 위하여 필요한 경우· 통계작성, 학술연구 또는 시장조사를 위하여
                    필요한 경우로서 특정 개인을 알아볼 수 없는 형태로 가공하여 연구단체, 설문조사, 리서치 기관 등에 
                    제공하는 경우· 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 통신비밀보호법, 국세기본법,  
                    금융실명거래 및 비밀보장에 관한 법률, 신용정보의 이용 및 보호에 관한 법률, 전기통신기본법, 전기통신사업법, 
                    지방세법, 소비자보호법, 형사소송법 등 법률상 특별한 규정이 있는 경우
                </li>
                <li>
                    이용자는 개인정보 활용(제공) 동의를 거부할 수 있으며, 동의를 거부할 때에는 
                    맞춤형 정보(신제품 출시, 프로모션 혜택 등) 제공 등의 서비스 이용에 제한을 받을 수 있습니다.
                </li>
                <li>
                    회사는 개인정보를 제3자에게 제공할 때에는 이용자에게 내용을 알리고 동의를 받습니다.
                </li>
            </ul>
        </div>
    </div>
</section>

<div class="wrap personal4-area">
    <section>
        <div><input type="checkbox" id="check2" bind:checked={formData.personalUse} on:change={handleChecked}><label for="check2">개인정보 활용 동의</label></div>
        <div class="detail">
            <div><input type="checkbox" id="check3" bind:checked={formData.personalUseDetail.mobile}><label for="check3">전화</label></div>
            <div><input type="checkbox" id="check4" bind:checked={formData.personalUseDetail.sms}><label for="check4">문자</label></div>
            <div><input type="checkbox" id="check5" bind:checked={formData.personalUseDetail.email}><label for="check5">이메일</label></div>
            <div><input type="checkbox" id="check6" bind:checked={formData.personalUseDetail.kakao}><label for="check6">카카오톡</label></div>
        </div>
        <ul>
            <li><div class="strong"><p>마케팅 정보 수신 동의는 신제품 출시 및 이벤트 프로모션 안내를 위함이며, 동의는 선택사항으로 수신동의 하지 않아도 
                정품등록 및 추후 A/S 접수 가능합니다.</p></div>
            </li>
        </ul>
    </section>

    <div class="button-area">
        <button type='button' on:click={handleSubmit}>정품등록 접수하기</button>
    </div>
</div>


<Serialguide {serialGuide} {handleMask}></Serialguide>
<Storeguide {storeGuide} {handleMask}></Storeguide>



<style lang="scss">
    .wrap{
        max-width: 888px;
        margin: 80px auto 0;
    }
    
    section{
        h2{
            margin-top: 20px;
            padding-bottom: 20px;
            font-size: var(--font-head-big);
            border-bottom: 3px solid #000000;
            color: #000000;
        }

        ul{
            margin-top:47px;
            li{
                margin-top:30px;
                position: relative;
                word-break: keep-all;
                display: flex;
                // & > div{
                //     margin-top:10px;
                // }

                .title{
                    font-size:var(--font-body-normal);
                    font-weight: 700;
                    margin-top:0;
                    position: relative;
                    width: 20%;
                    line-height: 2em;
                    &.require{
                        &::after{
                            content: '*';
                            color:var(--orange);
                            margin-left:5px;
                        }
                    }
                }

                

                input {
                    width: 262px;
                }
                button{
                    margin-left:12px;
                }

                // input.short{
                //     max-width: 245px;
                // }

                // input.short2{
                //     width:245px;
                //     margin-left:18px;
                // }

                // &.email-area .select{
                //     margin-top:18px;
                // }
                &.email-area {
                    >div:last-child {
                        flex-direction: column;
                        display: flex;
                        gap: 10px;
                        max-width: 262px;
                        >div {
                            align-items: center; 
                            &:first-child {
                                display: flex;
                                gap: 10px;
                                input {
                                    width: 100%;
                                }
                            }
                        }
                    }
                }
                &.receipt-area{
                    button{
                        margin-left:0;
                    }

                    span{
                        display: inline-block;
                        margin-left:26px;
                        color:var(--gray);
                    }

                    p {
                        margin-top: 10px;
                    }
                } 
            }
        }


        button.type2{
            // min-width: 162px;
            padding: 10px 16px;
        }


        .capcha{
            display: inline-block;
            vertical-align: middle;
            border:1px solid var(--gray);
            margin-right: 20px;
        }
        
        &.personal-area{
            margin-top:86px;
            li{
                font-size:var(--font-size-middle);
                position: relative;
                margin-left: 30px;
                &::before{
                    position: absolute;
                    content: '';
                    display: block;
                    width: 10px;
                    height: 10px;
                    border-radius: 5px;
                    background-color: var(--orange);
                    top: 2px;
                    left: -30px
                }
            }
        }

        &.personal2-area{
            margin-top: 56px;
            h2{
                &::after{
                    top:0;
                }
            }

            ul{
                display: inline-block;
                width:100%;
                margin-top:56px;
            }

            li{
                font-size:var(--font-size-middle);

                &::before{
                    top:12px;
                }

                &:first-of-type{
                    margin-top:0;
                }

                
            }
        }

        &.agree-area{
            margin-top:47px;
        }


        &.personal3-area{
            background: #EFEFEF;

            .title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: var(--font-head-normal);
                font-weight: bold;
                padding: 30px 0px;

                button{
                    width:30px;
                    min-width: 0;
                    height:30px;
                    border-radius: 50%;
                    position: relative;
                    &::before{
                        content: '';
                        position: absolute;
                        top:50%;
                        left:calc(50% - 7.5px);
                        width:13px;
                        height:13px;
                        border:2px solid #fff;
                        border-top:0;
                        border-left:0;
                        transform-origin: center;
                        transform: rotate(45deg) translate(-50%,-50%);
                    }
                }
            }

            &.on .title button{
                transform: rotate(180deg);
            }

            div.contents{
                display: none;
                padding-bottom: 38.5px;
            }
            
            ul{
                width:100%;
                margin-top:0;

                li{
                    font-size:var(--font-size-middle);
                    line-height:1.5em;
                    margin-top:44px;
                    max-width: 1222px;

                    &:first-of-type{
                        margin-top:0;
                    } 

                    &::before{
                        top:12px;
                    }


                    table{
                        background: #fff;
                        margin-top:44px;

                        td,th{
                            border:1px solid #707070;
                            padding:22px 30px;
                        }

                        th{
                            width:calc(236px - 60px);
                            text-align: center;
                        }
                    }
                }
            }

            &.on div.contents{
                display: inline-block;
                li {
                    flex-direction: column;
                }
            }
        }

        input[type='checkbox'] + label{
            font-size:var(--font-size-middle);
            &::before{
                transform: translateY(8px);
            }
        }
    }


    .personal4-area{
        margin-top:66px;
        .detail{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            margin-top:24px;
            div{
                margin-left:29px;

                &:first-of-type{
                    margin-left:0;
                }
            }
        }

        li{
            font-size: var(--font-size-middle);
            line-height: 37px;

            &::before{
                top:16px;
            }
            // .strong{
            //     background:var(--beige);
            //     padding:5px;
            //     p{
            //         max-width: 1222px;
            //     }
            // }
        }
        
    }
    .strong{
        background:var(--beige);
        padding: 20px;
        border-radius: 10px;
        p{
            max-width: 1222px;
            line-height: 1.5em;
        }
    }
    .button-area{
        margin-top:40px;
        text-align: center;
        button{
            padding: 10px 16px;
        }
    }

    .uploadFile{
        margin-top:10px;
        img{
            max-width:100%;
        }
    }


    @media only screen and (max-width:1024px){
        
    }

    @media only screen and (max-width:768px){
        .wrap{
            margin-top:36px;
        }

        section{
            h2{
                span{
                    font-size:14px;
                    padding-right: 8px;
                }
                &::after{
                    top:7px;
                }
            }

            ul{
                margin-top:21px;
                li{
                    margin-top:23px;
                    // padding-left:10px;
                    flex-direction: column;
                    input {
                        width: 100%;
                        max-width: 100%;
                    }
                    select, .select {
                        max-width: 100%;
                        width: 100%;
                    }
                    &::before{
                        width:5px;
                        height:5px;
                        top:4px;
                    }

                    & > div{
                        margin-top:9px;
                    }

                    .title{
                        font-size:var(--font-size-middle);

                        &.require{
                            &::after{
                                content: '*';
                                color:var(--orange);
                                margin-left:5px;
                            }
                        }
                    }

                    button{
                        margin-left:10px;
                    }

                    input.short{
                        // max-width: 118px;
                        width: calc(100% - 129px);
                    }

                    input.short2{
                        width:100%;
                        max-width: 245px;
                        margin-left:18px;
                    }

                    input.short3{
                        width: calc(100% - 184px);
                        max-width:164px;
                    }

                    &.email-area .select{
                        margin-top:9px;
                    }

                    &.email-area {
                        >div:last-child {
                            max-width: 100%;
                        }
                    }

                    &.receipt-area{
                        span{
                            margin-left:13px;
                            max-width: calc(100% - 100px);
                            height: 37px;
                            line-height: 37px;
                            overflow: hidden;
                            vertical-align: middle;
                        }
                    } 
                    &.serial-area {
                        input {
                            width: 60%;
                        }
                        >div {
                            >button:first-child {
                                width: 49%;
                                margin-left: 0;
                            }
                            >button:last-child {
                                margin-left: 0;
                                margin-top: 10px;
                            }
                        }
                    }
                }
            }

            
            button.type2{
                min-width: 82px;
            }


            .capcha{
                width:100%;
                height: 34px;
                max-width:109px;
            }
            
            input.short4{
                width:calc(100% - 100px) !important;
                margin-left:12px !important;
                margin-top:9px;
                margin-left:0 !important;
            }

            input.short5{
                width: calc(100% - 95px);
            }


            &.personal-area{
                margin-top:72px;
                li{
                    font-size:var(--font-size-middle);
                    margin-top:19px;
                    margin-left: 20px;
                    line-height: 20px;
                    &::before{
                        top:5px;
                        left: -20px;
                    }
                }
            }

            &.personal2-area{
                margin-top: 28.5px;

                ul{
                    margin-top:28.5px;
                }

                li{
                    font-size:var(--font-size-middle);
                    margin-top:19px;
                    line-height: 20px;

                    &::before{
                        top:7px;
                    }

                }
            }

            &.agree-area{
                margin-top:21px;
            }


            &.personal3-area{
                .title{
                    font-size:14px;
                    padding:19px 0px;

                    div{
                        line-height: 20px;
                        color:var(--orange);
                    }

                    button{
                        width:34px;
                        height:34px;
                        &::before{
                            top:50%;
                            left:calc(50% - 6px);
                            width:12px;
                            height:12px;
                            border:1px solid #fff;
                            border-top:0;
                            border-left:0;
                            transform-origin: center;
                            transform: rotate(45deg) translate(-50%,-50%);
                        }
                    }
                }

                
                ul{
                    li{
                        line-height:20px;
                        margin-top:18px;

                        &::before{
                            top:7px;
                        }


                        table{
                            margin-top:19px;

                            td,th{
                                padding:11px 17px;
                                vertical-align: middle;
                                font-size:12px;
                                line-height: 17px;
                            }

                            th{
                                width:calc(82px - 34px);
                                font-size:14px;
                            }
                        }
                    }
                }

            }

            input[type='checkbox'] + label{
                font-size:var(--font-size-middle);
                &::before{
                    transform: translateY(5px);
                }
            }
        }


        .personal4-area{
            margin-top:36px;
            .detail{
                margin-top:19px;
                div{
                    margin-left:0px;
                    margin-right:28px;

                    &:last-of-type{
                        margin-right:0;
                    }
                }                
            }

            li{
                line-height: 20px;

                &::before{
                    top:7px;
                }
            }
            
        }

        .button-area{
            margin-top:27px;
            button{
                // font-size:16px;
                // height:71px;
            }
        }
        .title { 
            white-space: nowrap;
        }

        .strong {
            padding: 10px;
        }
    }

</style>