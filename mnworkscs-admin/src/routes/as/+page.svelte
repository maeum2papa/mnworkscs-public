<script>
    import { cAlert,Loading } from "../../stores/store";
    import { onMount } from "svelte";
    import { postApi,getApi } from "../../services/api";
    import Header from "../../components/Header.svelte";  
    import { auth } from "../../services/auth";
    import { dateFormat, nullRemove } from "../../services/format";
    import AsXls from "../../components/AsXls.svelte";
    import { category, couriers, status } from "../../services/constants";
    import Pagination from "../../components/Pagination.svelte";

    let asResult = []
    let brands = []
    let changeStatus = status[0]
    let currentPage = 1
    let totalDocsCount
    let listLimit = 10
    let pageCount = 5

    const searchFormData = {
        startRegDate: null,
        endRegData: null,
        recNum: "",
        recInvoice: "",
        name: "",
        mobile: "",
        forInvoice: "",
        status: "",
        brand: "",
        model: "",
        page: currentPage,
        limit: listLimit,
    }

    let forInvoiceInput = {
        idx: null,
        forCourier: "",
        forInvoice: ""
    };

    let xlsFlag = false;

    const handleMask = () => {
        xlsFlag = false;
    }

    const handleSearch = async() => {
        handleGetAs()
    }

    const handleGetAs = async() => {
        const res = await postApi({
            path: '/api/as',
            data: searchFormData
        })
        
        if(res.msg == 'ok'){
            asResult = res.list
            totalDocsCount = res.totalDocs
        }
    }

    const handleXls = () =>{
        xlsFlag = true;
    }
    
    const handleAsDelete = async()=>{
        
        if(asResult.length>0){

            let tmpIdx = [];
            
            asResult.forEach((e,i) => {
                if (asResult[i]?.checked!=undefined && asResult[i]?.checked==true) {
                    tmpIdx.push(e.idx);
                } 
            });
            
            if(tmpIdx.length==0){
                $cAlert = {flag:true,msg:"삭제할 데이터가 없습니다.",feedback:()=>{}};
                return false;    
            }else{
                
                const res = await postApi({
                    path:"/api/as/delete",
                    data:{idx:tmpIdx}
                });

                if(res.msg=='ok'){
                    handleGetAs();
                }else{
                    $cAlert = {flag:true,msg:"삭제할 수 없습니다.",feedback:()=>{}};
                    return false;    
                }

            }

        }else{
            $cAlert = {flag:true,msg:"삭제할 데이터가 없습니다.",feedback:()=>{}};
        }
    }

    const handleStatusChange = (e) => {
        changeStatus = e.target.value
    }

    const handleStatusUpdate = async() => {
        if(asResult.length>0){

            let tmpIdx = [];
            
            asResult.forEach((e,i) => {
                if (changeStatus !== status[3]) {
                    if (asResult[i]?.checked!=undefined && asResult[i]?.checked==true) {
                        tmpIdx.push(e.idx);
                    } 
                } else {
                    //출고완료 수정시
                    if (asResult[i]?.checked!=undefined && asResult[i]?.checked==true && asResult[i].forCourier!=undefined && asResult[i].forInvoice!=undefined) {
                        tmpIdx.push(e.idx);
                    } 
                }
            });

            if(tmpIdx.length==0){
                $cAlert = {flag:true,msg:"수정할 데이터가 없습니다.",feedback:()=>{}};
                return false;    
            }else{
                const res = await postApi({
                    path:"/api/as/update",
                    data:{idx:tmpIdx, status: changeStatus}
                });

                if(res.msg=='ok'){
                    handleGetAs();
                } else {
                    $cAlert = {flag:true,msg:"수정할 수 없습니다.",feedback:()=>{}};
                    return false;    
                }

                const res2 = await postApi({
                    path: "/api/as/send",
                    data: {idx:tmpIdx}
                })
            }

        }else{
            // $cAlert = {flag:true,msg:"삭제할 데이터가 없습니다.",feedback:()=>{}};
        }
    }

    const checkAll = (e) =>{

        if(asResult.length>0){

            if(e.target.checked){

                asResult.forEach((e,i) => {
                    asResult[i].checked = true;
                });
            }else{
                asResult.forEach((e,i) => {
                    asResult[i].checked = false;
                });
            }
        }
    }

    const checkOne = (e)=>{
        
        if(asResult.length>0){
            if(e.target.checked){
                asResult[e.target.getAttribute('idx')].checked = true;
            }else{
                asResult[e.target.getAttribute('idx')].checked = false;
            }
        }
    }

    const handleForInvoiceSubmit = async()=>{
        const res = await postApi({
            path: '/api/as/update',
            data: forInvoiceInput
        })
        if(res.msg == 'ok') {
            handleGetAs()
        }
    }

    function handleInputChange(e, idx) {
        forInvoiceInput.idx = idx;
        forInvoiceInput.forInvoice = e.target.value;
    }

    function handleSelectChange(e) {
        forInvoiceInput.forCourier = e.target.value;
    }

    const handlePageClick = (item) => {
        currentPage = item;
        searchFormData.page = currentPage
        handleGetAs()
    }

    const handlePrev = ()=>{
        currentPage -= 1
        searchFormData.page = currentPage
        handleGetAs()
    }
    
    const handleNext = ()=>{
        currentPage += 1
        searchFormData.page = currentPage
        handleGetAs()
    }

    const handleForReInvoiceSubmit = (e) =>{
        asResult[e.target.getAttribute('index')].forInvoice = '';
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

        handleGetAs()

        const ship = await postApi({
            path:"/api/ship/get"
        })

        if(ship.msg=='ok'){
            //couriers = [];
            
            ship.data.forEach((e,i) => {
                couriers[i] = e.name;
            });
        
        }
        
    });
    
