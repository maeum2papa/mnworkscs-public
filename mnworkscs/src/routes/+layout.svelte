<script>
	// import "../css/common.min.css";
	import "../scss/common.scss"
	import Alert2 from '../components/Alert2.svelte'
	import Loding from "../components/Loding.svelte";
    import Header from "../components/Header.svelte";
    import Footer from "../components/Footer.svelte";
    import { onMount } from "svelte";

	let chatBtnFlag = true;

	const chatNaverTalkTalk = () =>{
		setTimeout(()=>{
			window.open("https://talk.naver.com/ct/w4lee5?frm=psf");
		},100)
	}

	onMount(()=>{
		
		setTimeout(()=>{

			// const options = {
			// 	root: null, // .container class를 가진 엘리먼트를 root로 설정. null일 경우 브라우저 viewport
			// 	rootMargin: '10px', // rootMargin을 '10px 10px 10px 10px'로 설정
			// 	threshold: [0, 0.5, 1] // 타겟 엘리먼트가 교차영역에 진입했을 때, 교차영역에 타켓 엘리먼트의 50%가 있을 때, 교차 영역에 타켓 엘리먼트의 100%가 있을 때 observe가 반응한다.
			// }

			let observer = new IntersectionObserver((entries, observer) => {
				if(entries[0].isIntersecting){
					chatBtnFlag = false;
				}else{
					chatBtnFlag = true;
				}
			},{});
			
			let target = document.querySelector("footer");
			observer.observe(target);
		},3000)
		

	})
</script>

<div class="app">
	
	<main>
		<Header/>
		<slot />
		<Footer/>

		{#if chatBtnFlag}
		<div class="floating-btn" on:click={chatNaverTalkTalk}>
			<img src="/images/icon_chat.png" alt="">
			<p>채팅상담</p>
		</div>
		{/if}
	</main>

</div>

<Alert2/>
<Loding/>

<style lang="scss">
	.floating-btn {
		position: fixed;
		right: 40px;
		bottom: 40px;
		min-width: 0;
		width: 90px;
		height: 90px;
		background-color: #ff7a20;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.1);
		z-index: 5000;
		cursor: pointer;

		p {
			color: #ffffff;
			font-size: var(--font-body-small);
		}
	}
</style>