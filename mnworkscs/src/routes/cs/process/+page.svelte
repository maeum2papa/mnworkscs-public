<script>
    import CsHeader from "../../../components/CsHeader.svelte";

    const type = 'process'
</script>

<CsHeader {type}/>
<div class="cs">
    <h2>온라인 AS 진행절차 안내</h2>
    <div>
        <ul>
            <li>
                <img src="/images/icon_online_as_seq_01.png" alt="">
                <div class="step-num">01</div>
                <p>A/S 가능여부<br/>확인하기<br/><span class="caption">*보증기간 및 구매처</span></p>
            </li>
            <li>
                <img src="/images/icon_online_as_seq_02.png" alt="">
                <div class="step-num">02</div>
                <p>온라인 A/S <br/>신청하기</p>
            </li>
            <li>
                <img src="/images/icon_online_as_seq_03.png" alt="">
                <div class="step-num">03</div>
                <p>A/S 접수증<br/>발송받기</p>
            </li>
            <li>
                <img src="/images/icon_online_as_seq_04.png" alt="">
                <div class="step-num">04</div>
                <p>A/S 접수 제품<br/>인증하기</p>
            </li>
            <li>
                <img src="/images/icon_online_as_seq_05.png" alt="">
                <div class="step-num">05</div>
                <p>새제품 교환 및<br/>수리받기</p>
            </li>
        </ul>
    </div>
    <p>
        오프라인 매장 또는 온라인 쇼핑몰에서 구매하신 엠앤웍스 제품의 온라인 A/S는 다음과 같은 절차를 통해 지원받으실 수 있습니다.<br/>
        위 절차를 참고하시어, 구매하신 제품의 온라인 A/S 접수를 진행해 주시기 바랍니다.
    </p>
</div>

<style lang="scss">
    .cs {
        text-align: center;
        padding: 40px 20px;
        h2 {
            font-size: var(--font-head-middle);
        }
        ul {
            display: flex;
            margin: 40px 0;
            justify-content: center;
            flex-wrap: wrap;
            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 0 20px;
                >p {
                    font-size: var(--font-head-small);
                    font-weight:600;
                    line-height: 1.25em;
                }
            }
            .step-num {
                color: #ffffff;
                width: 35px;
                height: 35px;
                background-color: var(--orange);
                border-radius: 10px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-body-middle);
                font-weight: 700;
                margin: 20px 0 10px ;
                // &::after {
                //     content: '';
                //     display: block;
                //     width: 115px;
                //     height: 3px;
                //     background-color: var(--orange);
                //     position: absolute;
                //     top: 50%;
                //     right: -138px;
                // }
            }
        }
        p {
            font-size: var(--font-body-middle);
            line-height: 1.25em;
        }
    }
    @media only screen and (max-width:768px){
        img {
            width: 80px;
            height: calc(80px / 155 * 135);
        }

        .cs {
            h2 {
                font-size: var(--font-head-normal);
            }
            ul {
                li {
                    width: 48%;
                    margin: 0;
                    margin-bottom: 40px;
                    >p {
                        font-size: var(--font-body-normal);
                    }
                }
                .step-num {
                    width: 20px;
                    height: 20px;
                    font-size: var(--font-body-tiny);
                    border-radius: 5px;
                }
            }
            p {
                font-size: var(--font-body-normal);
                line-height: 1.25em;
            }
        }
    }
</style>