<script>
    import GenuineHeader from "../../components/GenuineHeader.svelte";
    import { cAlert } from "../../stores/store";
    import { onMount } from "svelte";
    import { postApi } from "../../services/api";

    const type = 'inquiry';

    let resultFlag = false;

    let serial = '';

    let inputSerial = {};

    let msg = "위 시리얼 번호는 정품이 아닙니다.";

    let buttonName = "정품등록 조회하기";

    const handleInquiry = async()=>{

        if(serial==''){
            $cAlert = {flag:true,msg:'시리얼번호를 입력해 주세요.',feedback:()=>{}};
            return false;
        }

        if(!resultFlag){
            resultFlag = true;
            buttonName = "정품등록 재조회하기";

            const res = await postApi({
                path:"/api/inquiry",
                data:{serial:serial}
            });
            if(res.msg=='ok'){
                msg = "위 시리얼 번호는 정품 입니다.";
            }else{
                msg = "";
            }

        }else{
            resultFlag = false;
            buttonName = "정품등록 조회하기";
            serial = '';
        }
    }

    onMount(()=>{
        inputSerial.focus();
    });

</script>

<GenuineHeader {type}></GenuineHeader>

<div class='wrap'>
    <section>
        <h2><span>정품등록 조회</span></h2>

        {#if !resultFlag}
        <div class="search">
            <input type="text" placeholder="시리얼번호" bind:value={serial} bind:this={inputSerial}>
        </div>
        {/if}

        {#if resultFlag}
        <div class="result">
            <b>{serial}</b>
            <p>{#if msg==""}위 시리얼 번호는 정품이 아닙니다.<br>070-4125-0677로 전화 부탁드립니다.{:else}{msg}{/if}</p>
        </div>
        {/if}
    </section>

    <div class="button-area">
        <button type='button' on:click={handleInquiry}>{buttonName}</button>
    </div>
</div>

<style lang="scss">

    .wrap{
        margin-top:111px;
    }
    
    section{
        h2 {
            margin-top: 20px;
            padding-bottom: 20px;
            font-size: var(--font-head-big);
            border-bottom: 3px solid #000000;
        }

        

        .search,.result{
            text-align: center;
            margin-top:40px;
            b{
                font-size:var(--font-size-big);
            }

            p{
                font-size:var(--font-size-middle);
                margin-top:44px;
                line-height:34px;
            }
        }

    }

    .button-area{
        margin-top:40px;
        text-align: center;
        button {
            padding: 10px 16px;
        }
    }


    @media only screen and (max-width:1024px){
        
    }

    @media only screen and (max-width:768px){
        .wrap{
            margin-top:36px;
        }

        section{
            h2{
                span{
                    font-size:14px;
                    padding-right: 8px;
                }
                &::after{
                    top:7px;
                }
            }
            .search,.result{
                margin-top:40px;
                b{
                    font-size:14px;
                }
                input {
                    width: 100%;
                }

                p{
                    font-size:14px;
                    margin-top:22px;
                }
            }

        }

        .button-area{
            margin-top:40px;
            button{
                // font-size:16px;
                // height:71px;
                border-radius: 35px;
            }
        }
    }

</style>