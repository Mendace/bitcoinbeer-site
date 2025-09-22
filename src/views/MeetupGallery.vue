<template>
  <div class="relative min-h-screen text-neutral-100 bg-black" :style="{'--nav-h': navH + 'px'}">
    <!-- offset sotto navbar -->
    <div class="h-[var(--nav-h)]"></div>

    <!-- HERO compatto -->
    <section class="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-6">
      <div class="relative overflow-hidden rounded-2xl">
        <img
          :src="heroImage"
          alt=""
          class="w-full h-[26vh] sm:h-[34vh] object-cover object-center"
          loading="eager"
          fetchpriority="high"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
<div class="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
  <h1 class="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-tight text-white drop-shadow">
    Meetups — Photo Gallery
  </h1>
  <!-- sottotitolo -->
  <p class="mt-1 text-sm sm:text-base text-white/80 max-w-2xl">
    Momenti dai nostri eventi Bitcoin Beer in tutta Italia
  </p>
  <div class="mt-3 h-[2px] w-20 bg-white/80"></div>
</div>

      </div>
    </section>

    <!-- MASONRY SENZA BUCHI (CSS columns) -->
    <main class="max-w-6xl mx-auto px-2 sm:px-4 pb-16">
      <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
        <figure
          v-for="(img, idx) in images"
          :key="img.src + '-' + idx"
          class="mb-4 break-inside-avoid overflow-hidden rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.5)] group"
        >
          <img
            :src="img.src"
            alt=""
            loading="lazy"
            decoding="async"
            @load="loaded.add(idx)"
            @click="openLightbox(idx)"
            class="w-full h-auto object-cover transition duration-400 ease-out will-change-transform
                   group-hover:scale-[1.015] group-active:scale-[0.995]
                   [filter:contrast(1.06)_saturate(1.03)]"
            :class="loaded.has(idx) ? 'opacity-100' : 'opacity-0 blur-[6px]'"
          />
          <!-- NIENTE CAPTION -->
        </figure>
      </div>
    </main>

    <!-- LIGHTBOX -->
    <transition name="fade">
      <div
        v-if="lb.open"
        class="fixed inset-0 z-50 bg-black/95 backdrop-blur-[2px] select-none"
        @keydown.stop
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
      >
        <!-- top bar (sempre cliccabile) -->
        <div ref="lbTopBar" class="absolute top-0 left-0 right-0 flex items-center justify-between px-3 sm:px-5 py-3 bg-gradient-to-b from-black/75 to-transparent z-10">
          <div class="text-white/85 text-sm">
            {{ lb.index + 1 }} / {{ images.length }}
          </div>
          <div class="flex items-center gap-2">
            <button @click="toggleZoom" class="px-3 py-1.5 rounded-lg text-white/90 hover:bg-white/10 border border-white/15">
              {{ zoomed ? 'Fit' : 'Zoom' }}
            </button>
            <button @click="copyCurrentUrl" class="px-3 py-1.5 rounded-lg text-white/90 hover:bg-white/10 border border-white/15">
              Copia link
            </button>
            <button @click="closeLightbox" class="px-3 py-1.5 rounded-lg text-white/90 hover:bg-white/10 border border-white/15">
              Chiudi
            </button>
          </div>
        </div>

        <!-- area immagine -->
        <div class="h-full w-full flex items-center justify-center px-2 sm:px-6">
          <div class="relative max-h-[86vh] max-w-[96vw]">
            <!-- click per next/prev SOLO sull'immagine -->
            <img
              :src="images[lb.index].src"
              alt=""
              :style="zoomStyle"
              class="object-contain max-h-[86vh] max-w-[96vw] transition-transform duration-200 will-change-transform z-0"
              @dblclick="toggleZoom"
              @wheel.passive="onWheelZoom"
              @mousedown.prevent="onDragStart"
              @mousemove.prevent="onDragMove"
              @mouseup.prevent="onDragEnd"
              @mouseleave="onDragEnd"
              @touchstart.passive="onDragStart"
              @touchmove.passive="onDragMove"
              @touchend.passive="onDragEnd"
              @click="onImageClick($event)"
            />

            <!-- zone laterali (non coprono la top-bar) -->
            <button
              class="absolute left-0"
              :style="edgeStyle"
              aria-label="prev"
              @click="prev"
            ></button>
            <button
              class="absolute right-0"
              :style="edgeStyle"
              aria-label="next"
              @click="next"
            ></button>
          </div>
        </div>

        <!-- thumbnails -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
          <div class="max-w-6xl mx-auto px-3 sm:px-6 py-3 overflow-x-auto no-scrollbar">
            <div class="flex gap-2">
              <button
                v-for="(thumb, i) in images"
                :key="'thumb-'+i"
                @click="go(i)"
                class="relative shrink-0 rounded-lg overflow-hidden border"
                :class="i === lb.index ? 'border-white' : 'border-white/20'"
                style="width: 72px; height: 52px;"
              >
                <img :src="thumb.src" class="w-full h-full object-cover" loading="lazy" />
                <div v-if="i === lb.index" class="absolute inset-0 ring-2 ring-white/80 rounded-lg pointer-events-none"></div>
              </button>
            </div>
          </div>
        </div>

        <!-- keyboard trap -->
        <input
          ref="trap"
          class="sr-only absolute opacity-0"
          @keydown.left.prevent="prev"
          @keydown.right.prevent="next"
          @keydown.esc.prevent="closeLightbox"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

