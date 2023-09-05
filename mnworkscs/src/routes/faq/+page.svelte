<script>
    import { onMount } from "svelte";
    import { postApi } from "../../services/api";
    import Pagination from "../../components/Pagination.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { dateFormat } from "../../services/format";
    import { category } from "../../services/constants";
    
    const searchHashtag = ['세척', '자가점검', 'led가 이상해요', '제품연결', '음질'];
    let faq = [];
    let filter = ['최신순', '오래된순'];

    let currentPage = 1;
    let listLimit = 10;
    let pageCount = 5
    let totalDocsCount;
    
    let formData = {
        category: "",
        keyword: "",
        limit: listLimit,
        page: currentPage
    };
    let searchResult = false;
    let searchResultKeyword = "";
    let isActive = null;
    
    const handleGetFaq = async () => {
        const res = await postApi({
            path: '/api/faq',
            data: formData,
        })
        if(res.msg == 'ok') {
            faq = res.data
            totalDocsCount = res.totalDocs
            searchResult = true
            searchResultKeyword = formData.keyword
        }
    }

    const handleSearch = () => {
        if(formData.keyword) {
            handleGetFaq()
        }
    }
    
    const handleCategory = (index) => {
        formData.category = index;
        handleGetFaq()
        isActive = index;
    }

    const handleHashtag = (item) => {
        formData.keyword = item
        handleGetFaq()
    }

    const handleEnter = (e) => {
        if(e.keyCode==13){
            handleGetFaq()
        }
    }

    const handleFilter = (e) => {
        if(e.target.value == filter[0]){
            //날짜 내림차순 정렬
            faq = faq.sort((a,b) => {
                return a.regDate > b.regDate ? -1 : a.regDate < b.regDate ? 1 : 0;
            })
        } else {
            //날짜 오름차순 정렬
            faq = faq.sort((a,b) => {
                return a.regDate < b.regDate ? -1 : a.regDate > b.regDate ? 1 : 0;
            })
        }
    }

    //페이지네이션
    const handlePageClick = async (item) => {
        currentPage = item;
        await handleGetFaq()
    }
    
    const handlePrev = async ()=>{
        currentPage -= 1
        await handleGetFaq()
    }
    
    const handleNext = async ()=>{
        currentPage += 1
        await handleGetFaq()
    }

    const handleHitsAdd = async (idx) => {
        formData.id = idx
        const res = await postApi({
            path: `/api/faq`,
            data: formData
        })
    }

    onMount(async ()=>{
        const keyword = $page.url.searchParams.get('keyword')
        if(keyword) { 
            formData.keyword = keyword 
        }

        handleGetFaq()
    })

</script>

