<script>
    import Pagination from "../../components/Pagination.svelte";
    import { onMount } from "svelte";
    import { postApi } from "../../services/api";
    
    let notice = []
    let currentPage = 1
    let totalDocsCount
    let listLimit = 3
    let pageCount = 5

    // const searchType = ['제목', '내용']
    let formData = {
        // type: searchType[0],
        keyword: "",
        page: currentPage,
        limit: listLimit
    }

    onMount(async()=>{
        const res = await postApi({
            path: '/api/notice',
            data: formData
        })
        notice = res.data
        totalDocsCount = res.totalDocs
    })

    const handleGetNotice = async () => {
        const res = await postApi({
            path: '/api/notice',
            data: formData
        })
        notice = res.data
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

    // const handleTypeChange = (e) => {
    //     formData.type = e.target.value
    // }

    const handleSearch = async () => {
        if(formData.keyword) {
            const res = await postApi({
                path: '/api/notice',
                data: formData
            })
            notice = res.data
        }
    }

    //조회수 변경. 제목 클릭 시 hits + 1
    const handleHitsAdd = async (idx) => {
        formData.id = idx
        const res = await postApi({
            path: `/api/notice`,
            data: formData
        })
    }
</script>

<div class="notice-header">
    <h1>공지사항</h1>
</div>

<div class="wrap">

    <section class="search-area">
        <div>
            <!-- <div class="search-select">
                <select name="" id="" on:change={handleTypeChange}>
                    {#each searchType as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>
            </div> -->
            <input type="text" bind:value={formData.keyword}>
            <button on:click={handleSearch}>검색</button>
        </div>
    </section>

    <section class="table-area">
        <table>
            <thead>
                <tr>
                    <th class="list-number">번호</th>
                    <th class="list-subject">제목</th>
                    <th class="list-writer">작성자</th>
                    <th class="list-date">작성일</th>
                    <th class="list-number">조회수</th>
                </tr>
            </thead>
            <tbody>
                {#each notice as item}
                    <tr>
                        <td class="list-number">{item.idx}</td>
                        <td class="list-subject"><a href={`/notice/${item.idx}`} on:click={()=>handleHitsAdd(item.idx)}>{item.subject}</a></td>
                        <td class="list-writer">{item.writer}</td>
                        <td class="list-date">{item.regDate}</td>
                        <td class="list-number">{item.hits}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
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

<style lang="scss">
    .wrap{
        margin-top:80px;
    }
    .notice-header{
        background: black;
        text-align: center;
        padding: 50px 0px;
        h1{
            color: white;
            font-size: var(--font-head-middle);
            font-weight: 700;
        }
        p{
            color:white;
            white-space:pre-line;
            line-height: 37px;
            margin-top:37px;
        }
    }


    .search-area {
        &>div{
            display: flex;
            justify-content: center;
            select {
                width: 140px;
                border-radius: 70px;
                margin-right: 10px;
            }
            .search-select { 
                position: relative; 
            }
            .search-select::after {
                content: "";
                position: absolute;
                top: calc(50% - 8px);
                right: 23.5px;
                width: 15px;
                height: 15px;
                border: 1px solid #444;
                border-top: 0px;
                border-right: 0px;
                transform: rotate(-45deg) translateY(-50%);
                transform-origin: center;
                z-index: -1;
            }
            input {
                margin-right: 10px;
            }
        }
    }
    
    .table-area {
        margin-top: 100px;
        &>div {
            margin: 0 auto;
            max-width: 1400px;
        }
        table { width: 100%; }
        tr {
            display: flex;
            padding: 20px 0;
            border-bottom: 1px solid var(--gray);
        }
        th, td {
            padding: 0 20px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .list-number, .list-writer, .list-date {
            flex: 1;
        }
        .list-subject {
            flex: 4;
            text-align: left;
        }
    }

    @media only screen and (max-width:1024px){
        
    }

    @media only screen and (max-width:768px){
        .wrap{
            margin-top:36px;
        }
        .notice-header{
            padding:40px 0px;
            h1{
                font-size: var(--font-body-middle)
            }
            p{
                font-size:12px;
                line-height: 17px;
                margin-top:16.6px;
            }
        }
        .table-area {
            margin-top: 40px;
            th, .list-number {
                display: none
            };
            tr {
                display: block;
            }
            td {
                display: inline-block;
            }
            .list-subject {
                white-space: nowrap;
                margin-bottom: 8px;
                width: 100%;
            }

        }
    }

</style>