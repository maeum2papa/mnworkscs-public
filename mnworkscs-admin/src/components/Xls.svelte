<script>
    import * as XLSX from 'xlsx/xlsx.mjs';
    import { saveAs } from 'file-saver';
    import { onMount } from 'svelte';
    import { dataset_dev } from 'svelte/internal';

    export let handleMask;
    export let list;
    
    let table;

    const column = [
        {
            name : '^no',
            use : true,
            columnName : 'idx',
            dataType:'i'
        },
        {
            name : '^이름',
            use : true,
            columnName : 'name',
            dataType:'s'
        },
        {
            name : '^휴대폰번호',
            use : true,
            columnName : 'mobile',
            dataType:'s'
        },
        {
            name : '^이메일',
            use : true,
            columnName : 'email',
            dataType:'s'
        },
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
        },
        {
            name : '^시리얼번호',
            use : true,
            columnName : 'serial',
            dataType:'s'
        },
        {
            name : '^구매날짜',
            use : true,
            columnName : 'buyDate',
            dataType:'s'
        },
        // {
        //     name : '영수증',
        //     use : true,
        //     columnName : 'receipt',
        //     dataType:'s'
        // },
        {
            name : '^광고매체',
            use : true,
            columnName : 'ad',
            dataType:'s'
        },
        {
            name : '^정품등록일시',
            use : true,
            columnName : 'regDate',
            dataType:'s'
        }
    ]

    const handleExport = async()=>{
        exportExcel();
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
        var newWorksheet = XLSX.utils.table_to_sheet(table);
        let trueColumn = column;
        for(let j=0; j<trueColumn.length; j++){
            if(trueColumn[j].use!=true){
                trueColumn.splice(j,1);
            }
        }
        
        for(let key in newWorksheet){ 
            if(!key.includes('!')){
                // console.log(newWorksheet[key]);
                newWorksheet[key].v = newWorksheet[key].v.substring(1).replace('null', '')
            }
        }

        
        // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
        XLSX.utils.book_append_sheet(wb, newWorksheet, 'Sheet1');

        // step 4. 엑셀 파일 만들기 
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

        // step 5. 엑셀 파일 내보내기
        let date = new Date;
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'export_'+date.getTime()+'.xlsx');
    }


    const dateFormat = (date) => {
        
        let res = '';

        if(date!=null){
            if(date!='0000-00-00'){
                res = date.replace("T"," ");
                res = res.replace(".000Z","");
                
            }
        }

        return res;
    }


</script>

<div id="xls">
    <h2>엑셀추출 컬럼 설정</h2>
    <ul>
        {#each column as item,i}
        <li><input type="checkbox" id="chb{i}" bind:checked={item.use}><label for="chb{i}">{item.name.slice(1)}</label></li>
        {/each}
    </ul>
    <div class="button-area">
        <button type="button" on:click={handleMask}>닫기</button>
        <button type="button" on:click={handleExport}>추출</button>
    </div>
</div>

<div class="hidden">
    <table bind:this={table}>
        <tr>
            {#each column as item}
                {#if item.use}
                <th>{item.name}</th>
                {/if}
            {/each}
        </tr>
        {#each list as lietItem,i}
        <tr>
            {#each column as item}
                {#if item.use}
                    <td>^{#if item.columnName=='buyDate' || item.columnName=='regDate' }
                            {dateFormat(lietItem[item.columnName])}
                        {:else}
                            {lietItem[item.columnName]}
                        {/if}
                    </td>
                {/if}
            {/each}
        </tr>
        {/each}
    </table>
</div>

<style lang="scss">
    .hidden{
        overflow: hidden;
        width:0;
        height:0;
    }
    .button-area{
        margin-top:20px;
        padding-left: 5px;
        button{
            margin-right:10px;
        }
    }

     #xls{
        position: fixed;
        background: #fff;
        width:400px;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        z-index: 1100;
        text-align: center;
        padding:20px;

        h2{
            font-size:24px;
            margin-bottom:20px;
        }


        ul{
            border-top:1px solid black;

            li{
                border-bottom:1px solid gray;
                padding:15px 0px;
                font-size:16px;
            }
        }

        input[type="checkbox"]{
            display: none;
        }
        input[type="checkbox"]+label{
            cursor: pointer;
            width: 100%;
            position: relative;
            padding-left:25px;
            &::before{
                content: '';
                position: absolute;
                width:16px;
                height: 16px;
                background: #eee;
                top:0;
                left:0;
            }
        }
        input[type="checkbox"]:checked+label{
            &::before{
                background: black;
                width:16px;
                height: 16px;
                border:3px solid #eee;
            }
        }

    }
</style>