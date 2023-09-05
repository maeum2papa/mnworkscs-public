<script>
    import { Loading, cAlert } from "../../../stores/store";
    import { postApi } from "../../../services/api";
    import AsHeader from "../../../components/AsHeader.svelte";
    import { dateFormat } from "../../../services/format";
    import { asStatus, category } from "../../../services/constants";
    import InvoiceInput from "../../../components/InvoiceInput.svelte";
    import { onMount } from "svelte";
    import Pagination from "../../../components/Pagination.svelte";

    const type = 'result';
    const filter = ['최신순', '오래된순']
    let asResult = []

    let invoiceInput = false;
    let idx;

    let currentPage = 1;
    let listLimit = 10;
    let pageCount = 5
    let totalDocsCount;

    const nameInputs = {
        name: {},
        mobile: {},
        pass: {}
    }

    let formData = {
        name: "",
        mobile: "",
        pass: "",
        limit: listLimit,
        page: currentPage
    }


    const handleInvoiceInput = (id) =>{
        invoiceInput = true;
        idx = id
    }

    const handleNameSearch = async () => {
      
      if(!formData.mobile.includes('-')){
          let mobile1 = formData.mobile.substring(0,3);
          let mobile2 = formData.mobile.substring(3,7);
          let mobile3 = formData.mobile.substring(7,11);

          formData.mobile = mobile1+'-'+mobile2+'-'+mobile3;
      }

      //유효성 검사
      if(formData.name==''){
          $cAlert = {flag:true,msg:'고객명을 입력해 주세요.',feedback:()=>{nameInputs.name.focus()}};
          return false;
      }

      if(formData.mobile==''){
          $cAlert = {flag:true,msg:'휴대폰 번호를 입력해 주세요.',feedback:()=>{nameInputs.mobile.focus()}};
          return false;
      }

      if(formData.pass==''){
          $cAlert = {flag:true,msg:'비밀번호를 입력해 주세요.',feedback:()=>{nameInputs.pass.focus()}};
          return false;
      }

      handleGetAs()

      $Loading = {flag:false};
    }

    const handleGetAs = async() => {
        const res = await postApi({
          path:'/api/result',
          data: formData
      });

      if(res.msg=='ok'){
        asResult = res.data;
        totalDocsCount = res.totalDocs;
      } else {
        $cAlert = {flag:true,msg:'입력 정보를 확인해 주세요.',feedback:()=>{}};
        return false;
      }
    }

    const handleMask = () => {
        invoiceInput = false;
    }

    const handleFilter = (e) => {
        if(e.target.value == filter[0]){
            //날짜 내림차순 정렬
            asResult = asResult.sort((a,b) => {
                return a.regDate > b.regDate ? -1 : a.regDate < b.regDate ? 1 : 0;
            })
        } else {
            //날짜 오름차순 정렬
            asResult = asResult.sort((a,b) => {
                return a.regDate < b.regDate ? -1 : a.regDate > b.regDate ? 1 : 0;
            })
        }
    }

    //페이지네이션
    const handlePageClick = async (item) => {
        currentPage = item;
        await handleGetAs()
    }
    
    const handlePrev = async ()=>{
        currentPage -= 1
        await handleGetAs()
    }
    
    const handleNext = async ()=>{
        currentPage += 1
        await handleGetAs()
    }

    const statusColor = (status) => {
        if (status === asStatus[3]) { return 'green' }
    }

    const closeInvoiceInput = ()=>{
        invoiceInput = false;
    }

</script>

<AsHeader {type}></AsHeader>

