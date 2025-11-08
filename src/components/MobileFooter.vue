<template>
  <nav class="mobile-nav">
    <RouterLink to="/dashboard" class="nav-btn" :class="{ 'is-active': isActive('/dashboard') }">
      <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10l9-7Z"/></svg>
      <span>Tableau</span>
    </RouterLink>
    <RouterLink to="/notifications" class="nav-btn" :class="{ 'is-active': isActive('/notifications') }">
      <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 22a1.5 1.5 0 0 0 1.5-1.5v-1.02a7.8 7.8 0 0 0 3.21-1.33l.84.49a1.5 1.5 0 0 0 2.05-.55l1.5-2.6a1.5 1.5 0 0 0-.55-2.05l-.86-.5a8.08 8.08 0 0 0 0-2.66l.86-.5a1.5 1.5 0 0 0 .55-2.05l-1.5-2.6a1.5 1.5 0 0 0-2.05-.55l-.84.49A7.8 7.8 0 0 0 13.5 4.5V3.5A1.5 1.5 0 0 0 12 2a1.5 1.5 0 0 0-1.5 1.5v1.02A7.8 7.8 0 0 0 7.29 6.35l-.84-.49a1.5 1.5 0 0 0-2.05.55l-1.5 2.6a1.5 1.5 0 0 0 .55 2.05l.86.5a8.08 8.08 0 0 0 0 2.66l-.86.5a1.5 1.5 0 0 0-.55 2.05l1.5 2.6a1.5 1.5 0 0 0 2.05.55l.84-.49a7.8 7.8 0 0 0 3.21 1.33v1.02A1.5 1.5 0 0 0 12 22Zm0-6.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"/></svg>
      <span>Notifications</span>
    </RouterLink>
    <RouterLink to="/new" class="nav-btn" aria-label="Nouveau site" :class="{ 'is-active': isActive('/new') }">
      <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 5a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H6a1 1 0 1 1 0-2h4V6a1 1 0 0 1 1-1Z"/></svg>
      <span>Créer une clé</span>
    </RouterLink>
    <RouterLink to="/teams" class="nav-btn" :class="{ 'is-active': isActive('/teams') }">
      <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM3 20a7 7 0 0 1 14 0v1H3v-1Zm18-9h-2V9h2V7h2v2h2v2h-2v2h-2v-2Z"/></svg>
      <span>Équipes</span>
    </RouterLink>
    <RouterLink to="/settings" class="nav-btn" :class="{ 'is-active': isActive('/settings') }">
      <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.14 12.94a7.49 7.49 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.56 7.56 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.56 7.56 0 0 0-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.05.31-.07.62-.07.94s.02.63.07.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.31.6.22l2.39-.96c.5.38 1.05.7 1.62.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .45-.18.5-.42l.36-2.54c.57-.24 1.12-.56 1.62-.94l 2.39.96c.22.09.47 0  0.6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"/></svg>
      <span>Paramètres</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.mobile-nav {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: .25rem;
  padding: .5rem calc(.85rem + env(safe-area-inset-left)) calc(.85rem + env(safe-area-inset-bottom)) calc(.85rem + env(safe-area-inset-right));
  background: rgba(10,12,20,0.75);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border-top: 0;
  z-index: 25;
}
.nav-btn {
  appearance: none; border: 0; background: transparent;
  color: #aeb6c2;
  display: grid; grid-auto-flow: row; justify-items: start; align-content: center;
  padding: .6rem .35rem;
  border-radius: .9rem;
  text-align: left;
}
.nav-btn .i { width: 22px; height: 22px; margin-bottom: .15rem; }
.nav-btn span {
  font-size: .72rem; margin-top: .25rem; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; max-width: 76px; display: block;
}
.nav-btn.is-active { color: #f97316; background: rgba(249,115,22,0.08); }
@media (min-width: 768px) {
  .nav-btn .i { width: 24px; height: 24px; }
  .nav-btn span { font-size: .78rem; }
}
@media (max-width: 640px) {
  .nav-btn {
    justify-items: center;
    text-align: center;
  }
}
</style>
