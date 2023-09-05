<script>
    import { onMount } from "svelte";
    import Header from "../../components/Header.svelte";
    import { getApi, postApi } from "../../services/api";
    import { cAlert } from "../../stores/store";
    import ModelXls from "../../components/ModelXls.svelte";
    import { auth } from "../../services/auth";

    let addFlag = false;

    let inputs = {
        text:{}
    }

    let addData = {
        title:'',
        type:'',
        text:'',
        i:0
    }

    let models = []

    const handelGetModel = async() =>{
        //모델 가져오기
       const res = await getApi({
            path:"/api/model",
       });

       if(res.msg=='ok'){
            models = res.data;
       }
    }

    const handleBrandDel = (e)=>{
        if(confirm("삭제후에는 복원되지 않습니다.")){
            let i = e.target.getAttribute('i');
            models.splice(i,1);
            models = models;
            submitModel();
        }
    }

    const handleModelDel = (e)=>{
        if(confirm("삭제후에는 복원되지 않습니다.")){
            let i = e.target.getAttribute('i');
            let j = e.target.getAttribute('j');
            models[i].model.splice(j,1);
            models[i].model = models[i].model;
            submitModel();
        }
    }

    const handleBrandAdd = () =>{
        addData.title = '브랜드';
        addData.type = 'brand';
        addFlag = true;
        setTimeout(()=>{
            inputs.text.focus();
        },100);
    }

    const handleModelAdd = (e) => {
        let i = e.target.getAttribute('i');
        addData.i = i;
        addData.title = '모델';
        addData.type = 'model';
        addFlag = true;
        setTimeout(()=>{
            inputs.text.focus();
        },100);
    }

    const handleMask = () => {
        addData.text = '';
        addFlag = false;
    }

    const handleSave = async () => {
        addFlag = false;
        
        if(addData.type=='brand'){
            models = [...models,{ brand:addData.text,model:[]}];
        }else if(addData.type=='model'){
            let i = parseInt(addData.i);
            models[i].model = [...models[i].model,addData.text];
        }
        submitModel();
        handleMask();
    }


    const submitModel = async() =>{
        //models
        const res = await postApi({
            path:'/api/model',
            data : models
        });

        if(res.msg!='ok'){
            $cAlert = {flag:true,msg:'',feedback:()=>{}};
        }
    }

    onMount(async()=>{

        const res = await auth();
        
        if(res!='ok'){
            location.replace("/login");
            return false;
        }

    //     models = [
    //     {
    //         brand:"브랜드1",
    //         model:[
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //         ]
    //     },
    //     {
    //         brand:"브랜드2",
    //         model:[
    //             '모델1',
    //             '모델3',
    //             '모델4',
    //             '모델5',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //             '모델1',
    //         ]
    //     },
    // ]
    handelGetModel()
    });
</script>

<Header></Header>

<div class="wrap">

    <ModelXls/>

    <div class="button-area">
        <button type="button" on:click={handleBrandAdd}>브랜드 추가</button>
    </div>

    <div class="container">

        {#each models as brand,i}
        <section>
            <b><span>{brand.brand}</span><i on:click={handleBrandDel} {i}>X</i></b>
            <button type="button" on:click={handleModelAdd} {i}>모델 추가</button>
            <ul>
                {#each brand.model as model,j}
                <li><span>{model}</span><i on:click={handleModelDel} {i} {j}>X</i></li>
                {/each}
            </ul>
        </section>    
        {/each}
        
    </div>

</div>

{#if addFlag}
    <div id="box">
        <h2>{addData.title} 추가</h2>
        <input type="text" bind:value={addData.text} bind:this={inputs.text}>
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
</style>