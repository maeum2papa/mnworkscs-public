<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { postApi } from "../../../services/api";
    import { goto } from "$app/navigation";

    const id = $page.params.id
    let notice = {}

    onMount(async()=>{
        const res = await postApi({
            path: `/api/notice/${id}`,
            data: { id }
        })
        notice = res.data
    })

</script>

<div class="notice-header">
    <h1>공지사항</h1>
</div>

<div class="wrap">

    <section class="title-area">
        <div>
            <h2>{notice.subject}</h2>
            <div class="title-sub">
                <div>{notice.writer}</div>
                <div>{notice.regDate}</div>
            </div>
        </div>
    </section>

    <section class="content-area">
        <div>
            {@html notice.contents}
        </div>
    </section>
    <div class="button-area">
        <button on:click={()=> goto('/notice')}>목록</button>
    </div>
</div>

<style lang="scss">
    .notice-header{
        background: black;
        text-align: center;
        padding: 50px 0px;
        h1{
            color: white;
            font-size: var(--font-head-middle);
            font-weight: 700;
        }
        p{
            color:white;
            white-space:pre-line;
            line-height: 37px;
            margin-top:37px;
        }
    }

    .wrap{
        margin-top:111px;
    }
    
    .title-area {
        &>div {
            border-top: 1px solid var(--gray);
            border-bottom: 1px solid var(--gray);
            padding: 20px;
            h2 {
                font-size: 28px;
                margin-bottom: 20px;
            }
            .title-sub {
                display: flex;
                justify-content: space-between;
            }
        }
    }
    .content-area {
        &>div {
            padding: 20px;
        }
        border-bottom: 1px solid var(--border-gray);
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
        .notice-header{
            padding:40px 0px;
            h1{
                font-size: var(--font-body-middle)
            }
        }

        .title-area {
            &>div {
                h2 {
                 font-size: var(--font-body-middle);
                }
            }
        }
    }

</style>