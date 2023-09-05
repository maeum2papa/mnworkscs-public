<script>
    import { postApi } from "../services/api";

    export let type;

    let classOn = {
        intro:'',
        authenticity:'',
        process:'',
        product:''
    }

    classOn[type] = 'on';
</script>

<div class="cs-title">
    <p>
        엠앤웍스는 최상의 제품과<br/>
        서비스를 실현합니다.
    </p>
</div>

<div class="tab">
    <div class="contianer">
        <ul>
            <li class={classOn.intro}><a href="/cs/intro">엠엔웍스 지원센터 소개</a></li>
            <li class={classOn.authenticity}><a href="/cs/authenticity">정품 인증 스티커 캠페인</a></li>
            <li class={classOn.process}><a href="/cs/process">온라인 AS 진행절차 안내</a></li>
            <li class={classOn.product}><a href="/cs/as-product">온라인 AS 접수 가능 제품 안내</a></li>
        </ul>
    </div>
</div>

<style lang="scss">
    .cs-title{
        background: black;
        text-align: center;
        padding:50px 0px;
        p{
            color:white;
            font-size: var(--font-body-middle);
            font-weight: 700;
            line-height: 1.25em;
        }
    }

    .tab{
        border-bottom:1px solid var(--gray);
        text-align: center;

        ul{
            display: flex;
            max-width:1024px;
            margin: 0 auto;
            justify-content: center;
            li {
                display: flex;
                width:100%;
                max-width: 398px;
                font-size:var(--font-body-normal);
                font-weight: 600;
                padding:22px;
                align-items: center;
                justify-content: center;
                    
                &.on{
                  background:var(--orange);
                  a { color:#fff;  }
                }

                &:not(.on):first-of-type{
                    border-left:1px solid var(--gray);
                    border-right:1px solid var(--gray);
                }

                &:not(.on):nth-of-type(2){
                    // border-left:1px solid var(--gray);
                    border-right:1px solid var(--gray);
                }

                &:not(.on):last-of-type{
                    border-left:1px solid var(--gray);
                    border-right:1px solid var(--gray);
                }

                
            }
        }
    }


    @media only screen and (max-width:1024px){
        
    }

    @media only screen and (max-width:768px){
        .page{
            padding:66px 0px;
            h1{
                font-size:20px;
            }
            p{
                font-size:12px;
                line-height: 17px;
                margin-top:16.6px;
            }
        }

        .tab{
            ul{
                display: grid;
                grid-template-columns: 1fr 1fr;
                li {
                    font-size: var(--font-body-small);
                    line-height: 24px;
                    height: 50px;
                    padding: 0;
                    display: flex;
                    a{
                        padding: 0 20px;
                        line-height: 1.25em;
                    }
                    &:not(.on):first-of-type{
                        border-left:1px solid var(--gray);
                        border-bottom:1px solid var(--gray);
                    }
                    
                    &:not(.on):nth-of-type(2){
                        border-bottom:1px solid var(--gray);
                        // border-left:1px solid var(--gray);
                    }

                    &:not(.on):last-of-type{
                        border-left:1px solid var(--gray);
                        border-right:1px solid var(--gray);
                    }
                }
            }
        }
    }

</style>