<div class="wrap">
    <h2>AS 접수내역 확인</h2>
    <p class="caption">*최근 30일 이내의 접수내역을 확인하실 수 있으며 그 이전의 접수내역은 조회 불가능합니다.</p>
    
    <section class="search-area">
        <div class="name-form">
            <div class="name">
                <label for="">접수자명</label>
                <div><input type="text" bind:value={formData.name} bind:this={nameInputs.name} placeholder="접수자명 입력"></div>
            </div>
            <div class="mobile">
                <label for="">핸드폰번호</label>
                <div>
                    <input type="text" bind:value={formData.mobile} bind:this={nameInputs.mobile} placeholder="010-0000-0000">
                </div>
            </div>
            <div class="password">
                <label for="">비밀번호</label>
                <div><input type="password" bind:value={formData.pass} bind:this={nameInputs.pass} placeholder="비밀번호 입력"></div>
            </div>
            <div class="button-area"><button on:click={handleNameSearch}>조회하기</button></div>
        </div>
    </section>
    {#if asResult.length}
    <section class="table-area">
        <div class="table-top">
            <div>전체 <span>{asResult.length}</span>건</div>
            <div class="select">
                <select name="" id="" on:change={handleFilter}>
                    {#each filter as item }
                        <option value={item}>{item}</option>
                    {/each}
                </select>
            </div>
        </div>
        <table class="pc-table">
            <thead>
                <tr>
                    <th class="list-number">접수번호</th>
                    <th class="list-subject">증상</th>
                    <th class="list-writer">접수자</th>
                    <th class="list-date">접수일</th>
                    <th class="list-status">상태</th>
                    <th class="list-invoice">입고송장번호</th>
                </tr>
            </thead>
            <tbody>
                {#each asResult as item}
                    <tr>
                        <td class="list-number">{item.recNum}</td>
                        <td class="list-subject">{category[parseInt(item.symptomFl)]}</td>
                        <td class="list-writer">{item.name}</td>
                        <td class="list-date">{dateFormat(item.regDate)}</td>
                        <td class={`list-status ${statusColor(item.status)}`}>{item.status}</td>
                        {#if !item.recInvoice}
                        <td class="list-invoice empty" on:click={()=>handleInvoiceInput(item.idx)}>송장번호 입력</td>
                        {:else}
                        <td class="list-invoice empty" on:click={()=>handleInvoiceInput(item.idx)}>{item.recCourier} {item.recInvoice}</td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
        <table class="mo-table">
            {#each asResult as item}
            <tbody>
                <tr>
                    <th>접수번호</th>
                    <td class="list-number">{item.recNum}</td>
                </tr>
                <tr>
                    <th>증상</th>
                    <td class="list-subject">{category[parseInt(item.symptomFl)]}</td>
                </tr>
                <tr>
                    <th>접수자</th>
                    <td class="list-writer">{item.name}</td>
                </tr>
                <tr>
                    <th>접수일</th>
                    <td class="list-date">{item.regDate}</td>
                </tr>
                <tr>
                    <th>상태</th>
                    <td class={`list-status ${statusColor(item.status)}`}>{item.status}</td>
                </tr>
                <tr>
                    <th>입고 송장번호</th>
                    {#if !item.recInvoice}
                        <td class="list-invoice empty" on:click={()=>handleInvoiceInput(item.idx)}>송장번호 입력</td>
                    {:else}
                        <td class="list-invoice empty" on:click={()=>handleInvoiceInput(item.idx)}>{item.recCourier} {item.recInvoice}</td>
                    {/if}
                </tr>
            </tbody>
            {/each}
        </table>
        <Pagination
            bind:currentPage={currentPage} 
            {handlePageClick}
            {handlePrev}
            {handleNext}
            {totalDocsCount}
            {pageCount}
            {listLimit}
        />
    </section>
    {/if}
</div>

{#if invoiceInput}
<InvoiceInput 
    {idx} 
    {invoiceInput} 
    {handleMask} 
    {handleGetAs}
    {closeInvoiceInput}
></InvoiceInput>
{/if}

<style lang="scss">
    .wrap {
        padding-top: 40px;
    }
    h2, p {
        text-align: center;
    }

    h2 {
        font-size: var(--font-head-big);
        margin-bottom: 12px;
    }

    .search-area {
        margin-top: 40px;
    }
    .name-form {
        padding-top: 20px;
        display: flex;
        align-items: flex-end;
        gap: 20px;
        >div {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            gap: 10px;
            width: 100%;
            input {
                width: 100%;
            }
        }
        .button-area {
            display: flex;
            margin-top: 40px;
            justify-content: center;
            button {
                width: 150px;
            }
        }
        
    }
    .mo-table { display: none; }
    .table-top {
        display: flex;
        justify-content: space-between;
        >div {
            font-weight: 700;
            span {
                color: var(--orange);
            }
        }
        .select {
            width: 80px;
            &::after {
                width: 6px;
                height: 6px;
                top: calc(50% - 4px);
                right: 0;
            }
        }
        select {
            border: 0;
            width: 100%;
            font-size: var(--font-body-small);
        }
    }
    .table-area {
        margin-top: 100px;
        &>div {
            margin: 0 auto;
            max-width: 1400px;
        }
        table { width: 100%; table-layout: fixed;}
        tr {
            display: flex;
            padding: 20px 0;
            border-bottom: 1px solid var(--gray);
        }
        th, td {
            padding: 0 20px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .list-number {
            flex: 10%;
        }
        .list-subject{
            flex: 20%;
            text-align: left;
        }
        
        .list-writer{
            flex: 10%;
        }
        .list-date {
            flex: 10%;
        }
        .list-status {
            flex: 10%;
        }
        .list-invoice {
            flex: 20%;
            white-space: normal;
            text-overflow: unset;
        }

        td.empty {
            color: var(--orange);
            font-size: var(--font-body-small);
            font-weight: 700;
            text-decoration: underline;
            cursor: pointer;
        }
    }

    .green {
        font-weight: 500;
        color: #00d93c;
    }
    @media only screen and (max-width:1024px){
        
    }

    @media only screen and (max-width:768px){
        .wrap{
            margin-top:36px;
            >h2 {
                text-align: left;
                font-size: var(--font-head-middle);
            }
            >p {
                text-align: left;
            }
            h3 {
                font-size: var(--font-head-normal);
            }
        }
        
        .name-form {
            flex-direction: column;
            gap: 0
            ;
            .button-area {
                margin: 0 auto;
                align-items: center;
            }
        }

        .pc-table { display: none; }
        .mo-table {
            display: block;
            tbody {
                display: flex;
                flex-direction: column;
                width: 100%;
                border-top: 1px solid var(--border-gray);
                border-bottom: 1px solid var(--border-gray);
                padding: 10px 0;
                tr {
                    display: flex;
                    white-space: nowrap;
                    border: none;
                    padding: 8px 0;
                    th, td {
                        padding: 0 12px;
                    }
                    th {
                        flex: 1;
                        text-align: left;
                    }
                    .list-number, .list-subject, .list-writer, .list-date, .list-status, .list-invoice {
                        flex: 3;
                        text-align: left;
                    }
                }
            }
        }
    }

</style>