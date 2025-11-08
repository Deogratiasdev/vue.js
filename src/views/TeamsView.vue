<template>
  <section class="page">
    <main class="content">
      <h1 class="title">Équipes</h1>
      <div class="card">
        <p>Aucune équipe pour le moment.</p>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.page { min-height: 100%; background: #000; color: #e6edf3; }
.content { padding: 1rem; padding-bottom: 5rem; }
.title {
  font-size: clamp(1.2rem, 5vw, 1.6rem);
  font-weight: 500;
  text-align: center;
  letter-spacing: .3px;
  background: linear-gradient(135deg, #f59e0b, #f97316, #fb7a1e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 8px 30px rgba(249,115,22,0.12);
  position: relative;
  margin-bottom: 1rem;
}
.title::after {
  content: '';
  position: absolute;
  left: 50%; bottom: -8px; transform: translateX(-50%);
  width: clamp(88px, 36vw, 160px); height: 3px; border-radius: 999px;
  background: linear-gradient(90deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.8) 20%, rgba(249,115,22,0.95) 50%, rgba(249,115,22,0.8) 80%, rgba(249,115,22,0) 100%);
  box-shadow: 0 0 16px rgba(249,115,22,0.35);
}
.card { border: 1px solid #1f2937; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)); border-radius: 1rem; padding: 1rem; }
.card p { color: #b7c1cd; }
</style>
