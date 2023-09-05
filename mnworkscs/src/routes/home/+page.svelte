<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { postApi } from "../../services/api";
    import { category } from "../../services/constants";
    import NoticeSwiper from "../../components/NoticeSwiper.svelte";
    import BannerSwiper from "../../components/BannerSwiper.svelte";
    import Popup from "../../components/Popup.svelte";
    import { getCookie, setCookie } from "../../services/cookie";
    import { register } from 'swiper/element/bundle';
    import CustomSlide from "../../components/CustomSlide.svelte";
    
    // register();

    let searchWord = ['마우스청소', '연결이 안돼요', 'led가 이상해요', '제품연결속도', '구성품안내']
    let searchKeyword = ''

    let faq = []
    let banners = []
    let notice = []
    let popups = []

    let popupFlag = true;

    const handleSearch = async () => {
        goto(`/faq/search?keyword=${searchKeyword}`)
    }

    const handleHashtag = (item) => {
        searchKeyword = item
        handleSearch()
    }

    const handleEnter = (e) => {
        if(e.keyCode==13){
            handleSearch()
        }
    }

    const handleGetFaq = async()=>{
        const res = await postApi({
            path: '/api/faq',
            data: {
                category: "",
                keyword: "",
                limit: 3,
                page: 1
            }
        })
        faq = res.data
    }

    const handleGetNotice = async()=>{
        const res = await postApi({
            path: '/api/notice',
            data: {
                keyword: "",
                limit: 3,
                page: 1
            }
        })
        notice = res.data;
    }

    const handleGetBanner = async()=>{
        const res = await postApi({
            path: '/api/banner',
            // data: {
            //     limit: 3,
            //     page: 1
            // }
        })
        banners = res.list

        banners.forEach((e,i) => {
            if(!banners[i].file.includes('youtube')) {
                if(window.location.hostname=='localhost'){
                    banners[i].file = "http://localhost:5174"+banners[i].file;
                }else if(window.location.hostname=='223.130.128.3'){
                    banners[i].file = "http://223.130.128.3:3003"+banners[i].file;
                }else{
                    banners[i].file = "https://admin.mnworkscs.co.kr"+banners[i].file;
                }   
            }
        });
    }

    const handleHitsAdd = async (idx) => {
        const res = await postApi({
            path: `/api/faq`,
            data: {id: idx}
        })
    }

    const handlePopupClose = (idx)=>{
		const newPopup = popups.filter((item, index) => index !== idx);
        popups = newPopup
    }

    const handleCloseToday = (i, idx) => {
        setCookie(`popup${idx}`, 1, 60*60*24);
        const newPopup = popups.filter((item, index) => index !== i);
        popups = newPopup
    }


    const handlePopup = async () =>{
        const res = await postApi({
            path: '/api/popup'
        })
        
        let list = []
        if(res.msg=='ok'){
            res.list.forEach(ele => {
                let popCookie = getCookie(`popup${ele.idx}`);
                
                const now = Date.now();
                const startDate = new Date(ele.startDate).getTime()
                const endDate = new Date(ele.endDate).getTime()
                const condition = now > startDate && now < endDate
                
                if(popCookie==1 || condition === false){

                }else{
                    // console.log('ele:', ele);
                    list.push(ele)
                    
                }
            });
        }
        popups = list
    }

    onMount(async()=>{
        handleGetFaq()
        handleGetNotice()
        handleGetBanner()
        handlePopup()
        setTimeout(()=>{
            register();
        },600)
    })

</script>

