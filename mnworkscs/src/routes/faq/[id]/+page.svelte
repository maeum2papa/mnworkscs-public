<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { postApi } from "../../../services/api";
    import { onMount } from "svelte";
    import { cAlert } from "../../../stores/store";
    import { category } from "../../../services/constants";

    const id = $page.params.id
    let faq = {}
    let url =  $page.url.href
    let copyFlag = false;
    let relationFaq = []
    
    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
    }

    const handleHitsAdd = async (idx) => {
        const res = await postApi({
            path: `/api/faq`,
            data: {id: idx}
        })
    }

    onMount(async()=>{
        const res = await postApi({
            path: `/api/faq/${id}`,
            data: { id }
        })
        if(res.msg == 'ok') {
            faq = res.data
            const relationRes = await postApi({
                path: '/api/faq',
                data: { 
                    category: Number(faq.cate),
                    limit: 3,
                    page: 1
                }
            })
            relationFaq = relationRes.data
        }
    })

</script>

{#if faq}
<div class="wrap">
    <section class="faq-area">
        <div class="faq-title">
            <div>
                <h2>{faq.subject}</h2>
                <button class="share-btn" on:click={()=>{copyFlag = true}}><img src="/images/icon_share.png" alt=""></button>
            </div>
            {#if copyFlag}
                <div class="share-area">
                    <p>공유하기</p>
                    <div>
                        <input type="text" bind:value={url} readonly>
                        <button on:click={handleCopy}>URL 복사</button>
                    </div>
                </div>
                <div class="share-background" on:click={()=>{copyFlag = false}}></div>
            {/if}            
        </div>
        <div class="faq-content">
            <div>
                {@html faq.contents}
            </div>
            <div class="help-box">
                <h3>
                    도움이 더 필요한가요?
                </h3>
                <p>
                    엠앤웍스 홈페이지의 <strong>[ 온라인 AS 접수 ]</strong> 메뉴를 이용해보세요.<br/>
                    이메일 문의 / 전화상담을 통해서도 전문 서비스매니저의 정확한 진단과 점검을 받을 수 있어요.
                </p>
            </div>
            <!-- <div class="solve-box">
                <h3>
                    궁금한 점이 해결 되셨나요?
                </h3>
                <div>
                    <button>네</button>
                    <button>아니오</button>
                </div>
            </div> -->
        </div>
    
    </section>
    {#if relationFaq.length > 1}
    <section class="relation-area">
        <div>
            <h3>관련된 간편 해결 정보를 확인 하세요</h3>
        </div>
        <div>
            <table>
                <tbody>
                    {#each relationFaq as item}
                        {#if item.idx !== faq.idx}
                            <tr>
                                <td class="model">{category[Number(item.cate - 1)]}</td>
                                <td class="subject"><a href={`/faq/${item.idx}`} on:click={()=>handleHitsAdd(item.idx)}>{item.subject}</a></td>
                                <td class="date">{item.regDate}</td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    </section>
    {/if}
    <section class="nearlist-area">
        <!-- <table>
            <tbody>
                <tr>
                    <td class="prev">이전 글</td>
                    <td>[ 설치/해제 ] 헤드셋 설치는 어떻게 하나요?</td>
                </tr>
                <tr>
                    <td class="next">다음 글</td>
                    <td>[ 에러코드/표시창 ] 에러코드 4가 나와요</td>
                </tr>
            </tbody>
        </table> -->
        <div class="button-area">
            <button on:click={()=> goto('/faq')}>목록</button>
        </div>
    </section>
</div>
{/if}

<style lang="scss">
    .wrap{
        margin-top:40px;
    }
    
    .faq-title {
        position: relative;
        &>div {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #000000;
            padding: 20px 0;
            h2 {
                font-size: var(--font-head-middle)
            }
            >div {
                width: 22px;
                height: 22px;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
        }
        .share-btn {
            background: none;
            min-width: 0;
        }
        >.share-area {
            position: absolute;
            right: 0;
            bottom: -80px;
            width: 200px;
            height: 80px;
            background-color: #ffffff;
            z-index: 1000;
            text-align: center;
            display: flex;
            flex-direction: column;
            box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.05);;
            padding: 20px;
            p {
                font-weight: 700;
            }
            >div {
                display: flex;
                width: 100%;
                height: auto;
                justify-content: center;
                gap: 5px;
                input {
                    width: 100%;
                    height: 37px;
                }
            }
        }
        .share-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
        }
    }
    .faq-content { 
        line-height: 1.5em;
        >div:first-child {
            padding: 20px;
        }
    }
    .help-box {
        padding: 20px 30px;
        background-color: var(--bg-gray);
        border-radius: 10px;
        h3 {
            font-size: var(--font-head-small);
            padding-bottom: 10px;
            border-bottom: 2px solid #000000;
        }
        p {
            margin-top: 16px;
            font-size: var(--font-body-small);
            line-height: 1.25em;
        }
    }

    .solve-box {
        padding: 30px;
        background-color: var(--bg-gray);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-top: 30px;
        >h3 {
            position: relative;
            margin-left: 40px;
            &::before {
                position: absolute;
                display: block;
                width: 40px;
                height: 40px;
                content: "";
                background: url('/images/icon_checklist.png') no-repeat;
                background-size: contain;
                top: calc(-50% - 5px);
                left: -50px;
            }
        }
        button {
            height: 30px;
            min-width: 68px;
        }
    }

    .relation-area {
        margin-top: 80px;
        h3 {
            font-size: var(--font-head-normal);
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            tr {
                &:first-child {
                    border-top: 2px solid #000000;
                    
                }
                border-bottom: 1px solid var(--border-gray);
                td { padding: 20px; }
            }
            
        }
    }

    .nearlist-area {
        margin-top: 80px;
        table {
            width: 100%;
        }
        tr {
            border-top: 1px solid var(--border-gray);
            &:last-child {
                border-bottom: 1px solid var(--border-gray);
            }
            td { padding: 20px; }
        }
    }

    .model, .date, .prev, .next {
        font-size: var(--font-body-small);
        color: var(--gray700);
    }

    .button-area {
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    @media only screen and (max-width:1024px){
        
    }

    @media only screen and (max-width:768px){
        .wrap{
            margin-top:36px;
        }

    }

</style>