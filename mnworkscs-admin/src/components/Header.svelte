<script>
    import { onMount } from "svelte";
    import { getApi } from "../services/api";

    const handleLogout = async()=>{
        await getApi({
            path:'/api/logout'
        });
        
        location.replace("/");
    }

    let nav = [
        {
            path:'/dashboard',
            class:''
        },
        {
            path:'/model',
            class:''
        },
        {
            path:'/as',
            class:''
        },
        {
            path:'/faq',
            class:''
        },
        {
            path:'/notice',
            class:''
        },
        {
            path:'/banner',
            class:''
        },
        {
            path:'/popup',
            class:''
        },
        {
            path:'/ship',
            class:''
        }
    ]

    onMount(async()=>{
        for(let i in nav){
            if(nav[i].path==location.pathname){
                nav[i].class="on";
            }
        }
    });

</script>

<header class="wrap">
    <div><h1>MNworks 정품 관리 시스템</h1></div>
    <div><button type="button" on:click={handleLogout}>로그아웃</button></div>
</header>

<nav class="wrap">
    <a href="/dashboard" class={nav[0].class} >정품관리</a>
    <a href="/model" class={nav[1].class}>브랜드&모델관리</a>

    <a href="/as" class={nav[2].class}>AS관리</a>
    <a href="/faq" class={nav[3].class}>자주하는질문관리</a>
    <a href="/notice" class={nav[4].class}>공지사항관리</a>
    <a href="/banner" class={nav[5].class}>배너관리</a>
    <a href="/popup" class={nav[6].class}>팝업관리</a>
    <a href="/ship" class={nav[7].class}>택배사관리</a>
</nav>

<div class="blank"></div>

<style lang="scss">
    header{
        display: flex;
        justify-content: space-between;
    }

    nav{
        border-bottom:2px solid black;
        border-left:1px solid black;
        display: flex;
        a{
            padding:10px 15px;
            font-size:16px;
            display: inline-block;
            border:1px solid black;
            border-left:0;

            &:hover{
                font-weight: 500;
            }

            &.on{
                color:#fff;
                background: black;
            }
        }
    }

    .blank{
        height:1px;
    }
</style>