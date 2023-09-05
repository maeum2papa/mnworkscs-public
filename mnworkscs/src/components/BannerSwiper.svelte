<script>
  // import { register } from 'swiper/element/bundle';
  import Swiper from 'swiper';
  import { onMount } from 'svelte';

  export let banners
 
  const remove = (src) => {
    const removeText = src.replaceAll('&quot', "")
    return removeText;
  }
  // register();
  let swiperEl2, swiperObj;
  const spaceBetween = 10;
  
  const onProgress = (e) => {
    const [swiper, progress] = e.detail;
    // console.log(progress)
  };
  const onSlideChange = (e) => {
    // console.log('slide changed')
  }

  onMount(()=>{
    // swiperObj = new Swiper(swiperEl2, {
    //   navigation: {   // 버튼 사용자 지정
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev',
    //   },
    //   pagination: true,
    //   autoplay: {
    //     delay: 100,
    //     disableOnInteraction: true,
    //   },
    //   // slidesPerView: 1,
    //   // spaceBetween: 30,
    //   // loop: true,
    //   // observer: true,

    // });
    // console.log('swiperObj:', swiperObj);
  })
</script>

<div class="container">

  <swiper-container 
    bind:this={swiperEl2}
    style={`
      --swiper-navigation-color: #fff; 
      --swiper-pagination-color: #fff; 
    `}
    autoplay-delay="2500"
    navigation="true"
    pagination="true"
    loop="true"
    on:progress={onProgress}
    on:slidechange={onSlideChange}
  >
    
    {#each banners as item}
      {#if !item.file.includes('youtube')}
        <swiper-slide>
          <img src={item.file} alt="">
          <div class="copywrite">
            <h3>{item.mainCopy}</h3>
            <p>{item.subCopy}</p>
          </div>
        </swiper-slide>
      {:else}
        <swiper-slide>
          <!-- <div class="copywrite">
            <h3>{item.mainCopy}</h3>
            <p>{item.subCopy}</p>
          </div> -->
          <iframe frameborder="0" height="100%" width="100%" 
            src={item.file.replace('watch?v=', 'embed/')+'?mute=1&loop=1&autoplay=1&rel=0&controls=0&showinfo=0" allow="autoplay; encrypted-media" allowfullscreen'}>
          </iframe>
          <div class="copywrite">
            <h3>{item.mainCopy}</h3>
            <p>{item.subCopy}</p>
          </div>
        </swiper-slide>
      {/if}
    {/each}
  </swiper-container>
</div>



<style lang="scss">
  swiper-container {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    &::part(bullet-active) {
      width: 20px;
      border-radius: 8px;
    }
    // &::part(button-prev) {
    //   width: 44px;
    //   height: 44px;
    //   border-radius: 50%;
    //   background: url('/images/icon_arrow_left.png') no-repeat;
    // }
    // &::part(button-next) {
    //   width: 44px;
    //   height: 44px;
    //   border-radius: 50%;
    //   background: url('/images/icon_arrow_right.png') no-repeat;
    // }
  }
  
  swiper-slide {
    width: 100%;
    height: 175px;
    text-align: center;
    font-size: 18px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  iframe, img {
    border-radius: 10px;
  }
  .copywrite {
    width: 100%;
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    left: 80px;
  }
  h3, p {
    color: #ffffff;
  }
  h3 {
    font-size: var(--font-head-normal);
  }

  swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  // .swiper-pagination-bullet-active {
  //     width: 20px !important;
  // }

  // .swiper-button-prev {
  //   width: 20px;
  //   height: 20px;
  //   background-color: #ffffff;
  // }
</style>