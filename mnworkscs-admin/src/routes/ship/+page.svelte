<script>
    import Header from "../../components/Header.svelte";
    import { onMount } from "svelte";
    import { auth } from "../../services/auth";
    import { postApi,getApi } from "../../services/api";
    import { cAlert,Loading } from "../../stores/store";
    import { intros, text } from "svelte/internal";

    // let ships = [
    //     {
    //         name : '우체국택배'
    //     },
    //     {
    //         name : '편의점택배'
    //     }
    // ];
    let ships = [];
    let addFlag = false;
    let addInput = {}
    let addShip = '';

    const handleShipAdd = () =>{
        addFlag = true;
        setTimeout(()=>{
            addInput.focus();
        },100)
    }

    const removeShip = (e) =>{
        if(confirm("삭제후에는 복원되지 않습니다.")){
            let i = e.target.getAttribute('i');
            ships.splice(i,1);
            ships = ships;
            updateList();
        }
    }

    const handleMask = () => {
        addFlag = false;
    }

    const handleSave = async() => {
        addFlag = false;

        if(addShip!=''){
            ships.push({name:addShip});
            ships = ships;
            updateList();
        }
        
    }

    const updateList = async()=>{

        const res = await postApi({
            path:'/api/ship',
            data : ships
        });

        if(res.msg!='ok'){
            getList();
        }
    }

    const getList = async() =>{

        const res = await postApi({
            path:'/api/ship/get'
        });

        if(res.msg=='ok'){
            ships = res.data;
        }

    }
    
    onMount(async()=>{
        const resAuth = await auth();

        if(resAuth!='ok'){
            location.replace("/login");
            return false;
        }

        getList();
    });
</script>

<Header/>

<div class="wrap">

    <div class="description">
        <p>- AS 신청 후 고객이 송장번호 입력할때, 관리자가 AS 출고택배사 송장번호 입력할때와 연동 됩니다.
        </p>
    </div>

    <div class="button-area">
        <button type="button" on:click={handleShipAdd}>택배사 추가</button>
    </div>
    
    <div class="container">

        
        <section>
            <b><span>택배사</span></b>
            <ul>
                {#each ships as item,i}
                    <li><span>{item.name}</span><i on:click={removeShip} {i}>X</i></li>    
                {/each}
            </ul>
        </section> 
        
    </div>
</div>

{#if addFlag}
    <div id="box">
        <h2>택배사 추가</h2>
        <input type="text" bind:value={addShip} bind:this={addInput}>
        <div class="button-area">
            <button type="button" on:click={handleMask}>닫기</button>
            <button type="button" on:click={handleSave}>저장</button>
        </div>
    </div>
    <div class="mask" on:click={handleMask}></div>
{/if}

<style lang="scss">

    #box{
        position: absolute;
        top:50%;
        left:50%;
        background: #fff;
        transform: translate(-50%,-50%);
        padding:20px;
        width:270px;
        z-index: 1100;
        text-align: center;

        h2{
            font-size:16px;
        }

        input{
            height:24px;
            width: calc(100% - 20px);
            margin-top:20px;
        }

        .button-area{
            margin-top:20px;

            button{
                margin:0 5px;
            }
        }
    }

    .wrap .container{
        display: flex;
        margin-top:20px;
        flex-wrap: wrap;
    }

    section{
        border:1px solid gray;
        margin-right: 10px;
        min-width:200px;
        width:calc(20% - 12px);
        
        b{
            background: black;
            display: block;
            padding:10px 15px;
            display: flex;
            justify-content: space-between;
            span{
                color:#fff;    
            }

            i{
                &::before,&::after{
                    background: #fff;
                }
            }
        }

        ul{
            margin:10px;
            border-top:1px solid black;
        }

        li{
            padding:10px;
            border-bottom:1px dashed gray;
            display: flex;
            justify-content: space-between;
        }

        button{
            display: block;
            width:calc(100% - 20px);
            font-size:14px;
            margin:10px;
        }

        i{
            display: inline-block;
            width:14px;
            height: 14px;
            overflow: hidden;
            text-indent: -14px;
            position: relative;
            cursor: pointer;

            &::before,&::after{
                content: '';
                position: absolute;
                top:calc(50% - 1px);
                left:0;    
                width:100%;
                height: 1px;
                background: black;
                transform: rotate(-45deg);
            }
            &::after{
                transform: rotate(45deg);
            }

            &:hover{
                &::before,&::after{
                    top:calc(50% - 2px);
                    height: 2px;
                }
            }
        }
    }

    .mask{
        position: fixed;
        top:0px;
        left:0px;
        width:100vw;
        height:100vh;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
    }

    .description{
        margin-bottom:20px;
        border-top:1px dashed gray;
        border-bottom:1px dashed gray;
        padding-top:20px;
        padding-bottom:20px;

        P{
            white-space: pre-line;
            line-height: 1.5rem;
            color:gray;
        }
    }
</style>