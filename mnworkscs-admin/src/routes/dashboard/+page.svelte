<script>
    import { cAlert,Loading } from "../../stores/store";
    import { onMount } from "svelte";
    import { postApi,getApi } from "../../services/api";
    import Header from "../../components/Header.svelte";  
    import Xls from "../../components/Xls.svelte";
    import Serial from "../../components/Serial.svelte";
    import ReceiptModal from "../../components/ReceiptModal.svelte";
    import { auth } from "../../services/auth";


    const status = [
        {name : '대기'},
        {name : '등록'},
    ]


    let brands = [
        // {name : '브랜드1'},
        // {name : '브랜드2'},
    ]

    let serialArray = [];

    let searchFormData = {
        startSaleDate:null,
        endSaleDate:null,
        startRegDate:null,
        endRegDate:null,
        status:'',
        brand:'',
        name : '',
        mobile : '',
        model : '',
        serial : '',
        page : 1
    }
    

    let serialAddFalg = false;
    let xlsFlag = false;
    let receiptModalFalg = false;


    const handleMask = () => {
        serialAddFalg = false;
        xlsFlag = false;
        receiptModalFalg = false
    }

    const handleSerial = () => {
        serialAddFalg = true;
    }

    const handlePrint = ()=> {
        autoPrintFlag = true;
        setTimeout(()=>{
            inputs.print.focus();
        },100)
    }

    const handleXls = () =>{
        xlsFlag = true;
    }

    

    const handleSearch = async() => {
        
        $Loading = {flag:true};


        
        handleGetList();
        $Loading = {flag:false};

    }

    let list = [];

    const handleGetList = async () => {
        const res = await postApi({
            path: '/api/list',
            data: searchFormData
        })

        if(res.msg=='ok'){
            list = res.list;
       }
    }

    const handleGetList2 = async () => {

        searchFormData = {
            startSaleDate:null,
            endSaleDate:null,
            startRegDate:null,
            endRegDate:null,
            status:'',
            brand:'',
            name : '',
            mobile : '',
            model : '',
            serial : '',
            page : 1
        }
        
        const res = await postApi({
            path: '/api/list',
            data: searchFormData
        })

        if(res.msg=='ok'){
            list = res.list
       }
    }

    let modalImg = ''

    const handleReceiptModal = (img) => {
        receiptModalFalg = true
        modalImg = img
    }

    const checkAll = (e) =>{

        if(list.length>0){

            if(e.target.checked){

                list.forEach((e,i) => {
                    list[i].checked = true;
                });
            }else{
                list.forEach((e,i) => {
                    list[i].checked = false;
                });
            }
        }
    }

    const checkOne = (e)=>{
        
        if(list.length>0){
            if(e.target.checked){
                list[e.target.getAttribute('idx')].checked = true;
            }else{
                list[e.target.getAttribute('idx')].checked = false;
            }
        }
    }

    const handleSerailDelete = async()=>{

        
        if(list.length>0){

            let tmpIdx = [];
            
            list.forEach((e,i) => {
                if (list[i]?.checked!=undefined && list[i]?.checked==true) {
                    tmpIdx.push(e.idx);
                } 
            });
            
            if(tmpIdx.length==0){
                $cAlert = {flag:true,msg:"삭제할 데이터가 없습니다.",feedback:()=>{}};
                return false;    
            }else{
                
                const res = await postApi({
                    path:"/api/delete",
                    data:{idx:tmpIdx}
                });

                if(res.msg=='ok'){
                    handleGetList();
                }else{
                    $cAlert = {flag:true,msg:"삭제할 수 없습니다.",feedback:()=>{}};
                    return false;    
                }

            }

        }else{
            $cAlert = {flag:true,msg:"삭제할 데이터가 없습니다.",feedback:()=>{}};
        }
    }

    const handleSerailReset = async()=>{
        if(list.length>0){

        let tmpIdx = [];

        list.forEach((e,i) => {
            if (list[i]?.checked!=undefined && list[i]?.checked==true) {
                tmpIdx.push(e.idx);
            } 
        });

        if(tmpIdx.length==0){
            $cAlert = {flag:true,msg:"리셋할 데이터가 없습니다.",feedback:()=>{}};
            return false;    
        }else{
            
            const res = await postApi({
                path:"/api/reset",
                data:{idx:tmpIdx}
            });

            if(res.msg=='ok'){
                handleGetList();
            }else{
                $cAlert = {flag:true,msg:"리셋할 수 없습니다.",feedback:()=>{}};
                return false;    
            }

        }

        }else{
        $cAlert = {flag:true,msg:"리셋할 데이터가 없습니다.",feedback:()=>{}};
        }
    }

    onMount(async()=>{

        const resAuth = await auth();

        if(resAuth!='ok'){
            location.replace("/login");
            return false;
        }

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const paramValue = urlParams.get('page');

        if(paramValue){
            searchFormData.page = paramValue;
        }else{
            searchFormData.page = 1;
        }
        const res = await getApi({
            path:"/api/model",
        });

        if(res.msg=='ok'){
                brands = res.data;
        }
    });
    
    const dateFormat = (date) => {
        
        let res = '';

        if(date!='0000-00-00'){
            res = date.replace("T"," ");
            res = res.replace(".000Z","");
            
        }

        return res;
    }

    
