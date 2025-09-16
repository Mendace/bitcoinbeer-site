<template>
  <div
    ref="wrapper"
    class="relative w-36 md:w-44 aspect-[9/16] flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-800 shadow-lg snap-start"
  >
    <!-- VIDEO miniature (autoplay silent preview) -->
    <video
      ref="thumbVideo"
      class="h-full w-full object-cover"
      playsinline
      muted
      preload="metadata"
      :poster="poster"
    ></video>

    <!-- overlay play icon -->
    <div
      class="absolute inset-0 grid place-items-center bg-black/30 hover:bg-black/50 transition"
    >
      <svg viewBox="0 0 24 24" fill="white" class="h-8 w-8">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Hls from 'hls.js'

const props = defineProps({
  embed: { type: String, required: true },
  index: { type: Number, required: true },
  previewDuration: { type: Number, default: 3 } // anteprima in secondi
})

const thumbVideo = ref(null)
const poster = ref('')
const observer = ref(null)
const hls = ref(null)
const router = useRouter()

function parse (u) {
  const url = new URL(u)
  return { host: url.host, id: url.pathname.split('/').pop() }
}

async function loadSource () {
  const { host, id } = parse(props.embed)
  const res = await fetch(`https://${host}/api/v1/videos/${id}`)
  const data = await res.json()

  // poster fallback
  poster.value = `https://${host}${data.thumbnailPath}`

  // cerchiamo HLS, altrimenti MP4
  const hlsPl = data.streamingPlaylists?.find(p => p.type === 'hls')
  const mp4   = data.files?.[0]

  if (hlsPl) {
    const src = hlsPl.url.startsWith('http')
      ? hlsPl.url
      : `https://${host}${hlsPl.url}`

    if (thumbVideo.value.canPlayType('application/vnd.apple.mpegurl')) {
      thumbVideo.value.src = src
    } else {
      hls.value = new Hls({ autoStartLoad: false })
      hls.value.loadSource(src)
      hls.value.attachMedia(thumbVideo.value)
    }
  } else if (mp4) {
    thumbVideo.value.src = mp4.fileDownloadUrl.startsWith('http')
      ? mp4.fileDownloadUrl
      : `https://${host}${mp4.fileDownloadUrl}`
  }

  thumbVideo.value.load()
}

let timerId = null
function playPreview () {
  thumbVideo.value.currentTime = 0
  thumbVideo.value.play().catch(() => {})
  clearTimeout(timerId)
  timerId = setTimeout(() => {
    thumbVideo.value.pause()
  }, props.previewDuration * 1000)
}

function stopPreview () {
  clearTimeout(timerId)
  thumbVideo.value.pause()
}

function openViewer () {
  router.push({ name: 'bolts-viewer', params: { index: props.index } })
}

onMounted(() => {
  loadSource()

  // al click, apri il viewer
  thumbVideo.value.parentElement.addEventListener('click', openViewer)

  // IntersectionObserver per enact preview quando entra in viewport
  observer.value = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) playPreview()
      else stopPreview()
    },
    { threshold: 0.5 }
  )
  observer.value.observe(thumbVideo.value)
})

onUnmounted(() => {
  observer.value?.disconnect()
  hls.value?.destroy()
  clearTimeout(timerId)
  thumbVideo.value.parentElement.removeEventListener('click', openViewer)
})
</script>

<style scoped>
/* nessun cambiamento aggiuntivo qui */
</style>
