<script>

</script>

<footer>
    <div class="wrap">
        <div>
            <div><img src="/images/logo_white.png" alt="주식회사 엠앤웍스"></div>
            <p>주식회사 (주) 엠앤웍스 
                서울특별시 서초구 남부순환로 315길 21 (엠앤케이빌딩) 4층
                사업자 등록번호: 107-86-90466
                통신판매업신고번호: 제 2011-서울서초-2167호</p>
        </div>
        <div>
            <div>(주)엠앤웍스 공식 서비스센터</div>
            <div class="tel"><a href="tel:070-4125-0677">070-4125-0677</a></div>
            <div><a href="email:cs@mnworks.co.kr">cs@mnworks.co.kr</a></div>
        </div>
    </div>
</footer>

<style lang="scss">
    footer{
        background: black;
        padding-top:68px;
        padding-bottom:109px;
        margin-top:176px;

        & > .wrap{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            & > div:last-of-type{
                text-align: right;
                div{
                    line-height: 37px;
                }
            }
        }

        *{
            color:#fff;
            font-size: var(--font-size-middle);
            
        }

        p{
            white-space: pre-line;
            line-height: 37px;
            margin-top:13px;
        }
        .tel a{
            font-size:54px;
            font-weight: bold;
            line-height: 57px;
        }
    }

    @media only screen and (max-width:1024px){
        
    }

    @media only screen and (max-width:768px){
        footer{
            padding-top:46px;
            padding-bottom:46px;
            margin-top:80px;

            & > .wrap{
                display: block;
                & > div:last-of-type{
                    margin-top:50px;
                    div{
                        line-height: 20px;
                    }
                }
            }

            img{
                width:192px;
            }

            *{
                text-align: center;
            }

            p{
                line-height: 20px;
                margin-top:11px;
            }
            .tel a{
                font-size:31px;
                font-weight: bold;
                line-height: 50px;
            }
        }
    }
</style>