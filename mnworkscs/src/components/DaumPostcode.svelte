<script>
    import DaumPostcode from 'svelte-daum-postcode';

    export let handleComplete;
    export let daumPostFlag;

    const handleClose = () => {
        daumPostFlag = false
    }
</script>


<div class="modal">
    <DaumPostcode on:complete={handleComplete}/>
</div>

<div class="mask" on:click={handleClose}></div>


<style lang="scss">
.modal{
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
    
    div{
        font-size:var(--font-size-normal);
    }
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

</style>