</script>

<Header/>

<div class="wrap">
    

    <section>
        <table>
            <tr>
                <td>
                    <div class="table">
                        <div class='th'>접수일자</div>
                        <div><input type="date" bind:value={searchFormData.startRegDate}> ~ <input type="date" bind:value={searchFormData.endRegData}></div>
                    </div>
                </td>
                <td>
                    <div class="table">
                        <div class='th'>접수번호</div>
                        <div>
                            <input type="text" bind:value={searchFormData.recNum}>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="table">
                        <div class='th'>입고송장번호</div>
                        <div>
                            <input type="text" bind:value={searchFormData.recInvoice}>
                        </div>
                    </div>
                </td>
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
                <td>
                    <div class="table">
                        <div class='th'>출고송장번호</div>
                        <div>
                            <input type="text" bind:value={searchFormData.forInvoice}>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="table">
                        <div class='th'>AS상태</div>
                        <div>
                            <select>
                                {#each status as item}
                                <option value="{item}">{item}</option>
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
        <button type="button" on:click={handleAsDelete}>체크한 것 삭제</button>

        체크한 것을 
        <select on:change={handleStatusChange}>
            {#each status as item}
            <option value={item}>{item}</option>
            {/each}
        </select>
        로 상태를 수정 합니다.
         <button type="button" on:click={handleStatusUpdate}>수정 적용</button>
    </section>

    <section class="description">
        <p>- AS상태를 수정하면 고객에게 자동으로 메일이 발송 됩니다.
            - 출고송장번호 입력 후 <b>엔터</b>로 저장할 수 있습니다. (출고송장번호가 등록되어야 AS상태를 <b>출고완료</b>로 수정할 수 있습니다.)
        </p>
    </section>
    
    
    <section class="list-area">
        <table>
            <tr class="list-head">
                <th><input type="checkbox" on:click={checkAll}></th>
                <th>no</th>
                <th>AS상태</th>
                <th>접수번호</th>
                <th>이름</th>
                <th>휴대폰번호</th>
                <th>이메일</th>
                <th>브랜드</th>
                <th>모델</th>
                <th>제품증상</th>
                <th>증상상세</th>
                <th>주소</th>
                <th>접수일자</th>
                <th>입고일자</th>
                <th>출고일자</th>
                <th>입고택배사</th>
                <th>입고송장번호</th>
                <th>출고택배사</th>
                <th>출고송장번호</th>
            </tr>
            {#each asResult as item, index}
                <tr class="list-body">
                    <td><input type="checkbox" idx={index} checked={item.checked==true?true:false} on:click={checkOne}></td>
                    <td>{item.idx}</td>
                    <td>{item.status}</td>
                    <td>{item.recNum}</td>
                    <td>{item.name}</td>
                    <td>{item.mobile}</td>
                    <td>{item.email}</td>
                    <td>{item.brand}</td>
                    <td>{item.model}</td>
                    <td>{category[Number(item.symptomFl)-1]}</td>
                    <td>{item.symptomDetail}</td>
                    <td>{item.zipcode} {item.address} {item.addressSub}</td>
                    <td>{dateFormat(item.regDate)}</td>
                    <td>{dateFormat(item.recDate)}</td>
                    <td>{dateFormat(item.forDate)}</td>
                    <td>{nullRemove(item.recCourier)}</td>
                    <td>{nullRemove(item.recInvoice)}</td>
                    {#if item.forInvoice}
                    <td><a class="blue" on:click={handleForReInvoiceSubmit} {index}>{nullRemove(item.forCourier)}</a></td>
                    {:else}
                    <td class="forinvoice-input">
                        <select name="" id="" on:change={handleSelectChange}>
                            <option value="">택배사 선택</option>
                            {#each couriers as item}
                            <option value={item}>{item}</option>
                            {/each}
                        </select>
                        <input type="text" on:input={e=>handleInputChange(e, item.idx)}>
                        <button on:click={handleForInvoiceSubmit}>등록</button>
                    </td>
                    {/if}
                    <td><a class="blue" on:click={handleForReInvoiceSubmit} {index}>{nullRemove(item.forInvoice)}</a></td>
                </tr>
            {/each}
            <!-- <tr class="list-body">
                <td><input type="checkbox"></td>
                <td>1</td>
                <td>출고</td>
                <td>1283462934</td>
                <td>홍길동</td>
                <td>010-4444-8888</td>
                <td>cc@ccc.com</td>
                <td>스틸시리즈</td>
                <td>pex Pro TKL (2023) US</td>
                <td>00000 서울 영등포구 영등포로 150 생각공장당산 B동 1034호</td>
                <td>2023-07-18</td>
                <td>2023-07-19</td>
                <td>2023-07-23</td>
                <td>편의점택배 1122211212211</td>
                <td>
                    <input type="text" value="12121212121122">
                </td>
            </tr> -->
        </table>
    </section>

    <section class="page">
        {#if totalDocsCount !== undefined}
        <Pagination 
            bind:currentPage={currentPage} 
            {handlePageClick}
            {handlePrev}
            {handleNext}
            {totalDocsCount}
            {pageCount}
            {listLimit}
        />
        {/if}
    </section>

</div>

{#if xlsFlag}
    <AsXls {handleMask} {asResult}></AsXls>
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

    .forinvoice-input {
        display: flex;
        input {
            width: 80px;
        }
        button {
            white-space: nowrap;

        }
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


    .description{
        margin-top:20px;
        border-top:1px dashed gray;
        border-bottom:1px dashed gray;
        padding-top:20px;
        padding-bottom:20px;

        P{
            white-space: pre-line;
            line-height: 1.5rem;
            color:gray;
        }
    }

    .page{
        margin-top:20px;
    }

    .blue{
        color:darkblue;
        cursor: pointer;
    }

</style>