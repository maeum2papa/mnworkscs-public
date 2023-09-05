<script>
    import CsHeader from "../../../components/CsHeader.svelte";

    const type = 'intro'
</script>

<CsHeader {type}/>
<div class="cs">
    <h2>엠앤웍스 지원센터 소개</h2>
    <div>
        <img src="/images/cs_banner.png" alt="">
    </div>
    <p>
        앰엔웍스는 고객에게 구매 제품의 온라인 A/S 접수 및 진행과 관련된 서비스를 제공하기 위해<br/>
        ▲최고의(First) ▲차별화된(Unique) ▲세상에 없던(New) F·U·N 경험을 선사하고자 항상 노력합니다.<br/>
        <br/>
        A/S와 관련된 정보를 지원센터에서 빠르게 확인 하실 수 있습니다.<br/>
    </p>
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