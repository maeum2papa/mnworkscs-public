<script>
    import { cAlert,Loading } from "../../stores/store";
    import { onMount } from "svelte";
    import { postApi,getApi } from "../../services/api";
    import Header from "../../components/Header.svelte";  
    import { auth } from "../../services/auth";
    import { dateFormat } from "../../services/format";
    import { resizeImage } from "../../services/resizeimage";
    import Pagination from "../../components/Pagination.svelte";
    import { sortDown, sortUp } from "../../services/utils";


    let register = false;
    let updateFlag = false;
    let popups = []
    let files;
    
    let currentPage = 1
    let totalDocsCount
    let listLimit = 10
    let pageCount = 5

    let formData = {
        startDate: null,
        endDate: null,
        file: "",
        page: currentPage,
        limit: listLimit
    }

    const handleRegister = () =>{
        register = true;
    }

    const handleClose = async() => {
        formData = {};
        register = false;
        updateFlag = false;
    }

    const handleUpdateModal = async (index) => {
        updateFlag = true

        let find = popups.find(ele => {
            return ele.idx == index
        })
        formData = find
        formData.startDate = find.startDate.slice(0, 10)
        formData.endDate = find.endDate.slice(0, 10)
    }

    const handleUpdate = async () => {
        const res = await postApi({
            path: '/api/popup/update',
            data: formData
        })
        if(res.msg == 'ok'){
            await handleGetPopup()
            updateFlag = false;
            formData = {}
            // location.reload();
        }
    }

    const handleGetPopup = async() => {
        const res = await postApi({
            path: '/api/popup',
            data: formData
        })
        if(res.msg == 'ok'){
            popups = res.list
            totalDocsCount = res.totalDocs
        }
    }

    const handleSubmit = async () => {
        const res = await postApi({
            path: '/api/popup/add',
            data: formData
        })
        register = false;
        if(res.msg=='ok'){
            // await handleGetPopup()
            location.reload();
        }
    }

    const handleFileChange = async (e) => {
        let resize = await resizeImage(files[0],600,800);
        formData.file = resize;
    }

    const checkAll = (e) =>{

        if(popups.length>0){

            if(e.target.checked){

                popups.forEach((e,i) => {
                    popups[i].checked = true;
                });
            }else{
                popups.forEach((e,i) => {
                    popups[i].checked = false;
                });
            }
        }
    }

    const checkOne = (e)=>{

        if(popups.length>0){
            if(e.target.checked){
                popups[e.target.getAttribute('idx')].checked = true;
            }else{
                popups[e.target.getAttribute('idx')].checked = false;
            }
        }
    }

    const handlePopupDelete = async()=>{
        
        if(popups.length>0){

            let tmpIdx = [];
            
            popups.forEach((e,i) => {
                if (popups[i]?.checked!=undefined && popups[i]?.checked==true) {
                    tmpIdx.push(e.idx);
                } 
            });
            
            if(tmpIdx.length==0){
                $cAlert = {flag:true,msg:"삭제할 데이터가 없습니다.",feedback:()=>{}};
                return false;    
            }else{
                
                const res = await postApi({
                    path:"/api/popup/delete",
                    data:{idx:tmpIdx}
                });

                if(res.msg=='ok'){
                    handleGetPopup();
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
        let newPopups = sortDown(sortId, popups)
        popups = newPopups

        await postApi({
            path: `/api/popup/sort`,
            data: {popups}
        });
        
        handleGetPopup()
    }

    const handleSortUp = async(sortId) => {

        let newPopups = sortUp(sortId, popups)
        popups = newPopups

        await postApi({
            path: `/api/popup/sort`,
            data: {popups}
        });
        
        handleGetPopup()
    }

    const handlePageClick = (item) => {
        currentPage = item;
        formData.page = currentPage
        handleGetPopup()
    }

    const handlePrev = ()=>{
        currentPage -= 1
        formData.page = currentPage
        handleGetPopup()
    }
    
    const handleNext = ()=>{
        currentPage += 1
        formData.page = currentPage
        handleGetPopup()
    }

    onMount(async()=>{
        const resAuth = await auth();

        if(resAuth!='ok'){
            location.replace("/login");
            return false;
        }
        handleGetPopup()
    });
    
</script>

<Header/>

<div class="wrap">
    
    <section class="button-area">
        <button type="button" on:click={handleRegister}>신규등록</button>
        <button type="button" on:click={handlePopupDelete}>체크한 것 삭제</button>
    </section>

    <section class="list-area">
        <table>
            <tr class="list-head">
                <th><input type="checkbox" on:click={checkAll}></th>
                <th>no</th>
                <th>팝업이미지</th>
                <th>유효기간</th>
                <th>순서</th>
            </tr>
            {#each popups as item, index}
                <tr class="list-body">
                    <td><input type="checkbox" idx={index} checked={item.checked==true?true:false} on:click={checkOne}></td>
                    <td on:click={()=>handleUpdateModal(item.idx)}>{item.idx}</td>
                    <td on:click={()=>handleUpdateModal(item.idx)}>
                        <img src={item.file}>
                    </td>
                    <td>{dateFormat(item.startDate)} ~ {dateFormat(item.endDate)}</td>
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
    <input type="file" bind:files on:change={handleFileChange}>

    <input type="date" bind:value={formData.startDate}> ~ <input type="date" bind:value={formData.endDate}>

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
            margin-top:5px;

            &[type=date]{
                width:150px;
            }
        }
        
        textarea{
            width:100%;
            box-sizing: border-box;
            padding:10px;
            margin-top:5px;
            height: 30vh;
        }

        table{
            border:1px solid gray;
            width:100%;
            margin-top:5px;
        }
        th,td{
            vertical-align: middle;
            border:1px solid gray;
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