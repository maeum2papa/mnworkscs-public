<script>
    export let handleMask;
    export let modalImg;
    // import { cAlert } from '../stores/store'

    // function closeAlert(){
    //     $cAlert.flag = false;
    // }
</script>


<div class="modal">
    <i on:click={handleMask}>X</i>
    <div><img src='{modalImg}'></div>
</div>
<div class="mask"></div>


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
    text-align: right;
    div{
        font-size:18px;
    }
}
.mask{
    position: fixed;
    width:100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 2000;
    top:0;
    left:0;
}
i{
    display: inline-block;
    width:14px;
    height: 14px;
    overflow: hidden;
    text-indent: 14px;
    position: relative;
    cursor: pointer;
    margin-bottom: 12px;

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
</style>