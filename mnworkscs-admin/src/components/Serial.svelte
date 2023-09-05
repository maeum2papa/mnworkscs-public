<script>
    import { onMount } from "svelte";
    import * as XLSX from 'xlsx/xlsx.mjs';
    import { postApi } from "../services/api";
    import { Loading } from "../stores/store";
    

    export let handleMask;
    export let handleGetList2;

    let file;

    const fileAsync = (e) => {
            return new Promise((resolve, reject) => {
                let input = e.target;
                let reader = new FileReader();
                reader.onload = () => {
                    let fileData = reader.result;
                    let wb = XLSX.read(fileData, {type: 'binary'});
                    let rowObj
                    wb.SheetNames.forEach((sheetName) => {
                       rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
                    })
                    resolve(rowObj)
                }
                reader.readAsBinaryString(input.files[0])
            })
        }

    const handleFile = async(e)=>{
        //엑셀 파일 추가시 동작
        const sheetData = await fileAsync(e);
        $Loading = {flag:true};
        const res = await postApi({
            path: '/api/list/add',
            data: sheetData
        })

        if(res.msg=='ok' || res.msg=='no'){
            $Loading = {flag:false};
            handleMask();
            handleGetList2();
        }
        
        
    }

    const handleCancel = ()=>{
        handleMask();
    }

    onMount(async()=>{
        file.click();
    });
</script>


<input type="file" bind:this={file} on:change={handleFile} on:cancel={handleCancel}>


<style lang="scss">
    input[type=file]{
        position: absolute;
        right:0;
        bottom:0;
    }
</style>