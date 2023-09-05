<script>
    import JsBarcode from 'jsbarcode'
    import { onMount } from "svelte";

    onMount(()=>{
        JsBarcode("#barcode", "SF1111111111113");
        print();

        setTimeout(()=>{
            self.close();
        },20)
        // print();
    })
</script>


<div class="wrap">
    <div>10024150729298-50729298 H26 IB</div>
    <svg id="barcode"></svg>
</div>

<style>
    .wrap{
        position: fixed;
        top:50%;
        left:50%;
        text-align: center;
        transform: translate(-50%,-50%);
    }
</style>