</script>

<Header/>

<div class="wrap">
    

    <section>
        <table>
            <tr>
                <td>
                    <div class="table">
                        <div class='th'>구매일자</div>
                        <div><input type="date" bind:value={searchFormData.startSaleDate}> ~ <input type="date" bind:value={searchFormData.endSaleDate}></div>
                    </div>
                </td>
                <td>
                    <div class="table">
                        <div class='th'>정품등록일시</div>
                        <div><input type="date" bind:value={searchFormData.startRegDate}> ~ <input type="date" bind:value={searchFormData.endRegDate}></div>
                    </div>
                </td>
                <td rowspan={2}>
                    <div class="table row">
                        <div class='th'>시리얼번호</div>
                        <div><textarea bind:value={searchFormData.serial}></textarea></div>
                    </div>
                </td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <div class="table">
                        <div class='th'>이름</div>
                        <div>
                            <input type="text" bind:value={searchFormData.name}>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="table">
                        <div class='th'>휴대폰번호</div>
                        <div>
                            <input type="text" bind:value={searchFormData.mobile}>
                        </div>
                    </div>
                </td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <div class="table">
                        <div class='th'>정품상태</div>
                        <div>
                            <select bind:value={searchFormData.status}>
                                <option value="">전체</option>
                                {#each status as item}
                                    <option value={item.name}>{item.name}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="table">
                        <div class='th'>브랜드</div>
                        <div>
                            <select bind:value={searchFormData.brand}>
                                <option value="">전체</option>
                                {#each brands as item}
                                    <option value={item.brand}>{item.brand}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="table">
                        <div class='th'>모델</div>
                        <div>
                            <input type="text" bind:value={searchFormData.model}>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </section>

    <section class="button-area">
        <button type="button" on:click={handleSearch}>검색</button>
        <button type="button" on:click={handleXls}>엑셀추출</button>
        <button type="button" on:click={handleSerial}>시리얼번호추가</button>
        <button type="button" on:click={handleSerailDelete}>체크한 것 삭제</button>
        <button type="button" on:click={handleSerailReset}>체크한 것 리셋</button>
    </section>

    
    <section class="list-area">
        <div>* 최대 조회 데이터는 1,000개 입니다.<br/><br/></div>
        <table>
            <tr class="list-head">
                <th><input type="checkbox" on:click={checkAll}></th>
                <th>no</th>
                <th>이름</th>
                <th>휴대폰번호</th>
                <th>이메일</th>
                <th>브랜드</th>
                <th>모델</th>
                <th>시리얼번호</th>
                <th>구매날짜</th>
                <th>영수증</th>
                <th>광고매체</th>
                <th>정품등록일시</th>
            </tr>
            {#each list as item,i}
            <tr class="list-body">
                <td><input type="checkbox" idx={i}  checked={item.checked==true?true:false} on:click={checkOne}></td>
                <td>{item.idx}</td>
                <td>{item.name}</td>
                <td>{item.mobile}</td>
                <td>{item.email}</td>
                <td>{item.brand}</td>
                <td>{item.model}</td>
                <td>{item.serial}</td>
                <td>{item.buyDate === null ? '' : dateFormat(item.buyDate)}</td>
                <td><a href={item.receipt} download><img src="{item.receipt}" alt=""></a></td>
                <td>{item.ad}</td>
                <td>{item.regDate === null ? '' : dateFormat(item.regDate)}</td>
            </tr>
            {/each}
        </table>
    </section>

</div>

{#if xlsFlag}
    <Xls {handleMask} {list}></Xls>
    <div class="mask" on:click={handleMask}></div>
{/if}

{#if serialAddFalg}
    <Serial {handleMask} {handleGetList2}></Serial>
    <div class="mask" on:click={handleMask}></div>
{/if}
{#if receiptModalFalg}
    <ReceiptModal {handleMask} {modalImg}></ReceiptModal>
    <div class="mask" on:click={handleMask}></div>
{/if}

<style lang="scss">
    .table.row{
        .th{
            height:89px;
            line-height: 89px;
        }

        textarea{
            min-height:76px;
        }
    }
    td{
        padding:5px;
        vertical-align: top;
    }

    .button-area{
        margin-top:10px;
        padding-left: 5px;
        button{
            margin-right:10px;
        }
        a { color: #fff; }
    }

    .list-area{
        margin-top:40px;
    }
    .list-area > table{
        width:100%;

        th,td{
            text-align: center;
            padding:15px 0px;
            border-right:1px dashed gray;
            vertical-align: middle;

            img{
                width:100px;
                max-height:100px;
            }
        }
    }

    .list-head,
    .list-body{
        border-top:2px solid black;
        border-bottom:2px solid black;
        border-left:1px solid gray;
        border-right:1px solid gray;
        
        
    }

    .list-body{
        border-top:0;
        border-bottom:1px solid gray;
    }


    

    .mask{
        position: fixed;
        top:0px;
        left:0px;
        width:100vw;
        height:100vh;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
    }

</style>