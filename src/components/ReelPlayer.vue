<template>
  <div
    ref="wrapper"
    class="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-lg"
    :class="viewer && 'max-h-[85vh]'"
  >
    <video
      ref="video"
      class="h-full w-full object-cover"
      playsinline
      preload="metadata"
      :muted="!viewer || muted"
    />

    <!-- pulsante volume (solo viewer) -->
    <button
      v-if="viewer"
      @click="toggleMute"
      class="absolute top-2 right-2 rounded-full bg-black/60 p-2 hover:bg-black/80"
    >
      <svg v-if="muted" viewBox="0 0 24 24" fill="white" class="h-6 w-6">
        <path d="M16.5 12 19 14.5 20.5 13 18 10.5 20.5 8 19 6.5 16.5 9 14 6.5 12.5 8 15 10.5 12.5 13 14 14.5 16.5 12zM4 9v6h4l5 5V4L8 9H4z"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="white" class="h-6 w-6">
        <path d="M7 9v6h4l5 5V4L11 9H7z"/>
      </svg>
    </button>

    <!-- pulsante fullscreen (solo viewer) -->
    <button
      v-if="viewer"
      @click="toggleFs"
      class="absolute bottom-2 right-2 rounded-full bg-black/60 p-2 hover:bg-black/80"
    >
      <svg viewBox="0 0 24 24" fill="white" class="h-5 w-5">
        <path v-if="!fs" d="M9 3H3v6h2V5h4V3zm6 0v2h4v4h2V3h-6zm4 16h-4v2h6v-6h-2v4zM5 15H3v6h6v-2H5v-4z"/>
        <path v-else d="M14 10V4h-4v2h2v4h2zm-4 4v6h4v-2h-2v-4h-2zm0-4H4v4h2v-2h4v-2zm6 0v2h4v2h2v-4h-6z"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Hls from 'hls.js'

const props = defineProps({
  embed: { type: String, required: true },
  viewer: { type: Boolean, default: false }
})

const video   = ref(null)
const muted   = ref(false)
const fs      = ref(false)
let hls, io

function parse (u) {
  const x = new URL(u)
  return { host: x.host, id: x.pathname.split('/').pop() }
}

async function loadSrc () {
  const { host, id } = parse(props.embed)
  const r = await fetch(`https://${host}/api/v1/videos/${id}`)
  const d = await r.json()

  video.value.poster = `https://${host}${d.thumbnailPath}`

  const hlsPl = d.streamingPlaylists?.find(p => p.type === 'hls')
  const mp4   = d.files?.[0]

  if (hlsPl) {
    const src = hlsPl.url.startsWith('http') ? hlsPl.url : `https://${host}${hlsPl.url}`
    if (video.value.canPlayType('application/vnd.apple.mpegurl')) video.value.src = src
    else { hls = new Hls(); hls.loadSource(src); hls.attachMedia(video.value) }
  } else if (mp4) {
    video.value.src = mp4.fileDownloadUrl.startsWith('http') ? mp4.fileDownloadUrl : `https://${host}${mp4.fileDownloadUrl}`
  }
  video.value.load()
}

function toggleMute () { muted.value = !muted.value; video.value.muted = muted.value }

async function toggleFs () {
  if (!document.fullscreenElement) {
    await video.value.requestFullscreen(); fs.value = true
  } else {
    await document.exitFullscreen(); fs.value = false
  }
}

onMounted(() => {
  loadSrc()

  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        video.value.muted = props.viewer ? muted.value : true
        video.value.currentTime = 0
        video.value.play().catch(()=>{})
      } else video.value.pause()
    },
    { threshold: 0.6 }
  )
  io.observe(video.value)
})

onUnmounted(() => { io?.disconnect(); hls?.destroy() })
</script>

<style scoped>
video{opacity:0;transition:opacity .3s}video[src]{opacity:1}
</style>

