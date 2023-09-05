<script>
    import { cAlert,Loading } from "../../stores/store";
    import { onMount } from "svelte";
    import { postApi,getApi } from "../../services/api";
    import Header from "../../components/Header.svelte";  
    import { auth } from "../../services/auth";
    import { resizeImage } from "../../services/resizeimage";
    import Pagination from "../../components/Pagination.svelte";
    import { sortDown, sortUp } from "../../services/utils";

    let notices = []
    let register = false;
    let updateFlag = false;
    let files;
    
    let currentPage = 1
    let totalDocsCount
    let listLimit = 10
    let pageCount = 5

    let formData = {
        subject: "",
        file: "",
        contents: "",
        page: currentPage,
        limit: listLimit
    }

    const handleRegister = () =>{
        register = true;
    }

    const handleUpdateModal = async (index) => {
        updateFlag = true

        let find = notices.find(ele => {
            return ele.idx == index
        })
        formData = find
        formData.contents = find.contents.replaceAll("<br>", "\r\n");
    }

    const handleUpdate = async () => {
        formData.contents = formData.contents.replace(/(?:\r\n|\r|\n)/g, '<br>')
        const res = await postApi({
            path: '/api/notice/update',
            data: formData
        })
        if(res.msg == 'ok'){
            await handleGetNotice()
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

    const handleGetNotice = async() => {
        const res = await postApi({
            path: '/api/notice',
            data: formData
        })
        if(res.msg == 'ok'){
            notices = res.list
            totalDocsCount = res.totalDocs
        }
    }

    const handleSubmit = async () => {
        formData.contents = formData.contents.replace(/(?:\r\n|\r|\n)/g, '<br>')
        const res = await postApi({
            path: '/api/notice/add',
            data: formData
        })
        register = false;
        if(res.msg=='ok'){
            location.reload();
        }
    }

    const handleFileChange = async (e) => {
        let resize = await resizeImage(files[0],600,1350);
        formData.file = resize;
    }

    const checkAll = (e) =>{

        if(notices.length>0){

            if(e.target.checked){

                notices.forEach((e,i) => {
                    notices[i].checked = true;
                });
            }else{
                notices.forEach((e,i) => {
                    notices[i].checked = false;
                });
            }
        }
    }

    const checkOne = (e)=>{

        if(notices.length>0){
            if(e.target.checked){
                notices[e.target.getAttribute('idx')].checked = true;
            }else{
                notices[e.target.getAttribute('idx')].checked = false;
            }
        }
    }

    const handleNoticeDelete = async()=>{
        
        if(notices.length>0){

            let tmpIdx = [];
            
            notices.forEach((e,i) => {
                if (notices[i]?.checked!=undefined && notices[i]?.checked==true) {
                    tmpIdx.push(e.idx);
                } 
            });
            
            if(tmpIdx.length==0){
                $cAlert = {flag:true,msg:"삭제할 데이터가 없습니다.",feedback:()=>{}};
                return false;    
            }else{
                
                const res = await postApi({
                    path:"/api/notice/delete",
                    data:{idx:tmpIdx}
                });

                if(res.msg=='ok'){
                    handleGetNotice();
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
        let newNotices = sortDown(sortId, notices)
        notices = newNotices

        await postApi({
            path: `/api/notice/sort`,
            data: {notices}
        });
        
        handleGetNotice()
    }

    const handleSortUp = async(sortId) => {

        let newNotices = sortUp(sortId, notices)
        notices = newNotices

        await postApi({
            path: `/api/notice/sort`,
            data: {notices}
        });
        
        handleGetNotice()
    }

    const handlePageClick = (item) => {
        currentPage = item;
        formData.page = currentPage
        handleGetNotice()
    }

    const handlePrev = ()=>{
        currentPage -= 1
        formData.page = currentPage
        handleGetNotice()
    }
    
    const handleNext = ()=>{
        currentPage += 1
        formData.page = currentPage
        handleGetNotice()
    }
    
    onMount(async()=>{
        const resAuth = await auth();

        if(resAuth!='ok'){
            location.replace("/login");
            return false;
        }
        handleGetNotice()
    });
    
</script>

<Header/>

<div class="wrap">
    
    <section class="button-area">
        <button type="button" on:click={handleRegister}>신규등록</button>
        <button type="button" on:click={handleNoticeDelete}>체크한 것 삭제</button>
    </section>

    <section class="list-area">
        <table>
            <tr class="list-head">
                <th><input type="checkbox" on:click={checkAll}></th>
                <th>no</th>
                <th>콘텐츠</th>
                <th>순서</th>
            </tr>
            {#each notices as item, index}
                <tr class="list-body">
                    <td><input type="checkbox" idx={index} checked={item.checked==true?true:false} on:click={checkOne}></td>
                    <td on:click={()=>handleUpdateModal(item.idx)}>{item.idx}</td>
                    <td on:click={()=>handleUpdateModal(item.idx)}>
                        제목 : {item.subject}
                        <br/>
                        내용 : {@html item.contents}
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
    <input type="text" bind:value={formData.subject} placeholder="제목">
    <input type="file" bind:files on:change={handleFileChange}>
    <textarea rows={10} bind:value={formData.contents} placeholder="내용"></textarea>
    

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
        background-color: #ffffff;

        input{
            width:100%;
            box-sizing: border-box;
            padding:10px;
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