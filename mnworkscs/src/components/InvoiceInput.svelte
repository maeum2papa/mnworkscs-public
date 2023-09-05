<script>
    import { onDestroy, onMount } from "svelte";
    import { postApi } from "../services/api";
    import { Loading } from "../stores/store";

    export let invoiceInput;
    export let handleMask;
    export let handleGetAs;
    export let idx;
    export let closeInvoiceInput;
    
    const couriers = []
    const formData = {
        idx: "",
        recCourier:"",
        recInvoice: ""
    }

    const handleSubmit = async() => {
        formData.idx = idx
        
        const res = await postApi({
            path: '/api/as/invoice',
            data: formData
        })
        $Loading = { flag: true };
        if(res.msg == 'ok') {
            handleGetAs()
            // invoiceInput = false;
            closeInvoiceInput();
        }
        $Loading = { flag: false };
    }

    const handleCourier = (e) => {
        formData.recCourier = e.target.value
    }

    // onDestroy(()=>{
    //     handleGetAs()
    // })

    onMount(async()=>{
        const ship = await postApi({
            path:"/api/ship/get"
        })

        if(ship.msg=='ok'){
            
            ship.data.forEach((e,i) => {
                couriers[i] = e.name
            });
        }

        const getShip = await postApi({
            path:"/api/result/one",
            data : {idx:idx}
        });

        if(getShip.data){
            formData.recCourier = getShip.data.recCourier;
            formData.recInvoice = getShip.data.recInvoice;
        }
    })

</script>


<div id="invoice-form">
    <p>운송장을 입력해주세요</p>
    <div class="select">
        <select name="" id="" on:change={handleCourier} bind:value={formData.recCourier}>
            <option value="">택배사 선택</option>
            {#each couriers as item}
                <option value={item}>{item}</option>
            {/each}
        </select>
    </div>
    <input type="text" bind:value={formData.recInvoice}>
    <div class='button-area'>
        <button type="button" on:click={handleMask}>닫기</button>
        <button on:click={handleSubmit}>저장</button>
    </div>
</div>
<div class="mask" on:click={handleMask}></div>


<style lang="scss">
    #invoice-form{
        position:fixed;
        min-width: 300px;
        padding:40px;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        background: #fff;
        z-index: 2001;
        border-radius: 4px;
        text-align: center;
        .select {
            margin: 0 auto;
        }
        div{
            font-size:var(--font-size-normal);
        }
        input {
            max-width: 262px;
            width: 100%;
            margin-top: 8px;
        }
    }
    .button-area{
        margin-top:20px;
    }
    p{
        margin-bottom:20px;
        white-space: pre-line;
        line-height: 30px;
    }
    .mask{
        position: fixed;
        width:100vw;
        height: 100vh;
        background: rgba(1,1,1,0.9);
        z-index: 2000;
        top:0;
        left:0;
    }

    @media only screen and (max-width:768px){
        #invoice-form{
            min-width: 200px;
            img{
                width:100%;
            }
        }
        p{
            line-height: 20px;
        }
    }
</style>