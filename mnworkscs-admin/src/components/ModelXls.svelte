<script>

    import * as XLSX from 'xlsx/xlsx.mjs';
    import { saveAs } from 'file-saver';
    import { onMount } from 'svelte';
    import { getApi,postApi } from '../services/api';
    import { Loading } from '../stores/store';

    let list = [];
    let xlsTable = {};
    let file = {};

    const column = [
        {
            name : '^브랜드',
            use : true,
            columnName : 'brand',
            dataType:'s'
        },
        {
            name : '^모델',
            use : true,
            columnName : 'model',
            dataType:'s'
        }
    ]


    const hadleXls = ()=>{
        exportExcel();
    }

    const hadleXlsUpdate = ()=>{
        file.click();
    }

    function s2ab(s) { 
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }

    function exportExcel(){ 
        // step 1. workbook 생성
        var wb = XLSX.utils.book_new();

        // step 2. 시트 만들기 
        var newWorksheet = XLSX.utils.table_to_sheet(xlsTable);
        let trueColumn = column;
        for(let j=0; j<trueColumn.length; j++){
            if(trueColumn[j].use!=true){
                trueColumn.splice(j,1);
            }
        }
        
        for(let key in newWorksheet){ 
            if(!key.includes('!')){
                newWorksheet[key].v = newWorksheet[key].v.substring(1).replace('null', '')
            }
        }
        
        
        // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
        XLSX.utils.book_append_sheet(wb, newWorksheet, 'Sheet1');

        // step 4. 엑셀 파일 만들기 
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

        // step 5. 엑셀 파일 내보내기
        let date = new Date;
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'model_'+date.getTime()+'.xlsx');
    }

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
            path: '/api/model/xls',
            data: sheetData
        })

        if(res.msg=='ok' || res.msg=='no'){
            $Loading = {flag:false};
            location.reload();
        }
        
        
    }

    const handleCancel = ()=>{
        
    }

    onMount(async()=>{

        const res = await getApi(
            {
                path:"/api/model"
            }
        );

        if(res.msg=='ok'){
            // console.log(res.data);
            list = res.data;
        }

    });

</script>

<div class="xls">
    <div><button type="button" on:click={hadleXls}>엑셀 다운로드</button></div>
    <div><button type="button" on:click={hadleXlsUpdate}>엑셀로 업데이트</button></div>
</div>


<input type="file" bind:this={file} on:change={handleFile} on:cancel={handleCancel}>


<div class="hidden">
    <table bind:this={xlsTable}>
        <tr>
            <th>^브랜드</th>
            <th>^모델</th>
        </tr>
        {#each list as brand}
            {#each brand.model as model}
            <tr>
                <td>^{brand.brand}</td>
                <td>^{model}</td>
            </tr>
            {/each}
        {/each}
    </table>
</div>

<style lang="scss">
    .xls{
        margin-bottom:20px;
        display: flex;
        gap:6px;
    }

    .hidden{
        display: none;
    }


    input[type="file"]{
        display: none;
    }
</style>