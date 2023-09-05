<script>

    export let storeGuide;
    export let handleMask;

</script>

{#if storeGuide}
<div id="store-guide">
    <h3>온라인</h3>
    <p>스틸시리즈 네이버 공식몰/쿠팡/G마켓/옥션/SSG/11번가 등
        쇼핑몰 명칭 정확히 기재</p>
    <h3>오프라인</h3>
    <p>이마트 00점, 하이마트 00점, 슈퍼플레이 00점 등
        매장명과 지점명을 모두 기재</p>
    <div class="help">구매처가 정확하지 않은 경우 정품등록 및 A/S시 문제가 될 수 있습니다.</div>
    <div class='button-area'><button type="button"  on:click={handleMask}>닫기</button></div>
</div>
<div class="mask" on:click={handleMask}></div>
{/if}

<style lang="scss">
    #store-guide{
        position:fixed;
        min-width: 300px;
        padding:40px;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        background: #fff;
        z-index: 2001;
        border-radius: 4px;
        text-align: center;
        
        div{
            font-size:var(--font-size-normal);
        }
    }
    .button-area{
        margin-top:40px;
    }
    p{
        margin-top:20px;
        white-space: pre-line;
        background:#EFEFEF;
        padding:20px;
        line-height: 30px;
    }
    .mask{
        position: fixed;
        width:100vw;
        height: 100vh;
        background: rgba(1,1,1,0.9);
        z-index: 2000;
        top:0;
        left:0;
    }
    .help{
        margin-top:40px;
        line-height: 30px;
        word-break: keep-all;
    }
    h3{
        &:last-of-type{
            margin-top:40px;
        }
    }

    @media only screen and (max-width:768px){
        #store-guide{
            min-width: 200px;
        }

        p{
            line-height: 20px;
        }

        .help{
            line-height: 20px;
        }
    }
</style>