<script lang="ts">
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";

	const playlist = [
		"/music/music1.mp3",
		"/music/music2.mp3",
	];

	let audio: HTMLAudioElement;
	let isPlaying = $state(false);
	let volume = $state(0.3);
	let currentTrack = $state(0);

	onMount(() => {
		audio.volume = volume;
	});

	function togglePlay() {
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		isPlaying = !isPlaying;
	}

	function handleVolume(e: Event) {
		const target = e.target as HTMLInputElement;
		volume = parseFloat(target.value);
		audio.volume = volume;
	}

	function onTrackEnd() {
		currentTrack = (currentTrack + 1) % playlist.length;
		audio.src = playlist[currentTrack];
		audio.play();
	}

	function showPanel() {
		document.querySelector("#audio-panel")?.classList.remove("float-panel-closed");
	}

	function hidePanel() {
		document.querySelector("#audio-panel")?.classList.add("float-panel-closed");
	}
</script>

<div class="relative z-50" role="menu" tabindex="-1" onmouseleave={hidePanel}>
	<button 
		aria-label="Audio Player" 
		class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" 
		onclick={togglePlay} 
		onmouseenter={showPanel}
	>
		<div class="flex items-center justify-center">
			{#if isPlaying}
				<Icon icon="material-symbols:pause-rounded" class="text-[1.25rem] text-[var(--primary)]"></Icon>
			{:else}
				<Icon icon="material-symbols:music-note-rounded" class="text-[1.25rem]"></Icon>
			{/if}
		</div>
	</button>

	<div id="audio-panel" class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5">
		<div class="card-base float-panel p-4 min-w-[12rem]">
			<div class="flex flex-col gap-3">
				<span class="text-sm font-bold text-50">Volumen</span>
				<input 
					type="range" 
					min="0" max="1" step="0.05" 
					value={volume} 
					oninput={handleVolume}
					class="w-full h-1 bg-[var(--primary)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
				/>
				<div class="text-[10px] text-30 flex justify-between">
					<span>Track {currentTrack + 1} / 2</span>
					<span>{isPlaying ? 'Reproduciendo' : 'Pausado'}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<audio 
	bind:this={audio} 
	src={playlist[currentTrack]} 
	loop={false} 
	onended={onTrackEnd}
	preload="metadata"
></audio>

<style>
	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 12px;
		height: 12px;
		background: var(--primary);
		border-radius: 50%;
	}
</style>