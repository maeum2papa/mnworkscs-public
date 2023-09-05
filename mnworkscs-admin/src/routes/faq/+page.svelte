<script>
    import { cAlert,Loading } from "../../stores/store";
    import { onMount } from "svelte";
    import { postApi,getApi } from "../../services/api";
    import Header from "../../components/Header.svelte";  
    import { auth } from "../../services/auth";
    import { category } from "../../services/constants";
    import Pagination from "../../components/Pagination.svelte";
    import { sortDown, sortUp } from "../../services/utils";


    let register = false;
    let updateFlag = false;
    let faqs = []

    let currentPage = 1
    let totalDocsCount
    let listLimit = 10
    let pageCount = 5

    let formData = {
        cate: "",
        question: "",
        answer: "",
        page: currentPage,
        limit: listLimit
    };

    const handleRegister = async () =>{
        register = true;
    }

    const handleUpdateModal = async (index) => {
        updateFlag = true

        let find = faqs.find(ele => {
            return ele.idx == index
        })
        formData.idx = index
        formData.cate = Number(find.cate)
        formData.question = find.subject
        formData.answer = find.contents.replaceAll("<br>", "\r\n");
    }

    const handleUpdate = async () => {
        formData.answer = formData.answer.replace(/(?:\r\n|\r|\n)/g, '<br>')
        const res = await postApi({
            path: '/api/faq/update',
            data: formData
        })
        if(res.msg == 'ok'){
            await handleGetFaq()
            updateFlag = false;
            formData = {}
            // location.reload();
        }
    }

    const handleClose = async() => {
        formData = {};
        register = false;
        updateFlag = false;
    }

    const handleGetFaq = async() => {
        const res = await postApi({
            path: '/api/faq',
            data: formData
        })
        if(res.msg == 'ok'){
            faqs = res.list
            totalDocsCount = res.totalDocs
        }
    }

    const handleSubmit = async () => {
        formData.answer = formData.answer.replace(/(?:\r\n|\r|\n)/g, '<br>')
        const res = await postApi({
            path: '/api/faq/add',
            data: formData
        })
        register = false;
        if(res.msg=='ok'){
            await handleGetFaq()
            // location.reload();
        }
    }

    const checkAll = (e) =>{

        if(faqs.length>0){

            if(e.target.checked){

                faqs.forEach((e,i) => {
                    faqs[i].checked = true;
                });
            }else{
                faqs.forEach((e,i) => {
                    faqs[i].checked = false;
                });
            }
        }
    }

    const checkOne = (e)=>{

        if(faqs.length>0){
            if(e.target.checked){
                faqs[e.target.getAttribute('idx')].checked = true;
            }else{
                faqs[e.target.getAttribute('idx')].checked = false;
            }
        }
    }

    const handleFaqDelete = async()=>{
        
        if(faqs.length>0){

            let tmpIdx = [];
            
            faqs.forEach((e,i) => {
                if (faqs[i]?.checked!=undefined && faqs[i]?.checked==true) {
                    tmpIdx.push(e.idx);
                } 
            });
            
            if(tmpIdx.length==0){
                $cAlert = {flag:true,msg:"삭제할 데이터가 없습니다.",feedback:()=>{}};
                return false;    
            }else{
                
                const res = await postApi({
                    path:"/api/faq/delete",
                    data:{idx:tmpIdx}
                });

                if(res.msg=='ok'){
                    handleGetFaq();
                }else{
                    $cAlert = {flag:true,msg:"삭제할 수 없습니다.",feedback:()=>{}};
                    return false;    
                }

            }

        }else{
            $cAlert = {flag:true,msg:"삭제할 데이터가 없습니다.",feedback:()=>{}};
        }
    }

    
    
    const handleSortDown = async(sortId) => {
        let newFaqs = sortDown(sortId, faqs)
        faqs = newFaqs

        await postApi({
            path: `/api/faq/sort`,
            data: {faqs}
        });
        
        handleGetFaq()
    }

    const handleSortUp = async(sortId) => {

        let newFaqs = sortUp(sortId, faqs)
        faqs = newFaqs

        await postApi({
            path: `/api/faq/sort`,
            data: {faqs}
        });
        
        handleGetFaq()
    }

    const handlePageClick = (item) => {
        currentPage = item;
        formData.page = currentPage
        handleGetFaq()
    }

    const handlePrev = ()=>{
        currentPage -= 1
        formData.page = currentPage
        handleGetFaq()
    }
    
    const handleNext = ()=>{
        currentPage += 1
        formData.page = currentPage
        handleGetFaq()
    }



    onMount(async()=>{
        const resAuth = await auth();

        if(resAuth!='ok'){
            location.replace("/login");
            return false;
        }
        handleGetFaq()
    });
    
</script>

<Header/>

<div class="wrap">
    
    <section class="button-area">
        <button type="button" on:click={handleRegister}>신규등록</button>
        <button type="button" on:click={handleFaqDelete}>체크한 것 삭제</button>
    </section>

    <section class="list-area">
        <table>
            <tr class="list-head">
                <th><input type="checkbox" on:click={checkAll}></th>
                <th>no</th>
                <th>내용</th>
                <th>순서</th>
            </tr>
            {#each faqs as item, index}
                <tr class="list-body">
                    <td><input type="checkbox" idx={index} checked={item.checked==true?true:false} on:click={checkOne}></td>
                    <td on:click={()=>handleUpdateModal(item.idx)}>{item.idx}</td>
                    <td on:click={()=>handleUpdateModal(item.idx)}>
                        질문 : {item.subject}
                        <br/>
                        답변 : {@html item.contents}
                    </td>
                    <td>
                        <button on:click={()=>handleSortUp(item.idx)}>▲</button>
                        <button on:click={()=>handleSortDown(item.idx)}>▼</button>
                    </td>
                </tr>
            {/each}
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


{#if register || updateFlag}
<div id="register">
    <select bind:value={formData.cate}>
        <option value="">분류를 선택하세요</option>
        {#each category as item, index}
        <option value={index+1}>{item}</option>
        {/each}
    </select>
    <input type="text" placeholder="질문" bind:value={formData.question}>
    <textarea rows={10} placeholder="답변" bind:value={formData.answer}></textarea>
    <section class="button-area">
        {#if register}
        <button type="button" on:click={handleSubmit}>저장</button>
        {:else if updateFlag}
        <button type="button" on:click={handleUpdate}>수정</button>
        {/if}
        <button type="button" on:click={handleClose}>닫기</button>
    </section>
</div>
{/if}

<style lang="scss">
    #register{
        position: fixed;
        width:100%;
        max-width: 800px;
        top:50%;
        left:50%;
        box-shadow: 0px 0px 10px rgba(1,1,1,0.3);
        border-radius: 4px;
        padding:20px;
        transform: translate(-50%,-50%);
        background-color: #fff;

        input, select{
            width:100%;
            box-sizing: border-box;
            padding:10px;
        }

        select {
            margin-bottom: 5px;
        }
        
        textarea{
            width:100%;
            box-sizing: border-box;
            padding:10px;
            margin-top:5px;
            height: 30vh;
        }

        .button-area{
            padding-left:0;
        }
    }
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
        
        th:nth-of-type(1){
            width: 50px;
        }
        th:nth-of-type(2){
            width: 100px;
        }
        td:nth-of-type(3){
            text-align: left;
            padding-left:10px;
        }
        
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

</style>