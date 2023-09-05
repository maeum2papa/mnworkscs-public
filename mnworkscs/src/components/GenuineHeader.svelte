<script>
    export let type;

    let classOn = {
        genuine:'',
        inquiry:''
    }

    classOn[type] = 'on';
    
</script>

<div class="page">
    <h1>정품등록</h1>
    <p>제품을 구매해 주셔서 감사합니다.
        구매하신 제품을 정품등록하시면 브랜드에서
        보증하는 AS를 받으실 수 있습니다.</p>
</div>

<div class="tab">
    <div class="contianer">
        <a href="/genuine" class={classOn.genuine}>정품등록 접수</a>
        <a href="/inquiry"  class={classOn.inquiry}>정품등록 조회</a>
    </div>
</div>

<style lang="scss">
    .page{
        background: black;
        text-align: center;
        padding:50px 0px;
        h1{
            color: white;
            font-size: var(--font-head-middle);
            font-weight: 700;
        }
        p{
            color:white;
            white-space:pre-line;
            line-height: 1.25em;
            margin-top:20px;
        }
    }

    .tab{
        border-bottom:1px solid var(--gray);
        text-align: center;

        .contianer{
            display: flex;
            max-width:1024px;
            margin: 0 auto;
            justify-content: center;
            a{
                display: block;
                width:100%;
                max-width: 398px;
                font-size:var(--font-body-normal);
                font-weight: 600;
                padding:22px;

                &.on{
                  background:var(--orange);
                  color:#fff;  

                }


                &:not(.on):first-of-type{
                    border-left:1px solid var(--gray);
                }

                &:not(.on):last-of-type{
                    border-right:1px solid var(--gray);
                }

                
            }
        }
    }


    @media only screen and (max-width:1024px){
        
    }

    @media only screen and (max-width:768px){
        .page{
            padding:40px 0px;
            h1{
                font-size: var(--font-body-middle)
            }
            p{
                font-size: var(--font-body-tiny);
                line-height: 17px;
                margin-top:16.6px;
            }
        }

        .tab{
            .contianer{
                a{
                    font-size:16px;
                    line-height: 24px;
                    padding:23px;
                }
            }
        }
    }

</style>