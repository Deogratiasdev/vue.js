<template>
  <section class="page">
    <main class="content">
      <h1 class="title">Paramètres</h1>

      <div class="grid">
        <div class="card profile">
          <h2>Profil</h2>
          <div class="row">
            <img v-if="user?.photoURL" :src="user.photoURL" alt="avatar" class="avatar" />
            <div class="cols">
              <label>Prénom</label>
              <input type="text" v-model="firstName" />
            </div>
            <div class="cols">
              <label>Nom</label>
              <input type="text" v-model="lastName" />
            </div>
          </div>
        </div>

        <div class="card">
          <h2>Langue</h2>
          <div class="row">
            <div class="language">
              <div class="select-wrap">
                <select v-model="language">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <small class="hint">Par défaut: Français. Vous pouvez changer la langue à tout moment.</small>
            </div>
          </div>
        </div>

        <div class="card">
          <h2>Notifications</h2>
          <div class="row toggles">
            <label class="toggle"><input type="checkbox" v-model="notificationsEnabled" /> Activer les notifications</label>
            <label class="toggle"><input type="checkbox" v-model="soundEnabled" /> Autoriser le son</label>
          </div>
        </div>

        <div class="card">
          <h2>Sécurité</h2>
          <div class="row">
            <p class="muted">Contrôles de sécurité à venir (ex: 2FA, sessions actives).</p>
          </div>
        </div>

        <div class="actions">
          <button class="btn logout" type="button" @click="logout">Se déconnecter</button>
        </div>
      </div>
    </main>
  </section>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'

const user = ref<User | null>(null)
const firstName = ref('')
const lastName = ref('')
const language = ref<'fr' | 'en' | 'es'>('fr')
const notificationsEnabled = ref(false)
const soundEnabled = ref(false)

onMounted(() => {
  onAuthStateChanged(auth, (u: User | null) => {
    user.value = u
    if (u?.displayName) {
      const parts = u.displayName.split(' ')
      firstName.value = parts[0] || ''
      lastName.value = parts.slice(1).join(' ') || ''
    }
  })
})

async function logout() {
  await signOut(auth)
}
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
.grid { display: grid; gap: 1rem; }
.card { border: 1px solid #1f2937; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)); border-radius: 1rem; padding: 1rem; }
.card h2 { font-size: 1rem; font-weight: 800; margin-bottom: .5rem; }
.muted { color: #9aa6b2; }
.row { display: grid; grid-auto-flow: column; align-items: center; gap: .75rem; }
.cols { display: grid; gap: .35rem; }
label { color: #b7c1cd; font-size: .9rem; }
input, select {
  width: 100%; appearance: none; border: 1px solid #293241; border-radius: .35rem;
  background: #0b1220; color: #e6edf3; padding: .8rem .9rem; outline: none;
}
.select-wrap { position: relative; }
.select-wrap::after {
  content: ''; position: absolute; pointer-events: none; right: .8rem; top: 50%; width: 8px; height: 8px; border-right: 2px solid #9aa6b2; border-bottom: 2px solid #9aa6b2; transform: translateY(-60%) rotate(45deg);
}
.avatar { width: 56px; height: 56px; border-radius: 999px; border: 1px solid #334155; }
.toggles { grid-auto-flow: row; justify-items: start; }
.toggle { display: inline-grid; grid-auto-flow: column; align-items: center; gap: .5rem; }
.actions { display: grid; justify-items: center; margin-top: .5rem; }
.btn.logout {
  appearance: none; border: 1px solid #334155; border-radius: .6rem; background: #111827; color: #e5e7eb; padding: .7rem 1rem; font-weight: 700;
}
@media (max-width: 640px) {
  .row { grid-auto-flow: row; justify-items: start; align-items: start; }
}
</style>
