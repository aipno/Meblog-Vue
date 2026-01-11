<script setup>
import {ref} from 'vue'
import {useMouse, useRafFn} from '@vueuse/core'

const {x, y} = useMouse()
const containerRef = ref(null)
const charRefs = new Map()

const line1 = "做自己的太阳".split('')
const line2 = "you don’t need to chase the light.".split('')

const setRef = (el, key) => {
  if (el) {
    charRefs.set(key, el)
  } else {
    charRefs.delete(key)
  }
}

const CONFIG = {
  minWeight: 200,
  maxWeight: 900,
  maxDist: 300,
}

useRafFn(() => {
  charRefs.forEach((el, key) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const charX = rect.left + rect.width / 2
    const charY = rect.top + rect.height / 2

    const dist = Math.sqrt(Math.pow(x.value - charX, 2) + Math.pow(y.value - charY, 2))

    let weight = CONFIG.minWeight
    if (dist < CONFIG.maxDist) {
      // Use a cosine interpolation for smooth bell curve shape
      // dist 0 -> factor 1
      // dist max -> factor 0
      const factor = Math.max(0, 1 - (dist / CONFIG.maxDist))
      // Apply easing (e.g., quadratic or cubic for sharper falloff)
      const eased = Math.pow(factor, 2.5)
      weight = CONFIG.minWeight + (CONFIG.maxWeight - CONFIG.minWeight) * eased
    }

    el.style.fontVariationSettings = `'wght' ${weight}`
    // Fallback for non-variable fonts
    el.style.fontWeight = Math.round(weight)
  })
})
</script>

<template>
  <div ref="containerRef"
       class="w-full min-h-[30vh] flex flex-col items-center justify-center overflow-hidden relative p-8 select-none">

    <div class="text-center font-['Roboto_Flex',sans-serif]">
      <!-- Line 1: Chinese -->
      <div class="flex justify-center flex-wrap mb-4">
        <span v-for="(char, index) in line1" :key="'l1' + index" :ref="(el) => setRef(el, 'l1' + index)"
              class="text-[6vw] md:text-[4vw] leading-none transition-colors duration-200"
              style="font-variation-settings: 'wght' 100; font-weight: 100;">
          {{ char }}
        </span>
      </div>

      <!-- Line 2: English -->
      <div class="flex justify-center flex-wrap">
        <span v-for="(char, index) in line2" :key="'l2' + index" :ref="(el) => setRef(el, 'l2' + index)"
              class="text-[3vw] md:text-[1.5vw] leading-none whitespace-pre"
              style="font-variation-settings: 'wght' 200; font-weight: 200;">
          {{ char }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the font family is applied correctly */
div {
  font-family: 'Roboto Flex', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
</style>
