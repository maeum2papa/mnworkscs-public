<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import AsHeader from "../../components/AsHeader.svelte";
    import DaumPostcode from "../../components/DaumPostcode.svelte";
    import { Loading, cAlert } from "../../stores/store";
    import { postApi } from "../../services/api";
    import { asStatus, category, emailDomains } from "../../services/constants";

    const type = "receipt";
    const storeFl = ["온라인", "오프라인"];

    let brands = [];
    let models = [];
    let daumPostFlag = false;

    let inputs = {
        brand: {},
        model: {},
        buyDate: {},
        symptomFl: {},
        symptomDetail: {},
        storeFl: {},
        storeDetail: {},
        name: {},
        mobile: {},
        pass: {},
        email: {},
        address: {},
        personal: {}
    };
    let formData = {
        brand: "",
        model: "",
        buyDate: "",
        symptomFl: "",
        symptomDetail: "",
        storeFl: storeFl[0],
        storeDetail: "",
        name: "",
        mobile: "",
        email: {
            id: "",
            domain: "",
        },
        zipcode: "",
        address: "",
        addressSub: "",
        pass: "",
        personal: false,
        status: asStatus[0],
    };

    const handleMobileBlur = () => {
        if (formData.mobile && !formData.mobile.includes("-")) {
            let mobile1 = formData.mobile.substring(0, 3);
            let mobile2 = formData.mobile.substring(3, 7);
            let mobile3 = formData.mobile.substring(7, 11);

            formData.mobile = mobile1 + "-" + mobile2 + "-" + mobile3;
        }
    };

    const handleEmailDomain = (e) => {
        formData.email.domain = e.target.value;
    };

    const handlestoreFl = (e) => {
        formData.storeFl = e.target.value;
    };

    const handleSubmit = async () => {
        if (!formData.mobile.includes("-")) {
            let mobile1 = formData.mobile.substring(0, 3);
            let mobile2 = formData.mobile.substring(3, 7);
            let mobile3 = formData.mobile.substring(7, 11);

            formData.mobile = mobile1 + "-" + mobile2 + "-" + mobile3;
        }

        //유효성 검사
        if (formData.brand == "") {
            $cAlert = {
                flag: true,
                msg: "브랜드명을 입력해 주세요.",
                feedback: () => {
                    inputs.brand.focus();
                },
            };
            return false;
        }

        if (formData.model == "") {
            $cAlert = {
                flag: true,
                msg: "모델명을 입력해 주세요.",
                feedback: () => {
                    inputs.model.focus();
                },
            };
            return false;
        }

        if (formData.buyDate == "") {
            $cAlert = {
                flag: true,
                msg: "구매 날짜를 입력해 주세요.",
                feedback: () => {
                    inputs.buyDate.focus();
                },
            };
            return false;
        }

        if (formData.symptomFl == "") {
            $cAlert = {
                flag: true,
                msg: "제품증상을 입력해 주세요.",
                feedback: () => {
                    inputs.symptomFl.focus();
                },
            };
            return false;
        }

        if (formData.symptomDetail == "") {
            $cAlert = {
                flag: true,
                msg: "제품증상을 입력해 주세요.",
                feedback: () => {
                    inputs.symptomDetail.focus();
                },
            };
            return false;
        }

        if (formData.storeDetail == "") {
            $cAlert = {
                flag: true,
                msg: "구매처명을 입력해 주세요.",
                feedback: () => {
                    inputs.storeDetail.focus();
                },
            };
            return false;
        }

        if (formData.storeFl == "") {
            $cAlert = {
                flag: true,
                msg: "구매처명을 입력해 주세요.",
                feedback: () => {
                    inputs.storeFl.focus();
                },
            };
            return false;
        }

        if (formData.name == "") {
            $cAlert = {
                flag: true,
                msg: "고객명을 입력해 주세요.",
                feedback: () => {
                    inputs.name.focus();
                },
            };
            return false;
        }

        if (formData.mobile == "") {
            $cAlert = {
                flag: true,
                msg: "핸드폰 번호를 입력해 주세요.",
                feedback: () => {
                    inputs.mobile.focus();
                },
            };
            return false;
        }

        if (formData.email.id == "" || formData.email.domain == "") {
            $cAlert = {
                flag: true,
                msg: "이메일 주소를 입력해 주세요.",
                feedback: () => {
                    inputs.email.focus();
                },
            };
            return false;
        }

        if (formData.address == "") {
            $cAlert = {
                flag: true,
                msg: "주소를 입력해 주세요.",
                feedback: () => {
                    inputs.address.focus();
                },
            };
            return false;
        }

        if (formData.pass == "") {
            $cAlert = {
                flag: true,
                msg: "비밀번호를 입력해 주세요.",
                feedback: () => {
                    inputs.pass.focus();
                },
            };
            return false;
        }

        if(!formData.personal){
            $cAlert = {flag:true,msg:'개인정보 활용 동의해 주세요.',feedback:()=>{inputs.personal.focus()}};
            return false;
        }

        $Loading = { flag: true };
        
        const res = await postApi({
            path: "/api/as",
            data: formData,
        });

        if (res.msg == "ok") {
            $cAlert = {
                flag: true,
                msg: "접수가 완료 되었습니다.",
                feedback: () => {
                    // location.reload();
                    location.href='/as/inquiry';
                },
            };
        }
        $Loading = { flag: false };
    };

    const handleComplete = ({ detail: { data } }) => {
        formData.zipcode = data.zonecode;
        formData.address = data.address;
        daumPostFlag = false;
    };

    const handleGetModel = async (e) => {
        formData.brand = e.target.value;
        const res = await postApi({
            path: "/api/model",
            data: { brand: formData.brand },
        });
        models = res.data;
    };

    onMount(async () => {
        const res = await postApi({
            path: "/api/brand",
        });
        brands = res.data;
    });
