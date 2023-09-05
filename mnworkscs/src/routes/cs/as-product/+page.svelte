<script>
    import CsHeader from "../../../components/CsHeader.svelte";

    const type = 'product'
</script>
<CsHeader {type}/>
<div class="cs">
    <h2>온라인 AS 접수 가능 제품 안내</h2>
    <div class="model">
        <ul>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_mouse.png" alt=""></div>
                    <p>마우스</p>
                </div>
            </li>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_keyboard.png" alt=""></div>
                    <p>키보드</p>
                </div>
            </li>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_etc.png" alt=""></div>
                    <p>기타</p>
                </div>
            </li>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_headset.png" alt=""></div>
                    <p>헤드셋</p>
                </div>
            </li>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_mousepad.png" alt=""></div>
                    <p>마우스패드</p>
                </div>
            </li>
        </ul>
    </div>
    <p>
        엠앤웍스 고객지원센터에서는 위와 같은 제품군에 대한 온라인 A/S 접수를 진행하고 있습니다.<br/>
        구매하신 제품의 제품군 및 관련정보를 확인할 수 없는 경우에는 <strong>엠앤웍스 고객센터(070-4125-0677)</strong>로 문의하여 주시기 바랍니다.
    </p>
</div>

<style lang="scss">
    .cs {
        text-align: center;
        padding: 40px 20px;
        h2 {
            font-size: var(--font-head-middle);
        }
        p {
            font-size: var(--font-body-middle);
            line-height: 1.25em;
        }
    }

    .model {
        margin: 40px 0;
        ul {
            display: flex;
            justify-content: center;
            li {
                width: 120px;
                height: 120px;
                margin: 0 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20px;
                box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.18);
                >div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    >div {
                        height: 40px;
                        margin-bottom: 10px;
                    }
                    >p {
                        font-size: var(--font-body-small);
                    }
                    .img-wrap {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
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

        .model {
            margin: 40px 0;
            ul {
                flex-wrap: wrap;
                gap: 10px;
                li {
                    margin: 0;
                    width: 86px;
                    height: 86px;
                    border-radius: 15px;
                }
            }
        }
    }
</style>