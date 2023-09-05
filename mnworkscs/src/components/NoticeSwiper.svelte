<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    // import { register } from 'swiper/element/bundle';
    import Swiper from 'swiper';
    
    export let notices = []
    // register();
    // const notices = [
      //   {subject: '첫번째 공지사항입니다'},
      //   {subject: '두번째 공지사항입니다'},
      //   {subject: '세번째 공지사항입니다'}
      // ]
    let swiperEl, swiperObj;
    // console.log('swiperObj:', swiperObj);
    const spaceBetween = 10;
    const onProgress = (e) => {
      const [swiper, progress] = e.detail;
      // console.log(progress)
    };
    const onSlideChange = (e) => {
      // console.log('slide changed')
    }
    const onClick = () => {
      
    }

    // function goPrev() {
    //   console.log("clicked: prev")
    //   swiperObj.slidePrev();
    // }

    // function goNext() {
    //   console.log("clicked next")
    //   swiperObj.slideNext();
    // }

    onMount(()=>{
      // swiperObj = new Swiper(swiperEl, {
      //   navigation: false,
      //   pagination: true,
      //   autoplay: {
      //     delay: 2500,
      //     disableOnInteraction: true,
      //   },
      //   slidesPerView: 1,
      //   spaceBetween: 10,
      //   loop: true,
      // });
    })
  
  </script>
  <div class="swiper-wrap"> 
    <swiper-container 
      bind:this={swiperEl}
      on:progress={onProgress}
      on:slidechange={onSlideChange}
      centered-slides={true}
      autoplay-delay={2500}
      loop={true}
      navigation={true}
      injectStyles={[

        `
          .swiper-button-next,
          .swiper-button-prev {
            background-color: white;
            background-position: center;
            background-size: 40px;
            background-repeat: no-repeat;
            padding: 8px 16px;
            border-radius: 100%;
            border: 2px solid black;
            color: red;
          }

          .swiper-button-prev {
            background-image: url("/box-arrow-in-left.svg");
          }

          .swiper-button-next {
            background-image: url("/box-arrow-in-right.svg");
          }

          .swiper-button-next::after,
          .swiper-button-prev::after {
            content: "";
          }

          .swiper-pagination-bullet{
            width: 40px;
            height: 40px;
            background-color: red;
          }
      `
      ]
      }
    >
      {#each notices as item, index}
      <swiper-slide on:click={()=>goto(`/notice/${item.idx}`)}>
        <h3>{item.subject}</h3>
      </swiper-slide>
      {/each}
    </swiper-container>
    <!-- <button on:click={onClick}></button> -->
    <!-- <div class="btn-area">
      <button class="prev swiper-button-prev"></button>
      <button class="next swiper-button-next"></button>
    </div> -->
  </div>
  
  <style lang="scss">
    swiper-container {
      width: 100%;
      height: 80px;
      background-color: var(--bg-gray);
      border-radius: 10px;
      margin-top: 20px;
      &::part(pagination) {
        color: #ffffff;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 70px;
        height: 37px;
        background-color: var(--orange);
        border-radius: calc(37px / 2);
        display: flex;
        justify-content: center;
        align-items: center;
        letter-spacing: 2px;
      }
    }
  
    .swiper-wrap {
      position: relative;
      >.btn-area {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        button {
          width: 38px;
          height: 38px;
          border-radius: 19px;
          min-width: 0;
        }
        .prev {
          background: url('/images/icon_arrow_page_left.png') no-repeat;
          background-position: center;
        }
        .next {
          background: url('/images/icon_arrow_page_right.png') no-repeat;
          background-position: center;
        }
      }
    }
    swiper-slide {
      width: 100%;
      height: 80px;
      text-align: center;
      font-size: 18px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    @media only screen and (max-width:768px){
      swiper-slide {
        padding-left: 20px;
      }
    }
  </style>