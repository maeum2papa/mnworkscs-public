<script>

    export let handlePageClick
    export let handlePrev
    export let handleNext
    export let currentPage
    export let totalDocsCount
    export let listLimit
    export let pageCount

    $: totalPages = Math.ceil(totalDocsCount/listLimit)
    let pageNum = []

    let pageGroup = Math.ceil(currentPage / pageCount) - 1
    let start = pageGroup * pageCount + 1
    let end = start + pageCount - 1
    end = end > totalPages ? totalPages : end
    for (let i = start; i < end + 1; i++) {
        pageNum.push(i)
    }

    //page 번호 넘어가는 코드
    //currentPage가 변경될 때마다 아래 코드 실행
    $: currentPage,
    (()=>{
        let newPageNum = []
        pageGroup = Math.ceil(currentPage / pageCount) - 1
        start = pageGroup * pageCount + 1
        end = start + pageCount - 1
        end = end > totalPages ? totalPages : end
        for (let i = start; i < end + 1; i++) {
            newPageNum.push(i)
        }
        pageNum = newPageNum
    })()

</script>

<div class="pagination">
    <div>
        <button on:click={handlePrev} disabled={currentPage === 1}>이전</button>
        {#each pageNum as item}
            <button class={currentPage == item ? 'active' : ''} on:click={()=>handlePageClick(item)}>{item}</button>
        {/each}
        <button on:click={handleNext} disabled={currentPage === totalPages}>다음</button>
    </div>
</div>

<style lang="scss">
    .pagination{
        text-align: center;
        margin-top: 20px;
        div{
            
        }
    }
    button {
        background: none;
        color: #000;
        min-width: 0;
        font-weight: 400;
        padding: 10px;
        &.active {
            color: var(--primary);
            font-weight: 800;
        }
        &:active {
            background: none;
        }
        &:disabled {
            color: var(--font-gray);
        }
        
    }
</style>