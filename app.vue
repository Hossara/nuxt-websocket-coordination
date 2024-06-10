<script setup lang="ts">
import { subtle, randomUUID, getRandomValues } from "uncrypto";
 
const state = useSharedState<{[key: string]: {x: number, y: number}}>()


const me = useState(() => randomUUID())

const handleUpdate = async (event: TouchEvent | MouseEvent) => {
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  if(clientX && clientY) {
    state.value[me.value] = {x: clientX, y: clientY}
  }
}
</script>

<template>
  <div 
    id="mouse_section"
    @mousemove.passive="handleUpdate"
    @mouseenter="handleUpdate"
    @touchend="handleUpdate"
    @touchmove="handleUpdate">
    <svg>
      <defs><symbol viewBox="0 0 256 256" id="ph-cursor-light"><path fill="currentColor" d="M166.59 134.1a1.91 1.91 0 0 1-.55-1.79a2 2 0 0 1 1.08-1.42l46.25-17.76l.24-.1A14 14 0 0 0 212.38 87L52.29 34.7A13.95 13.95 0 0 0 34.7 52.29L87 212.38a13.82 13.82 0 0 0 12.6 9.6h.69a13.84 13.84 0 0 0 12.71-8.37a2 2 0 0 0 .1-.24l17.76-46.25a2 2 0 0 1 3.21-.53l51.31 51.31a14 14 0 0 0 19.8 0l12.69-12.69a14 14 0 0 0 0-19.8Zm42.82 62.63l-12.68 12.68a2 2 0 0 1-2.83 0l-51.31-51.31a14 14 0 0 0-22.74 4.32a2 2 0 0 0-.1.24L102 208.91a2 2 0 0 1-3.61-.26L46.11 48.57a1.87 1.87 0 0 1 .47-2a1.92 1.92 0 0 1 1.35-.57a2.2 2.2 0 0 1 .64.1l160.08 52.28a2 2 0 0 1 .26 3.61l-46.25 17.76l-.24.1a14 14 0 0 0-4.32 22.74l51.31 51.31a2 2 0 0 1 0 2.83"></path></symbol></defs>
    </svg>
    {{ state }}

    <svg 
      v-for="{x, y}, id in state" 
      :key="id" height="24" width="24"
      :style="{ left: x, top: y, color: colorHash(id).hex }">
      <use xlink:href="#ph-cursor-light"/>
    </svg>
  </div>
</template>

<style>
body {
  width: 100%;
  margin: 0;
}

html, body {
  height: 100dvh;
}

#mouse_section {
  height: 100dvh;
  width: 100%;
}

svg {
  position: absolute;
}
</style>