{#if popupFlag == true && popups.length > 0}
    <div class="popup-container">
    {#each popups as item, index}
            <div>
                <Popup 
                    {item} 
                    {index} 
                    {handlePopupClose} 
                    {handleCloseToday}
                />
            </div>
        {/each}
    </div>
{/if}


<div>
    <section class="mainbanner-area">
        <div>
            <h3>엠앤웍스 고객지원센터</h3>
            <p>무엇을<br/>도와드릴까요?</p>
        </div>
    </section>
    <div class="search">
        <div class="search-input">
            <div>
                <input type="text" placeholder="검색어를 입력해주세요 (예: 모델명, 증상 등)" bind:value={searchKeyword} on:keydown={handleEnter}>
                <button on:click={handleSearch}>검색</button>
            </div>
        </div>
        <div class="search-word">
            <div>추천검색어</div>
            <ul>
                {#each searchWord as item}
                    <li on:click={()=>handleHashtag(item)}>#{item}</li>
                {/each}
            </ul>
        </div>
    </div>
    <section class="model-area">
        <ul>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_mouse.png" alt=""></div>
                    <p>마우스</p>
                </div>
            </li>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_keyboard.png" alt=""></div>
                    <p>키보드</p>
                </div>
            </li>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_etc.png" alt=""></div>
                    <p>기타</p>
                </div>
            </li>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_headset.png" alt=""></div>
                    <p>헤드셋</p>
                </div>
            </li>
            <li>
                <div>
                    <div class="img-wrap"><img src="/images/icon_mousepad.png" alt=""></div>
                    <p>마우스패드</p>
                </div>
            </li>
        </ul>
    </section>
    <section class="movepage-area">
        <div class="move-box" on:click={()=>{goto('/cs/intro')}}>
            <div>
                <img src="/images/icon_help.png" alt="">
                <p>고객 지원에 대한 안내</p>
                <p>엠앤웍스 고객지원</p>
            </div>
            <div class="more-view">더 알아보기</div>
        </div>
        <div class="move-box" on:click={()=>{goto('/genuine')}}>
            <div>
                <img src="/images/icon_cursor.png" alt="">
                <p>제품 정품코드 등록</p>
                <p>정품등록 접수</p>
            </div>
            <div class="more-view">더 알아보기</div>
        </div>
        <div class="move-box" on:click={()=>{goto('/as')}}>
            <div>
                <img src="/images/icon_pliers.png" alt="">
                <p>이메일, 전화, 실시간 상담</p>
                <p>온라인 AS 접수</p>
            </div>
            <div class="more-view">더 알아보기</div>
        </div>
    </section>
    <section class="faq-area">
        <div>
            <h3>자주 찾으시는 질문이에요</h3>
            <p class="more-view" on:click={()=>{goto('/faq')}}>더 보기</p>
        </div>
        <table>
            <tbody>
                {#each faq as item}
                    <tr>
                        <td>
                            <!-- <div><img src="/images/icon_mouse_gray.png" alt=""></div> -->
                            <div class="faq-cate">{category[item.cate-1]}</div>
                        </td>
                        <td class="faq-subject"><a href={`/faq/${item.idx}`} on:click={()=>handleHitsAdd(item.idx)}>{item.subject}</a></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
    <section class="slidebanner-area">
        <h3>제품에 관련된 정보를 확인하세요!</h3>
        <BannerSwiper {banners}/>
        <!-- <Carousel {banners}/> -->
        <!-- <Swiper/> -->
    </section>

    <section class="notice-area">
        <div>
            <h3>공지사항</h3>
            <p class="more-view" on:click={()=>{goto('/notice')}}>더 보기</p>
        </div>
        <!-- <NoticeSwiper notices={notice}/> -->
        <CustomSlide {notice}/>
        <!-- <Splide 
            options={{
                rewind: true,
                arrows: false,
                pagination: true,
                autoplay: true,
                pause: false,
                speed: 400,
            }}
            
            hasTrack={false} 
            aria-label="공지사항 최근리스트">
            <div class="custom-wrapper notice-slide">
                <div>
                    <SplideTrack>
                        {#each notice as item}
                        <SplideSlide>
                            <div>{item.subject}</div>
                        </SplideSlide>
                        {/each}
                    </SplideTrack>
                </div>

                <button class="splide__toggle slide-button" type="button">
                    <span class="splide__toggle__play">Play</span>
                    <span class="splide__toggle__pause">Pause</span>
                </button>
            </div>
        </Splide> -->
    </section>
</div>


<style lang="scss">

    .popup-container {
        position: fixed;
        display: flex;
        justify-content: center;
        width:100%;
        max-width: 80vw;
        left:50%;
        top:50%;
        gap:20px;
        transform: translate(-50%,-50%);

        z-index: 100;
        &>div{
            width:50%;
            max-width: 600px;
            position: relative;

        }
    }
    .mainbanner-area {
        width: 100%;
        height: 380px;
        background: url('/images/main_banner.png') no-repeat;
        background-color: #010101;
        background-position: center;
        background-size: cover;
        position: relative;
        >div {
            position: absolute;
            top: 50%;
            left: 15%;
            transform: translateY(-50%);
            h3 {
                color: #ffffff;
                font-weight: 400;
                margin-bottom: 24px;
            }
            p {
                color: #ffffff;
                font-size: var(--font-head-giant);
                font-weight: 700;
                line-height: 1.25em;
            }
        }
    }
    .search {
        &-input {
            width: 760px;
            left: 50%;
            transform: translateX(-50%);
            position: absolute;
            margin: -25px auto 0;
            > div {
                width: 100%;
                position: relative;
                input {
                    max-width: 100%;
                    width: 100%;
                    height: 60px;
                    border-radius: 30px;
                    box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.18);
                    padding: 10px 20px;
                    z-index: 100;
                    border: none;
                    &::placeholder {
                        color: var(--gray);
                        font-size: var(--font-body-middle);
                    }
                }
                button {
                    position: absolute;
                    right: 20px;
                    top: calc(50% - 12px);
                    min-width: 0;
                    width: 25px;
                    height: 21px;
                    background: url('/images/icon_search.png') no-repeat;
                    background-position: center;
                    background-size: contain;
                    overflow: hidden;
                    text-indent: -100px;
                    border-radius: 0;
                    padding: 0;
                }
            }
        }
        &-word {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            >div {
                font-size: var(--font-body-small);
                position: relative;
                margin: 50px 10px;
                white-space: nowrap;
                &::after {
                    content: '';
                    display: block;
                    width: 1px;
                    height: 15px;
                    background-color: var(--border-gray);
                    position: absolute;
                    top: 0;
                    right: -10px
                }
            }
            >ul {
                display: flex;
                font-size: var(--font-body-small);
                position: relative;
                margin-left: 10px;
                li { 
                    margin: 0 4px; 
                    color: var(--gray700);
                    cursor: pointer;
                }
            }
        }
    }

    .model-area {
        margin-top: 40px;
        ul {
            display: flex;
            justify-content: center;
            li {
                width: 120px;
                height: 120px;
                margin: 0 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20px;
                box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.18);
                >div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    >div {
                        height: 40px;
                        margin-bottom: 10px;
                    }
                    >p {
                        font-size: var(--font-body-small);
                    }
                }
                .img-wrap {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }

    .movepage-area {
        max-width: 1390px;
        margin: 80px auto 0;
        display: flex;
        justify-content: center;
        >.move-box {
            display: flex;
            width: 270px;
            height: 104px;
            background-color: var(--gray100);
            border-radius: 20px;
            margin: 0 20px;
            padding: 40px 30px;
            justify-content: space-between;
            align-items: flex-end;
            cursor: pointer;
            >div:first-child {
                >p:first-of-type {
                    font-size: var(--font-body-small);
                    margin: 20px 0 8px;
                }
                >p:last-of-type {
                    font-size: var(--font-body-big);
                    font-weight: 700;
                }
            }
        }
        
    }

    .faq-area {
        max-width: 1080px;
        margin: 80px auto 0;
        padding: 0 20px;
        >div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            tr { 
                display: flex; 
                >td:nth-child(1) {
                    flex: 1;
                }
                >td:nth-child(2) {
                    flex: 9;
                }
            }
            td {
                border-bottom: 1px solid var(--border-gray);
                padding: 20px;
                font-size: var(--font-body-normal);
                text-overflow: ellipsis;
                &:first-child {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    >div:first-child {
                        width: 20px;
                        height: 20px;
                        margin-right: 16px;
                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                        }
                    }
                }
            }
            .faq-cate {
                font-size: var(--font-body-small);
                color: var(--gray700);
            }
            .faq-subject {
                cursor: pointer;
            }
        }
    }
    .slidebanner-area {
        max-width: 1080px;
        margin: 80px auto 0;
        padding: 0 20px;
    }
    .notice-area {
        max-width: 1080px;
        margin: 80px auto 0;
        padding: 0 20px;
        >div {
            display: flex;
            justify-content: space-between;
        }
        .notice-slide {
            width: 100%;
            height: 60px;
            border-radius: 10px;
            background-color: var(--bg-gray);
            margin-top: 20px;
            >div {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                >div{
                    display: flex;
                    font-size: var(--font-body-normal);
                    padding: 20px;
                }
                .slide-button {
                    >div:first-child {
                        width: 70px;
                        height: 30px;
                        border-radius: 15px;
                        background-color: var(--orange);
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    >div:last-child {
                        width: 30px;
                        height: 30px;
                        border-radius: 15px;
                        background: url('/images/icon_pause.png') no-repeat;
                        background-position: center;
                        text-indent: -999px;
                        overflow:hidden;
                        margin-left: 10px;
                    }
                }
            }
        }
    }
    h3 {
        font-size: var(--font-head-normal);
    }

    @media only screen and (max-width:1024px){
        .mainbanner-area {
            height: 340px;
        }
        .search {
            &-input {
                width: 80%;
                >div {
                    input {
                        height: 40px;
                        padding-right: 50px;
                        &::placeholder {
                            font-size: var(--font-body-normal);
                        }
                    }
                }

            }
            &-word {
                div {
                    margin: 30px 10px;
                }
                ul {
                    font-size: var(--font-body-tiny);
                    flex-wrap: wrap;
                    gap: 4px;
                    margin: 30px 10px;
                }
            }
        }
        .model-area {
            margin-top: 20px;
            ul {
                flex-wrap: wrap;
                gap: 20px;
                li {
                    margin: 0;
                    width: 100px;
                    height: 100px;
                    // margin: 0 10px;
                }
            }
        }
        .movepage-area {
            height: auto;
            padding: 0 20px;
            .move-box {
                flex-direction: column;
                height: auto;
                align-items: flex-start;
                margin: 10px;
                >div {
                    img {
                        height: 30px;
                    }
                    &:first-child {
                        >p:first-of-type {
                            font-size: var(--font-body-small);
                        }
                        >p:last-of-type {
                            font-size: var(--font-body-middle);
                        }
                    }
                }
                .more-view {
                    margin-top: 10px;
                }
            }
        }
        
    }
    
    @media only screen and (max-width:768px){
        .mainbanner-area {
            height: 240px;
            >div {
                left: 20px;
                h3 {
                    font-size: var(--font-body-small);
                }
                p {
                    font-size: var(--font-head-middle);
                }
            }
        }
        .model-area {
            ul {
                gap: 10px;
                li {
                    margin: 0;
                    width: 86px;
                    height: 86px;
                    border-radius: 15px;
                }
            }
        }
        .movepage-area {
            flex-direction: column;
            align-items: center;
            gap: 10px;
            >.move-box {
                width: 80%;
                margin: 0;
                padding: 30px 20px;
            }
        }
        h3 {
            font-size: var(--font-head-small);
        }
        .faq-area {
            table {
                tr {
                    flex-direction: column;
                    td {
                        padding: 10px;
                    }
                    >td:first-child {
                        border-bottom: none;
                        padding-bottom: 0;
                    }
                    >td:last-child {
                        padding-top: 0px;
                        line-height: 1.25em;
                    }
                }
                .faq-cate {
                    font-size: var(--font-body-small);
                }
            }
        }
        .notice-area {
            .notice-slide {
                >div {
                    >div:first-child {
                        font-size: var(--font-body-small);
                        text-overflow: ellipsis;
                        flex: 1 1 auto;
                        overflow: hidden;
                        white-space: nowrap;
                        display: inline;
                        padding-right: 0;
                    }
                    .slide-button {
                        flex: 0 0 auto;
                        >div { 
                            font-size: var(--font-body-small);
                        }
                    }
                }
            }
        }
    }

</style>