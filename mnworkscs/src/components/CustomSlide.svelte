<script>
    import { goto } from "$app/navigation";

    export let notice 

    let currId = 0;
    let noticeLen
    let positionTop = 0;
    
    $: {
        if(notice) {
            noticeLen = notice.length;
        }
    }

    const moveSlider = () => {
        if(currId != 0) {
            positionTop = currId * 28;
        } else {
            positionTop = 2
        }
        //   console.log('positionTop:', currId, positionTop);
    };

    const next = () => {
        currId = currId === noticeLen - 1 ? 0 : currId + 1;
        moveSlider();
    };

    const prev = () => {
        currId = currId === 0 ? noticeLen - 1 : currId - 1;
        moveSlider();
    };

    const getIndex = (index) => {
        currId = index;
        moveSlider();
    };

    let interval = setInterval(next, 2000);
    const autoPlay = () => {
        interval = setInterval(next, 2000);
    };

    const stopPlay = () => {
        clearInterval(interval);
    };
</script>

<div class="slide-wrap">
    <div on:mouseover={stopPlay} on:mouseleave={autoPlay} class="container">
        <div class="slider" style="margin-top: -{positionTop}px;">
            {#each notice as item}
                <p on:click={()=>goto(`/notice/${item.idx}`)}>{item.subject}</p>
            {/each}
        </div>
        <!-- <div class="arrow">
        <button on:click={prev} class="prev">Prev</button>
        <button on:click={next} class="next">Next</button>
      </div> -->
    </div>
    <div class="button-area">
        <div class="pagination">{currId+1} / {notice.length}</div>
        <div class="pause" on:click={stopPlay}></div>
    </div>
</div>

<style lang="scss">
    .slide-wrap {
        width: 100%;
        height: 80px;
        border-radius: 10px;
        text-align: center;
        background-color: var(--bg-gray);
        position: relative;
        margin-top: 20px;
    }
    .container {
        position: relative;
        width: 100%;
        max-height: 20px;
        top: 50%;
        transform: translateY(-50%);
        overflow: hidden;
    }
    .slider {
        display: flex;
        flex-direction: column;
        position: relative;
        transition: margin-top 0.5s;
        p {
            font-size: var(--font-body-middle);
            line-height: 1.5em;
            text-align: left;
            margin-left: 40px;
            font-weight: 700;
            cursor: pointer;
        }
    }
    .arrow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
    }
    .arrow button {
        margin-bottom: 0;
        padding: 12px;
        border: 0;
        background-color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
    }

    .button-area {
        position: absolute;
        // bottom: 0;
        right: 20px;
        display: flex;
        .pagination, .pause, .play {
            height: 38px; 
            border-radius: 19px;
            background-color: var(--orange);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            margin-left: 8px;
        }
        .pagination {
            width: 80px;
        }
        .pause {
            width: 38px;
            background: url('/images/icon_pause.png');
            background-size: cover;
            background-position: center;
            cursor: pointer;
        }
    }
    @media only screen and (max-width:768px){
        .slider {
            width: 60%;
            p {
                margin-left: 20px;
            }
        }
        .button-area {
            .pagination {
                width: 70px;
            }
        }
    }
</style>