<div class="wrap">
    <!-- <div class="product-box">
        <div>
            <div>헤드셋</div>
            <div>Arctis Nova Pro</div>
        </div>
        <div>변경</div>
    </div> -->
    <section class="search-area">
        <div class="solving">
            <div class="active">문제해결 Q&A</div>
        </div>
        <div class="search-box">
            <div class="search-input">
                <input type="text" placeholder="문제 증상을 검색해 주세요." bind:value={formData.keyword} on:keydown={handleEnter}>
                <button on:click={handleSearch}></button>
            </div>
            <div class="search-word">
                <div>추천검색키워드</div>
                <ul>
                    {#each searchHashtag as item}
                        <li on:click={()=>handleHashtag(item)}>#{item}</li>
                    {/each}
                </ul>
            </div>
        </div>
    </section>
    <section class="symptom-area">
        <div>
            <h3>제품에 나타난 증상을 선택해 주세요</h3>
        </div>
        <div>
            <p>어떤 문제가 발생했나요?</p>
            <ul>
                {#each category as item, index}
                    <li on:click={()=>handleCategory(index+1)} class={isActive == index+1 ? 'active': ''}>{item}</li>
                {/each}
            </ul>
        </div>
    </section>
    {#if searchResult}
    <section class="table-area">
        {#if searchResultKeyword}
            <h3>"<span>{searchResultKeyword}</span>" 검색 결과</h3>
        {/if}
        <div class="table-top">
            <div>전체 <span>{faq.length}</span>건</div>
            <div class="select">
                <select name="" id="" on:change={handleFilter}>
                    {#each filter as item }
                        <option value={item}>{item}</option>
                    {/each}
                </select>
            </div>
        </div>
        <table>
            <tbody>
                {#each faq as item, index}
                    <tr>
                        <td class="list-model">{category[item.cate-1]}</td>
                        <td class="list-subject"><a href={`/faq/${item.idx}`} on:click={()=>handleHitsAdd(item.idx)}>{item.subject}</a></td>
                        <td class="list-date">{dateFormat(item.regDate)}</td>
                    </tr>
                {/each}
            </tbody>
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
    <section class="bottom-area">
        <div>
            제품 문제가 아직 해결되지 않았나요?<br/>
            <span>온라인 AS 접수</span>를 이용해 보세요.
        </div>
        <div>
            <img src="/images/icon_online_as.png" alt="">
            <strong>온라인 AS 접수</strong>
            <p>
                이메일, 전화, 실시간 상담을<br/>
                이용하실 수 있어요
            </p>
            <button on:click={()=>goto('/as')}>접수하기</button>
        </div>
    </section>
</div>


<style lang="scss">
    .wrap{
        max-width: 888px;
        margin: 80px auto 0;
    }
    .product-box {
        padding: 40px;
        border-radius: 10px;
        background-color: var(--bg-gray);
        border: 1px solid var(--border-gray);
        display: flex;
        justify-content: space-between;
        font-size: var(--font-body-small);
        >div:first-child {
            display: flex;
            >div:first-child {
                margin-right: 24px;
                position: relative;
                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-right: 1px solid #000000;
                    border-top: 1px solid #000000;
                    right: -12px;
                    top: calc(50% - 2px);
                    transform: rotate(45deg);
                }
            }
        }
    }
    .search-area {
        .solving{
            border-bottom:1px solid var(--border-gray);
            display: flex;
            margin: 40px 0 20px;
            font-size: var(--font-body-middle);
            font-weight: 700;
            margin: 40px 0 20px;
            padding: 10px 0;
        }
        .search-box {
            width: 100%;
            // height: 69px;
            background-color: var(--bg-gray);
            border-radius: 10px;
            padding: 30px 0 20px;
            .search-input {
                position: relative;
                max-width: 508px;
                margin: 0 auto;
                input {
                    width: 100%;
                    border-radius: 20px;
                    border: none;
                    padding: 12px 20px;
                    font-size: var(--font-body-small);
                }
                button {
                    position: absolute;
                    right: 10px;
                    top: 12px;
                    min-width: 16px;
                    height: 16px;
                    background: url('/images/icon_search.png') no-repeat;
                    background-position: center;
                    background-size: contain;
                    overflow: hidden;
                    text-indent: -50px;   
                }
            }
            .search-word {
                width: 90%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 10px auto;
                cursor: pointer;
                >div {
                    font-size: 12px;
                    position: relative;
                    text-align: center;
                    &::after {
                        content: '';
                        display: block;
                        width: 1px;
                        height: 15px;
                        background-color: var(--border-gray);
                        position: absolute;
                        top: 0;
                        right: -10px
                    }
                }
                >ul {
                    display: flex;
                    font-size: 12px;
                    gap: 4px;
                    flex-wrap: wrap;
                    position: relative;
                    margin-left: 16px;
                    li { color: var(--gray700);}
                }
            }
        }
    }
    .symptom-area {
        margin-top: 80px;
        h3 {
            font-size: var(--font-head-normal);
            padding-bottom: 20px;
            border-bottom: 3px solid #000000;
        }
        >div:last-child {
            p {
                font-weight: 700;
                margin: 30px 0 20px;
            }
            ul {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                li {
                    padding: 8px 12px;
                    border-radius: 20px;
                    border: 1px solid #000000;
                    white-space: nowrap;
                    cursor: pointer;
                }
                li.active {
                    color: var(--orange);
                    border-color: var(--orange);
                }
            }
        }
        
    }
    .table-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        >div {
            margin-top: 40px;
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
        margin-top: 80px;
        h3 {
            font-size: var(--font-head-normal);
            span {
                color: var(--orange);
            }
        }
        &>div {
            margin: 0 auto;
            max-width: 1400px;
        }
        table { 
            width: 100%; 
            table-layout: fixed;
        }
        tr {
            display: flex;
            padding: 20px 0;
            border-bottom: 1px solid var(--gray);
        }
        th, td {
            margin: 0 20px;
            text-align: center;
        }
        td.list-model,  td.list-date {
            font-size: var(--font-body-small);
            color: var(--gray700);
        }
        .list-model {
            flex: 1;
        }
        .list-subject {
            flex: 6;
            text-align: left;
            width: 100%;
            a {
                width: 100%;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .list-date {
            flex: 2;
        }
    }

    .bottom-area {
        margin-top: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 80px;
        >div:first-child {
            font-size: var(--font-head-normal);
            font-weight: 700;
            line-height: 1.5em;
            span {
                color: var(--orange);
            }
        }
        >div:last-child {
            width: 160px;
            border-radius: 20px;
            box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.18);
            padding: 30px 40px;
            text-align: center;
            img {

            }
            strong {
                display: block;
                margin: 10px 0;
            }
            p {
                font-size: var(--font-body-small);
                margin-bottom: 20px;
            }
            button {
                width: 101px;
            }
        }
    }


    @media only screen and (max-width:1024px){
        
    }

    @media only screen and (max-width:768px){
        .wrap{
            margin-top:36px;
        }
        .product-box {
            padding: 20px;
            font-size: var(--font-body-tiny);
        }
        .search-area {
            .search-input {
                width: 90%;
            }
        }
        .symptom-area { 
            a { font-size: var(--font-body-tiny); }
        }
        .table-area {
            tr {
                flex-direction: column;
                align-items: start;
                td {
                    margin: 0;
                    &:nth-of-type(2) {
                        padding: 8px 0;
                        font-size: var(--font-body-normal);
                        line-height: 1.25em;
                    }
                }
            }
        }
        .bottom-area { 
            flex-direction: column;
            div {
                text-align: center;
                &:first-child {
                    font-size: var(--font-body-middle);
                    // font-size: var(--font-head-small);
                }
            }
        }
        .symptom-area, .table-area {
            h3 {
                font-size: var(--font-head-small);
            }
        }
    }

</style>