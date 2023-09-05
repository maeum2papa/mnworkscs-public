<script>
	let currId = 0;
	export let banners;
	const imgLen = banners.length;
	let positionLeft = 0;
	
	const moveSlider = () => {
		positionLeft = currId * 100;
	};

	const next = () => {
		currId = currId === imgLen - 1 ? 0 : currId + 1;
		moveSlider();
	};

	const prev = () => {
		currId = currId === 0 ? imgLen - 1 : currId - 1;
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

<div class="container">
	<div on:mouseover={stopPlay} on:mouseleave={autoPlay} class="container">
		<div class="slider" style="left: -{positionLeft}%;">
			{#each banners as item}
				<div class="slider-copy">
					<h3>{item.mainCopy}</h3>
					<p>{item.subCopy}</p>
				</div>
				<img src={item.file} alt="" />
			{/each}
		</div>
		<div class="arrow">
			<button on:click={prev} class="prev">Prev</button>
			<button on:click={next} class="next">Next</button>
		</div>
		<div class="papagination">
			{#each banners as _, i}
				<button
					class={currId === i ? "active" : ""}
					on:click={() => getIndex(i)}
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 178px;
		margin: 10px auto 0;
		overflow: hidden;
		border-radius: 10px;
	}
	.slider {
		display: flex;
		position: relative;
		transition: left 0.5s;
		width: 100%;
		height: 100%;
	}

	.slider-copy {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 40px;
	}

	h3 {
		color: #ffffff;
		font-size: var(--font-body-normal);
		margin-bottom: 10px;
	}
	.slider img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		flex-shrink: 0;
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
	button {
		min-width: 0;
		padding: 0;
	}
	.arrow button {
		width: 44px;
		height: 44px;
		margin-bottom: 0;
		padding: 12px;
		border: 0;
		background-color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
	}

	.prev {
		position: absolute;
		left: -20px;
		background: url('/images/icon_arrow_left.png') no-repeat;
		background-position: center;
		overflow: hidden;
		text-indent: -999px;
	}
	
	.next {
		position: absolute;
		right: -20px;
		background: url('/images/icon_arrow_right.png') no-repeat;
		background-position: center;
		overflow: hidden;
		text-indent: -999px;
	}

	.papagination {
		position: absolute;
		bottom: 10px;
		padding-bottom: 8px;
		width: 100%;
		text-align: center;
	}

	.papagination button {
		margin: 0 2px;
		width: 8px;
		height: 8px;
		border: 0;
		border-radius: 4px;
		background-color: rgba(255, 255, 255, 0.8);
		text-align: center;
		cursor: pointer;
	}
	.papagination .active {
		background-color: rgba(255, 0, 0, 0.8);
		width: 20px;
	}
	@media only screen and (max-width:768px){
		.arrow button {
			width: 30px;
			height: 30px;
		}

		.prev {
			left: -15px;
		}

		.next {
			right: -15px;
		}
	}
</style>
