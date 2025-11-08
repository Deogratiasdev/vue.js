<template>
  <div class="app-shell">
    <div class="page-wrap">
      <RouterView v-slot="{ Component }">
        <Transition :name="transitionName">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </div>
    <MobileFooter v-if="showFooter" />
  </div>
  
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import MobileFooter from './components/MobileFooter.vue'

  const route = useRoute()
  const transitionName = ref<'slide-forward' | 'slide-back' | 'slide-up' | 'slide-down'>('slide-forward')
  let lastPos = (history.state && history.state.position) || 0
  const footerOrder = ['/dashboard','/notifications','/new','/teams','/settings']
  let lastPath = route.path

  const footerAllowed = ['/dashboard','/notifications','/teams','/settings']
  const showFooter = computed(() => footerAllowed.some(p => route.path.startsWith(p)))

  watch(
    () => route.fullPath,
    () => {
      const currentPath = route.path
      const prevPath = lastPath
      // Special vertical transitions for /new
      if (currentPath.startsWith('/new') && !prevPath.startsWith('/new')) {
        transitionName.value = 'slide-up'
        lastPath = currentPath
        return
      }
      if (prevPath.startsWith('/new') && !currentPath.startsWith('/new')) {
        transitionName.value = 'slide-down'
        lastPath = currentPath
        return
      }
      const inFooterNow = footerOrder.some(p => currentPath.startsWith(p))
      const inFooterPrev = footerOrder.some(p => prevPath.startsWith(p))
      if (inFooterNow && inFooterPrev) {
        const a = footerOrder.findIndex(p => prevPath.startsWith(p))
        const b = footerOrder.findIndex(p => currentPath.startsWith(p))
        if (a > -1 && b > -1) {
          transitionName.value = b >= a ? 'slide-forward' : 'slide-back'
          lastPath = currentPath
          return
        }
      }
      const pos = (history.state && history.state.position) || 0
      transitionName.value = pos >= lastPos ? 'slide-forward' : 'slide-back'
      lastPos = pos
      lastPath = currentPath
    }
  )
</script>

<style>
  .app-shell { min-height: 100vh; background: #000; }
  .page-wrap {
    position: relative;
    overflow: hidden;
    background: #000; /* avoid white flash between pages */
    min-height: calc(100vh - 74px);
    isolation: isolate;
  }

  /* Forward: droite -> gauche */
  .slide-forward-enter-active,
  .slide-forward-leave-active {
    transition: transform .6s cubic-bezier(0.22, 1, 0.36, 1), filter .6s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
    position: relative;
    backface-visibility: hidden;
  }
  .slide-forward-enter-active { z-index: 2; }
  .slide-forward-leave-active { z-index: 1; }
  .slide-forward-enter-active,
  .slide-forward-enter-from,
  .slide-forward-enter-to {
    position: absolute;
    inset: 0;
  }
  .slide-forward-enter-from {
    transform: translate3d(100%,0,0);
    box-shadow: inset 2px 0 0 rgba(249, 115, 22, 0.28);
  }
  .slide-forward-leave-from { filter: none; }
  .slide-forward-leave-to { transform: none; filter: grayscale(0.6) brightness(0.85); }

  /* Animated edge stripe (forward) */
  .slide-forward-enter-active::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, rgba(249,115,22,0.0), rgba(249,115,22,0.9), rgba(249,115,22,0.0));
    box-shadow: 0 0 12px rgba(249,115,22,0.45);
    opacity: 0.9;
    pointer-events: none;
    transform: translate3d(0,0,0);
  }
  .slide-forward-enter-to::after {
    opacity: 0;
    transition: opacity .25s ease .5s;
  }

  /* Back: gauche -> droite */
  .slide-back-enter-active,
  .slide-back-leave-active {
    transition: transform .6s cubic-bezier(0.22, 1, 0.36, 1), filter .6s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
    position: relative;
    backface-visibility: hidden;
  }
  .slide-back-enter-active { z-index: 2; }
  .slide-back-leave-active { z-index: 1; }
  .slide-back-enter-active,
  .slide-back-enter-from,
  .slide-back-enter-to {
    position: absolute;
    inset: 0;
  }
  .slide-back-enter-from {
    transform: translate3d(-100%,0,0);
    box-shadow: inset -2px 0 0 rgba(249, 115, 22, 0.24);
  }
  .slide-back-leave-from { filter: none; }
  .slide-back-leave-to { transform: none; filter: grayscale(0.6) brightness(0.85); }

  /* Up: bas -> haut (entrer /new) */
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: transform .6s cubic-bezier(0.22, 1, 0.36, 1), filter .6s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
    position: relative;
    backface-visibility: hidden;
  }
  .slide-up-enter-active { z-index: 2; }
  .slide-up-leave-active { z-index: 1; }
  .slide-up-enter-active,
  .slide-up-enter-from,
  .slide-up-enter-to { position: absolute; inset: 0; }
  .slide-up-enter-from { transform: translate3d(0, 100%, 0); box-shadow: inset 0 2px 0 rgba(249,115,22,0.28); }
  .slide-up-leave-from { filter: none; }
  .slide-up-leave-to { transform: none; filter: grayscale(0.6) brightness(0.85); }

  /* Down: haut -> bas (quitter /new) */
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: transform .6s cubic-bezier(0.22, 1, 0.36, 1), filter .6s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
    position: relative;
    backface-visibility: hidden;
  }
  .slide-down-enter-active { z-index: 2; }
  .slide-down-leave-active { z-index: 1; }
  .slide-down-enter-active,
  .slide-down-enter-from,
  .slide-down-enter-to { position: absolute; inset: 0; }
  .slide-down-enter-from { transform: translate3d(0, -100%, 0); box-shadow: inset 0 -2px 0 rgba(249,115,22,0.24); }
  .slide-down-leave-from { filter: none; }
  .slide-down-leave-to { transform: translate3d(0, 100%, 0); filter: grayscale(0.6) brightness(0.85); }

  /* Animated edge stripe (back) */
  .slide-back-enter-active::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, rgba(249,115,22,0.0), rgba(249,115,22,0.9), rgba(249,115,22,0.0));
    box-shadow: 0 0 12px rgba(249,115,22,0.45);
    opacity: 0.9;
    pointer-events: none;
    transform: translate3d(0,0,0);
  }
  .slide-back-enter-to::after {
    opacity: 0;
    transition: opacity .25s ease .5s;
  }

  /* Ensure routed views fill the container width to avoid seams */
  .page-wrap > * { width: 100%; display: block; }
</style>
