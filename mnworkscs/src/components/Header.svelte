<script>
    import { goto } from "$app/navigation";

    let mobileNavFlag = false
    const handleMenuClick = (path)=>{
        goto(path);
        mobileNavFlag = false
    }
</script>

<header>
    <div>
        <a href="/"><img src="/images/logo.png" alt="주식회사 엠앤웍스"></a>
        <nav class="pc-nav">
            <ul>
                <li><a href="/cs/intro">엠엔웍스 고객지원</a></li>
                <li><a href="/genuine">정품등록 접수</a></li>
                <li><a href="/as">온라인 AS 접수</a></li>
                <li><a href="/faq">자주묻는질문</a></li>
                <li><a href="/notice">공지사항</a></li>
            </ul>
        </nav>
        <div class="mobile-btn" on:click={()=>{mobileNavFlag = !mobileNavFlag}}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
    {#if mobileNavFlag}
    <div class="mobile-nav">
        <nav>
            <ul>
                <li on:click={()=>handleMenuClick("/cs/intro")}>엠엔웍스 고객지원</li>
                <li on:click={()=>handleMenuClick("/genuine")}>정품등록 접수</li>
                <li on:click={()=>handleMenuClick("/as")}>온라인 AS 접수</li>
                <li on:click={()=>handleMenuClick("/faq")}>자주묻는질문</li>
                <li on:click={()=>handleMenuClick("/notice")}>공지사항</li>
            </ul>
        </nav>
    </div>
    {/if}
</header>

<div class="blank"></div>

<style lang="scss">
    header{
        >div {
            padding: 0 20px;
            max-width: 1390px;
            height: 120px;
            margin: 0 auto;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: space-between;

        }
        box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.18);
        img {
            width: 200px;
            height: auto;
        }
    }

    ul {
        display: flex;
        justify-content: space-around;
        li {
            font-size: var(--font-body-middle);
            font-weight: 700;
            margin: 0 24px;
            cursor: pointer;
            &:hover {
                color: var(--orange);
            }
        }
    }
    .mobile-nav {
        position: absolute;
        padding:0;
        top: 120px;
        width: 100%;
        height: auto;
        background-color: #ffffff;
        z-index: 1000;
        display: block;
        box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.05);
        
        ul {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-top: 1px solid var(--gray100);
            li {
                padding: 20px 0px;
                border-bottom: 1px solid var(--gray100);
            }
        }

    }
   @media only screen and (max-width:1024px){
        .pc-nav { display: none; }
        .mobile-btn {
            display: block;
            position: relative; 
            width: 26px;
            height: 26px;
            cursor: pointer;

            span {
                position: absolute;
                display: block;
                content: "";
                width: 100%;
                height: 2px;
                background-color: #000000;
                &:nth-child(1) {
                    top: 0;
                }
                &:nth-child(2) {
                    top: 30%;
                }
                &:nth-child(3) {
                    top: 62%;
                }
            }
        }
    }

    @media only screen and (max-width:768px){
        header{
            >div {
                height: 68px;
            }
            
            img{
                width:160px;
            }

            .mobile-btn {
                width: 20px;
                height: 20px;
            }

            .mobile-nav {
                position: absolute;
                padding:0;
                top: 68px;
                li {
                    font-size: var(--font-body-normal);
                }
            }
        }
    }

</style>