</script>

<AsHeader {type} />
{#if daumPostFlag}
    <DaumPostcode {handleComplete} bind:daumPostFlag />
{/if}
<div class="wrap">
    <!-- <div class="product-box">
        <div>
            <div>헤드셋</div>
            <div>Arctis Nova Pro</div>
        </div>
        <div>변경</div>
    </div> -->
    <section class="product-area">
        <div>
            <p class="must">필수 입력 항목</p>
            <h2>
                1. 제품 정보를 입력해주세요
            </h2>
        </div>
        <div class="form">
            <div class="product-name">
                <label for="" class="require">구매브랜드</label>
                <div class="name-select">
                    <div class="select">
                        <select
                            bind:value={formData.brand}
                            bind:this={inputs.brand}
                            on:change={handleGetModel}
                        >
                            <option value="">선택하세요</option>
                            {#each brands as item}
                                <option value={item}>{item}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
            <div>
                <label for="" class="require">구매모델</label>
                <div class="select">
                    <select
                        bind:value={formData.model}
                        bind:this={inputs.model}
                    >
                        <option value="">선택하세요</option>
                        {#each models as item}
                            <option value={item}>{item}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="buy-date">
                <label for="" class="require">구매날짜</label>
                <div>
                    <input
                        type="date"
                        bind:value={formData.buyDate}
                        bind:this={inputs.buyDate}
                    />
                </div>
            </div>
            <div class="symptom">
                <label for="" class="require">제품 증상</label>
                <div class="select">
                    <select name="" id="" bind:value={formData.symptomFl} bind:this={inputs.symptomFl}>
                        <option value="">제품 증상 선택</option>
                        {#each category as item, index}
                            <option value={index + 1}>{item}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="symptom-detail">
                <label for="" class="require">증상 상세</label>
                <div class="select">
                    <input
                        type="text"
                        bind:value={formData.symptomDetail}
                        bind:this={inputs.symptomDetail}
                        placeholder="증상 상세 입력"
                    />
                </div>
            </div>
            <div>
                <label for="" class="require">구매처</label>
                <div class="select">
                    <select name="" id="" on:change={handlestoreFl} bind:this={inputs.storeFl}>
                        {#each storeFl as item}
                            <option>{item}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="store-detail">
                <label for="" class="require">구매처명</label>
                <div>
                    <input
                        type="text"
                        bind:value={formData.storeDetail}
                        bind:this={inputs.storeDetail}
                        placeholder="구매처명 입력"
                    />
                </div>
            </div>
        </div>
    </section>
    <section class="customer-area">
        <div>
            <h2>
                2.접수자 정보를 입력해주세요
            </h2>
        </div>
        <div class="form">
            <div class="name">
                <label for="" class="require">접수자명</label>
                <div>
                    <input
                        type="text"
                        placeholder="접수자명 입력"
                        bind:value={formData.name}
                        bind:this={inputs.name}
                    />
                </div>
            </div>
            <div class="mobile">
                <label for="" class="require">핸드폰</label>
                <div>
                    <input
                        type="text"
                        placeholder="010-0000-0000"
                        maxlength="13"
                        bind:value={formData.mobile}
                        bind:this={inputs.mobile}
                        on:blur={handleMobileBlur}
                    />
                </div>
            </div>
            <div class="email">
                <label for="" class="require">이메일</label>
                <div>
                    <div>
                        <input
                            type="text"
                            bind:value={formData.email.id}
                            bind:this={inputs.email}
                        />@<input
                            type="text"
                            bind:value={formData.email.domain}
                        />
                    </div>
                    <div class="select">
                        <select name="" id="" on:change={handleEmailDomain}>
                            <option value="">직접입력</option>
                            {#each emailDomains as item}
                                <option value={item}>{item}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
            <div class="address">
                <label for="" class="require">주소</label>
                <div>
                    <div>
                        <input
                            type="text"
                            bind:value={formData.zipcode}
                            bind:this={inputs.zipcode}
                            on:click={() => (daumPostFlag = true)}
                            placeholder="우편번호"
                            disabled
                        />
                        <button on:click={() => (daumPostFlag = true)}
                            >주소 찾기</button
                        >
                    </div>
                    <div>
                        <input
                            type="text"
                            bind:value={formData.address}
                            bind:this={inputs.address}
                            placeholder="도로명 및 지명 주소"
                            readonly
                        />
                        <input
                            type="text"
                            bind:value={formData.addressSub}
                            placeholder="상세 주소"
                        />
                    </div>
                </div>
            </div>
            <div class="password">
                <label for="" class="require">비밀번호</label>
                <div>
                    <input
                        type="password"
                        bind:value={formData.pass}
                        bind:this={inputs.pass}
                        placeholder="비밀번호 입력"
                    />
                </div>
            </div>
        </div>
    </section>
    <section class="clause-area">
        <div>
            <h2>3. 약관 동의</h2>
        </div>
        <div class="form">
            <div>
                <h3 class="require">개인정보 수집 및 이용에 대한 동의</h3>
                <div class="clause-content">
                    <div>위와 같이 개인정보를 수집하는데 동의하십니까?</div>
                    <div>
                        <input type="checkbox" bind:this={inputs.personal} bind:value={formData.personal}/>
                        <p>동의합니다.</p>
                    </div>
                </div>
                <div class="note">
                    <strong>유의사항</strong>
                    <p>
                        제품의 분실 및 고객의 과실이나 부주의로 인한 제품의 파손
                        및 손상은 A/S가 제한될 수 있으며, 보증기간은 과거 A/S
                        이력과 관계 없이 최초 구매일로부터 적용됩니다. 화면을
                        캡처하여 첨부하시는 경우, 구매일자와 모델번호가 한
                        화면에 표시되도록 해 주시기 바랍니다. 접수 후 발송해
                        드리는 이메일을 꼭 확인해 주십시오. 제품에 따라 A/S 진행
                        과정이 상이하므로, 접수 후 발송해 드리는 안내 메일
                        내용에 따라 제품을 발송 또는 인증해 주시기 바랍니다.
                        자세한 방법은 접수 후 수신하는 이메일의 내용을 참조해
                        주시기 바랍니다.
                    </p>
                </div>
            </div>
            <div class="button-area">
                <button type="button" on:click={handleSubmit}>저장</button>
            </div>
        </div>
    </section>
</div>

<style lang="scss">
    .wrap {
        max-width: 888px;
        margin: 80px auto 0;
        .must {
            font-size: var(--font-body-small);
        }

        h2 {
            margin-top: 20px;
            padding-bottom: 20px;
            font-size: var(--font-head-big);
            border-bottom: 3px solid #000000;
            color: #000000;
        }
    }

    .product-box {
        padding: 40px;
        border-radius: 10px;
        background-color: var(--bg-gray);
        border: 1px solid var(--border-gray);
        display: flex;
        justify-content: space-between;
        font-size: var(--font-body-small);
        > div:first-child {
            display: flex;
            > div:first-child {
                margin-right: 24px;
                position: relative;
                &::after {
                    content: "";
                    display: block;
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-right: 1px solid #000000;
                    border-top: 1px solid #000000;
                    right: -12px;
                    top: calc(50% - 2px);
                    transform: rotate(45deg);
                }
            }
        }
    }

    .form {
        padding: 40px 0;
        > div {
            display: flex;
            margin-bottom: 20px;
            label {
                width: 20%;
                line-height: 2em;
                font-size: var(--font-body-normal);
                font-weight: 700;
            }
            div {
                // flex: 8;
                display: flex;
                gap: 10px;
            }
        }
    }

    .require{
        &::after{
            content: '*';
            color:var(--orange);
            margin-left:5px;
        }
    }

    .product-area {
        .buy-date {
            > div {
                max-width: 262px;
                >input {
                    width: 262px;
                }
            }
        }
        .store-detail {
            input {
                width: 262px;
            }
        }
    }

    .customer-area {
        .name, .password, .mobile {
            input {
                width: 262px;
            }
        }
        .mobile {
            > div {
                max-width: 262px;
                align-items: center;
            }
        }
        .email {
            > div {
                flex-direction: column;
                max-width: 262px;
                > div {
                    align-items: center;
                }
            }
        }
        .address {
            > div {
                flex-direction: column;
                max-width: 443px;
                > input:disabled {
                    background-color: var(--bg-gray);
                    border: 1px solid var(--border-gray);
                }
            }
            button {
                min-width: 86px;
            }
        }
    }

    .clause-area {
        .form {
            div {
                flex-direction: column;
            }
            .clause-content {
                border: 1px solid var(--border-gray);
                border-radius: 12px;
                margin-top: 10px;
                > div {
                    padding: 20px;
                    &:first-child {
                        height: 100px;
                        overflow: scroll;
                    }
                    &:last-child {
                        border-top: 1px solid var(--border-gray);
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        input[type="checkbox"] {
                            width: 12px;
                            height: 12px;
                            display: inline-block;
                            border: 1px solid var(--border-gray);
                            opacity: 1;
                        }
                    }
                }
            }
            .note {
                height: auto;
                margin-top: 10px;
                justify-content: center;
                background-color: var(--bg-gray);
                border-radius: 10px;
                padding: 20px;
                p {
                    font-size: var(--font-body-small);
                    line-height: 1.5em;
                }
            }
            .button-area {
                align-items: center;
            }
        }
    }

    section {
        margin-top: 66px;
    }

    input {
        width: 100%;
        height: 38px;
    }

    @media only screen and (max-width: 1024px) {
    }

    @media only screen and (max-width: 768px) {
        .wrap {
            margin-top: 36px;
            h2 {
                font-size: var(--font-head-normal);
            }
        }

        .product-area {
            .buy-date {
                > div {
                    max-width: 100%;
                    >input {
                        width: 100%;
                    }
                }
            }
            .store-detail {
                input {
                    width: 100%;
                }
            }
        }

        .customer-area {
            .name, .password, .mobile {
                > div {
                    max-width: 100%;
                }
                input {
                    width: 100%;
                }
            }
            .mobile {
                > div {
                    max-width: 100%;
                }
            }
            .email {
                > div {
                    max-width: 100%;
                }
            }
            .address {
                > div {
                    max-width: 100%;
                }
                
            }
        }
        .product-box {
            padding: 20px;
            font-size: var(--font-body-tiny);
        }
        .form {
            > div {
                flex-direction: column;
                label {
                    white-space: nowrap;
                }
            }
        }
    }
</style>
