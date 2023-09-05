<script>
    export let type;

    let classOn = {
        receipt:'',
        result:''
    }

    classOn[type] = 'on';
    
</script>

<div class="tab">
    <div class="contianer">
        <a href="/as" class={classOn.receipt}>온라인 AS 접수</a>
        <a href="/as/inquiry" class={classOn.result}>접수내역 확인</a>
    </div>
</div>

<style lang="scss">
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