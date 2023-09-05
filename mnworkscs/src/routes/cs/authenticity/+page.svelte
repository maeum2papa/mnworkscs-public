<script>
    import { goto } from "$app/navigation";
    import CsHeader from "../../../components/CsHeader.svelte";
    
    const type = 'authenticity'
</script>

<CsHeader {type}/>
<div class="cs">
    <h2>정품 인증 스티커 캠페인</h2>
    <div>
        <img src="/images/cert_banner.png" alt="">
    </div>
    <p>
        본 스티커가 부탁된 제품은 정품인증 스티커로<br/>
        정품등록 접수를 통해 등록 후 A/S를 포함한 고객지원 서비스를 받으실 수 있습니다.<br/>
        <span class="caption">( 단, 마우스 패드 제외 )</span>
    </p>
    <button on:click={()=>{goto
    ('/genuine')}}>정품등록</button>
</div>

<style lang="scss">
    .cs {
        text-align: center;
        padding: 40px 20px;
        >div {
            margin: 40px auto;
            max-width: 376px;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        h2 {
            font-size: var(--font-head-middle);
        }
        p {
            font-size: var(--font-body-middle);
            line-height: 1.25em;
        }
        button {
            width: 87px;
            height: 40px;
            margin-top: 20px;
        }
    }
    
    @media only screen and (max-width:768px){
        .cs {
            h2 {
                font-size: var(--font-head-normal);
            }
            p {
                font-size: var(--font-body-normal);
                line-height: 1.25em;
            }
        }
    }
</style>