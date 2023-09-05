<script>

    export let serialGuide;
    export let handleMask;

</script>

{#if serialGuide}
<div id="serial-guide">
    <img src="/images/find_serial.png" alt="시리얼번호 가이드">
    <p>제품패키지에 기재된 시리얼번호 (SN/Serial No)
    정확히 기재해 주시기 바랍니다.</p>
    <div class='button-area'><button type="button" on:click={handleMask}>닫기</button></div>
</div>
<div class="mask" on:click={handleMask}></div>
{/if}

<style lang="scss">
    #serial-guide{
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
        margin-top:40px;
        white-space: pre-line;
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

    @media only screen and (max-width:768px){
        #serial-guide{
            min-width: 200px;
            img{
                width:100%;
            }
        }
        p{
            line-height: 20px;
        }
    }
</style>