/* NAVBAR OFFSET (misurazione reale) */
const navH = ref(72);
function measureNavbar() {
  const el = document.querySelector('#navbar') || document.querySelector('.navbar') || document.querySelector('header nav');
  if (el) navH.value = Math.ceil(el.getBoundingClientRect().height);
}

/* IMMAGINI */
const images = ref([
  { src: 'https://cdn.bitcoinbeer.events/meetup/DSC01623.JPG' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/DSC01653.JPG' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/DSC09751.JPG' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/DSC09788.JPG' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/DSC09814.JPG' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/Granatiero.jpg' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/Guybrush-2025-06.jpg' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/Guybrush_2_2025-06.jpg' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/Rivi.jpg' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/Luca-Bitbox.jpg' },
  { src: 'https://cdn.bitcoinbeer.events/meetup/Luca-Bitbox-2.jpg' },
]);
const heroImage = images.value[0]?.src || '';
const loaded = reactive(new Set());

/* LIGHTBOX */
const lb = reactive({ open: false, index: 0 });
const trap = ref(null);
const lbTopBar = ref(null);
const topBarH = ref(60); // default; ricalcolata in mount

function openLightbox(i=0){
  lb.open = true; lb.index = i;
  zoomed.value = false; pan.value = {x:0, y:0};
  nextTick(() => {
    trap.value?.focus();
    if (lbTopBar.value) topBarH.value = Math.ceil(lbTopBar.value.getBoundingClientRect().height);
  });
  preloadNeighbors();
}
function closeLightbox(){ lb.open = false; }
function go(i){ const L=images.value.length; lb.index=(i+L)%L; zoomed.value=false; pan.value={x:0,y:0}; preloadNeighbors(); }
function next(){ go(lb.index+1); }
function prev(){ go(lb.index-1); }
function preloadNeighbors(){
  const L=images.value.length;
  [lb.index-1, lb.index+1].forEach(i=>{
    const it = images.value[(i+L)%L];
    if(it){ const im = new Image(); im.src = it.src; }
  });
}

/* Edge click areas: NON coprono la top-bar */
const edgeStyle = computed(()=>({
  top: `${topBarH.value}px`,
  bottom: '70px',           // lascia spazio alla strip
  width: '22vw',            // lati comodi ma non invasivi
  cursor: 'pointer',
  background: 'transparent'
}));

/* Click sull’immagine: metà sx prev, metà dx next */
function onImageClick(e){
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if (x < rect.width/2) prev(); else next();
}

/* Zoom + pan + wheel */
const zoomed = ref(false);
const pan = ref({x:0,y:0});
const drag = ref({active:false, startX:0, startY:0, baseX:0, baseY:0});

const zoomStyle = computed(()=>{
  const scale = zoomed.value ? 1.55 : 1;
  const {x,y} = pan.value;
  return { transform: `translate(${x}px, ${y}px) scale(${scale})` };
});
function toggleZoom(){ zoomed.value = !zoomed.value; if(!zoomed.value) pan.value={x:0,y:0}; }
function onWheelZoom(e){
  if (Math.abs(e.deltaY)>0){
    if (!zoomed.value && e.deltaY<0) zoomed.value=true;
    else if (zoomed.value && e.deltaY>0){ zoomed.value=false; pan.value={x:0,y:0}; }
  }
}
function pointer(e){ return e.touches?.[0] ? {x:e.touches[0].clientX, y:e.touches[0].clientY} : {x:e.clientX, y:e.clientY}; }
function onDragStart(e){ if(!zoomed.value) return; const p=pointer(e); drag.value={active:true,startX:p.x,startY:p.y,baseX:pan.value.x,baseY:pan.value.y}; }
function onDragMove(e){ if(!drag.value.active||!zoomed.value) return; const p=pointer(e); pan.value={x:drag.value.baseX+(p.x-drag.value.startX), y:drag.value.baseY+(p.y-drag.value.startY)}; }
function onDragEnd(){ drag.value.active=false; }

/* Swipe mobile reale */
let touchDX=0,touchDY=0,sx=0,sy=0;
function onTouchStart(e){ const t=e.touches?.[0]; if(!t) return; sx=t.clientX; sy=t.clientY; touchDX=0; touchDY=0; }
function onTouchMove(e){ const t=e.touches?.[0]; if(!t) return; touchDX=t.clientX-sx; touchDY=t.clientY-sy; }
function onTouchEnd(){ if(Math.abs(touchDX)>Math.abs(touchDY)&&Math.abs(touchDX)>30){ if(touchDX<0) next(); else prev(); } }

/* Keyboard */
function onKey(e){ if(!lb.open) return; if(e.key==='ArrowRight') next(); else if(e.key==='ArrowLeft') prev(); else if(e.key==='Escape') closeLightbox(); }

/* Clipboard */
async function copyCurrentUrl(){ const url=images.value[lb.index]?.src||''; try{ await navigator.clipboard.writeText(url); }catch{} }

/* mount/unmount */
onMounted(()=>{ measureNavbar(); window.addEventListener('resize', measureNavbar); window.addEventListener('keydown', onKey); });
onBeforeUnmount(()=>{ window.removeEventListener('resize', measureNavbar); window.removeEventListener('keydown', onKey); });
</script>

<style scoped>
/* transizioni base */
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* nascondi scrollbar strip thumbs */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
