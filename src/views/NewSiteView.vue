<template>
  <section class="new-site">
    <main class="content">
      <h1 class="title">Nouveau site</h1>
      <form class="form" @submit.prevent>
        <div class="field">
          <label for="site-name" class="lbl">
            <span class="lbl-head">
              <span class="step">1</span>
              <svg class="lbl-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14l-6-3-6 3V5Z"/></svg>
            </span>
            <span class="lbl-text">Nom du site</span>
          </label>
          <input id="site-name" v-model="siteName" type="text" placeholder="Ex: Mon super site" maxlength="15" :aria-invalid="!!siteNameError" autofocus />
          <p class="hint">C’est le nom du site auquel appartiennent les clients qui seront déposés ici.</p>
          <p v-if="siteNameError" class="error">{{ siteNameError }}</p>
        </div>

        <div class="field">
          <div class="lbl domains-head">
            <span class="lbl-head">
              <span class="step">2</span>
              <svg class="lbl-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M3 5h18v14H3V5Zm2 2v10h14V7H5Zm2 2h4v2H7V9Zm0 4h6v2H7v-2Z"/></svg>
            </span>
            <span class="lbl-text">Domaines autorisés</span>
          </div>
          <p class="hint">
            Toute requête provenant d’un autre domaine que ceux listés sera bloquée.
            Format: sans http/https, sans slash final. Sous‑domaines autorisés. Exemple: <code>exemple.com</code>, <code>app.exemple.com</code>, <code>localhost</code>, <code>localhost:5173</code>.
          </p>
          <div class="domains">
            <div class="domain-row" v-for="(d, idx) in domains" :key="idx">
              <div class="input-wrap" :class="{ locked: d.locked }">
                <span class="beacon" :class="{ ok: isValidDomain(d.value), locked: d.locked }" aria-hidden="true"></span>
                <input :id="`domain-${idx}`" v-model="d.value" type="text" :disabled="d.locked" :aria-invalid="!isValidDomain(d.value) && !d.locked"
                  @keydown.enter.prevent="enterLock(idx)"
                  placeholder="ex: exemple.com" :ref="el => (domainInputs[idx] = el as HTMLInputElement)" />
                <span class="icons">
                  <button v-if="!d.locked" type="button" class="icon-btn enter" :disabled="!isValidDomain(d.value)" @click="enterLock(idx)" :aria-label="`Valider (Entrée) ${d.value}`">
                    <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 7h-2v6H8.83l2.58-2.59L10 9l-5 5 5 5 1.41-1.41L8.83 15H19a2 2 0 0 0 2-2V7Z"/></svg>
                  </button>
                  <button v-if="!d.locked" type="button" class="icon-btn lock" :disabled="!isValidDomain(d.value)" @click="lockDomain(idx)" :aria-label="`Valider ${d.value}`">
                    <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>
                  </button>
                  <button v-else type="button" class="icon-btn edit" @click="unlockAndFocus(idx)" :disabled="isLocalhost(d.value)" :aria-label="`Modifier ${d.value}`">
                    <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18-11.5c0-.4-.16-.78-.44-1.06l-2.25-2.25a1.5 1.5 0 0 0-2.12 0l-1.83 1.83 3.75 3.75 1.89-1.89c.28-.28.56-.66.56-1.06Z"/></svg>
                  </button>
                  <button type="button" class="icon-btn trash" @click="removeDomain(idx)" :disabled="isLocalhost(d.value)" :aria-label="`Supprimer ${d.value}`">
                    <svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 3h6a1 1 0 0 1 1 1v1h4v2h-1v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4V5h4V4a1 1 0 0 1 1-1Zm1 4v10h2V7h-2Zm4 0v10h2V7h-2Z"/></svg>
                  </button>
                </span>
              </div>
              <p v-if="domainError(d) && !d.locked" class="error">{{ domainError(d) }}</p>
            </div>
            <div class="domains-actions">
              <button type="button" class="big-plus" @click="addDomain" aria-label="Ajouter un domaine">+</button>
            </div>
          </div>
        </div>

        <div class="field">
          <label for="site-type" class="lbl">
            <span class="lbl-head">
              <span class="step">3</span>
              <svg class="lbl-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M4 4h7v7H4V4Zm0 9h7v7H4v-7Zm9-9h7v7h-7V4Zm0 9h7v7h-7v-7Z"/></svg>
            </span>
            <span class="lbl-text">Type de site</span>
          </label>
          <div class="dropdown" :class="{ open: typeOpen }">
            <button type="button" class="dropdown-trigger" @click="toggleType" aria-haspopup="listbox" :aria-expanded="typeOpen">
              <span class="selected">{{ typeLabel(siteType) }}</span>
              <svg class="caret" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
            </button>
            <ul v-show="typeOpen" class="dropdown-menu" role="listbox">
              <li v-for="opt in siteTypeOptions" :key="opt.value" role="option"
                  :aria-selected="opt.value===siteType"
                  class="option" :class="{ selected: opt.value===siteType }"
                  @click="selectType(opt.value)">
                <span>{{ opt.label }}</span>
                <svg v-if="opt.value===siteType" class="check" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>
              </li>
            </ul>
          </div>
          <p class="hint">
            Le type (vitrine, réservation, landing…) est indicatif: tout dépend de votre formulaire.
            Le SDK lit automatiquement les champs de votre formulaire et enregistre leurs valeurs.
            Seule contrainte: prévoir un champ <strong>email</strong> (obligatoire) pour identifier vos clients.
          </p>
        </div>
        <div class="actions">
          <button type="button" class="btn back" @click="goBack">Retour</button>
          <button type="button" class="btn save" @click="goBack">Enregistrer</button>
        </div>
      </form>
    </main>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'

type SiteType = 'formulaire' | 'vitrine' | 'reservation' | 'landing'
type DomainEntry = { value: string; locked: boolean }

function enterLock(index: number) {
  const d = domains.value[index]
  if (!d || d.locked) return
  if (!isValidDomain(d.value)) return
  lockDomain(index)
}

function goBack() {
  router.back()
}

function isLocalhost(v: string): boolean {
  return /^localhost(?::\d{1,5})?$/.test((v || '').trim())
}

function removeDomain(index: number) {
  const d = domains.value[index]
  if (!d) return
  if (isLocalhost(d.value)) return // ne pas supprimer localhost
  domains.value.splice(index, 1)
  // S'assurer qu'il reste toujours localhost présent
  const hasLocalhost = domains.value.some(x => isLocalhost(x.value))
  if (!hasLocalhost) domains.value.unshift({ value: 'localhost', locked: true })
}

const siteName = ref('')
const domains = ref<DomainEntry[]>([{ value: 'localhost', locked: true }])
const siteType = ref<SiteType>('formulaire')
const router = useRouter()

const siteNameError = computed(() => {
  const name = (siteName.value || '').trim()
  if (!name) return ''
  if (/^[0-9]/.test(name)) return 'Le nom ne doit pas commencer par un chiffre.'
  if (name.length > 15) return 'Le nom ne doit pas dépasser 15 caractères.'
  return ''
})

const domainInputs = ref<HTMLInputElement[]>([])

const typeOpen = ref(false)
const siteTypeOptions: Array<{ value: SiteType; label: string }> = [
  { value: 'formulaire', label: 'Formulaire' },
  { value: 'vitrine', label: 'Vitrine' },
  { value: 'reservation', label: 'Réservation' },
  { value: 'landing', label: 'Landing page' },
]
function typeLabel(v: SiteType) {
  const found = siteTypeOptions.find(o => o.value === v)
  return found ? found.label : v
}
function toggleType() {
  typeOpen.value = !typeOpen.value
}
function selectType(v: SiteType) {
  siteType.value = v
  typeOpen.value = false
}

function addDomain() {
  domains.value.push({ value: '', locked: true })
}

function lockDomain(index: number) {
  const d = domains.value[index]
  if (!d) return
  d.value = d.value.trim()
  if (!d.value) return
  d.locked = true
}

function unlockAndFocus(index: number) {
  const d = domains.value[index]
  if (!d) return
  if (isLocalhost(d.value)) return
  d.locked = false
  nextTick(() => {
    const el = domainInputs.value[index]
    if (el) { el.focus(); el.select() }
  })
}

function isValidDomain(v: string): boolean {
  const value = (v || '').trim()
  if (!value) return false
  // Reject schemes or slashes
  if (/^https?:\/\//i.test(value) || /\//.test(value)) return false
  // Allow localhost with optional port
  if (/^localhost(?::\d{1,5})?$/.test(value)) return true
  // Domain with subdomains and TLD, optional port
  const domainRe = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?$/
  return domainRe.test(value)
}

function domainError(d: DomainEntry): string {
  const v = (d.value || '').trim()
  if (!v) return 'Ce domaine est requis.'
  if (/^https?:\/\//i.test(v) || /\//.test(v)) return 'Ne pas inclure http/https ni de slash.'
  if (/^localhost(?::\d{1,5})?$/.test(v)) return ''
  const domainRe = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?$/
  if (!domainRe.test(v)) return 'Domaine invalide. Ex: exemple.com, app.exemple.com'
  return ''
}

</script>

<style scoped>
.new-site { min-height: 100vh; background: #000; color: #e6edf3; }
.content { padding: 1rem 1rem 1.5rem; }
.title {
  font-size: clamp(1.5rem, 7vw, 2rem);
  font-weight: 500;
  margin: .35rem 0 1.2rem;
  letter-spacing: .3px;
  text-align: center;
  background: linear-gradient(135deg, #f59e0b, #f97316, #fb7a1e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 8px 30px rgba(249,115,22,0.12);
  position: relative;
}
.title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: clamp(88px, 36vw, 160px);
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.8) 20%, rgba(249,115,22,0.95) 50%, rgba(249,115,22,0.8) 80%, rgba(249,115,22,0) 100%);
  box-shadow: 0 0 16px rgba(249,115,22,0.35);
}

.form { display: grid; gap: 1.1rem; }
.field { display: grid; gap: .6rem; }
.lbl { display: grid; grid-auto-flow: row; align-items: start; justify-items: start; gap: .35rem; }
.lbl-head { display: inline-grid; grid-auto-flow: column; align-items: center; gap: .6rem; }
.lbl-text { font-size: clamp(1.18rem, 5vw, 1.38rem); font-weight: 400; color: #e6edf3; letter-spacing: .2px; border-bottom: 1px solid #2f3b4a; padding-bottom: .2rem; }
.lbl-icon { width: 24px; height: 24px; color: #f97316; }
.step { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 999px; border: 1px solid rgba(249,115,22,0.7); color: #f97316; font-size: .9rem; }
.hint { margin-top: -.15rem; color: #9aa6b2; font-size: .85rem; line-height: 1.45; }

input, select {
  width: 100%;
  appearance: none; border: 1px solid #293241; border-radius: .35rem;
  background: #0b1220; color: #e6edf3;
  padding: .95rem 1.1rem;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}
input::placeholder { color: #8b95a3; }
select { background-image: none; font-size: clamp(.98rem, 3.8vw, 1.02rem); }
.select-wrap { position: relative; border-radius: .5rem; }
.select-wrap::before {
  content: ''; position: absolute; inset: 0; border-radius: .5rem; pointer-events: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0));
}
.select-wrap::after {
  content: ''; position: absolute; pointer-events: none;
  right: .9rem; top: 50%; width: 10px; height: 10px; border-right: 2px solid #9aa6b2; border-bottom: 2px solid #9aa6b2; transform: translateY(-60%) rotate(45deg);
}
input:hover, select:hover { border-color: #334155; }
input:focus, select:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.18); }
.select-wrap:focus-within::after { border-right-color: #f97316; border-bottom-color: #f97316; }

.domains { display: grid; gap: .6rem; }
.domains-head { display: grid; grid-auto-flow: row; align-items: start; justify-items: start; gap: .35rem; }
.big-plus {
  appearance: none; border: 1px solid rgba(249,115,22,0.5); background: rgba(249,115,22,0.08);
  color: #f97316; width: 36px; height: 36px; border-radius: .6rem; font-size: 1.2rem; line-height: 1;
  display: grid; place-items: center;
}
.add-inline { appearance: none; border: 0; background: transparent; color: #f97316; font-size: .9rem; }

.domain-row { display: grid; }
.input-wrap { position: relative; display: block; }
.input-wrap input { padding-left: 1.6rem; padding-right: 6.2rem; }
.beacon { position: absolute; left: .6rem; width: .6rem; height: .6rem; border-radius: 999px; background: #8b95a3; box-shadow: 0 0 0 0 rgba(139,149,163,0.0); transition: background .2s ease, box-shadow .2s ease; }
.beacon.ok { background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.12); }
.beacon.locked { background: #64748b; box-shadow: none; }
.input-wrap input[disabled] { cursor: default; }
.input-wrap.locked input {
  background: #0e1624; color: #9aa6b2; border-color: #1f2a38;
}
.icons { position: absolute; right: .25rem; top: 50%; transform: translateY(-50%); display: inline-flex; align-items: center; gap: .1rem; padding-left: .25rem; }
.icon-btn { appearance: none; border: 0; background: transparent; color: #9aa6b2; display: grid; place-items: center; padding: .3rem; }
.icon-btn .i { width: 18px; height: 18px; }
.icon-btn.lock { color: #22c55e; }
.icon-btn.edit { color: #aeb6c2; }
.icon-btn[disabled] { opacity: .5; pointer-events: none; }

.error { color: #fca5a5; font-size: .82rem; margin-top: .3rem; }

/* Footer action buttons */
.actions {
  display: flex; align-items: center; gap: .8rem;
  margin-top: 1.2rem;
}
.btn {
  appearance: none; border: 0; border-radius: .7rem; padding: .78rem 1rem;
  font-weight: 600; font-size: .98rem; line-height: 1;
  transition: transform .06s ease, box-shadow .2s ease, opacity .2s ease, filter .2s ease, background .2s ease, border-color .2s ease;
}
.btn.back {
  background: rgba(17,24,39,0.9);
  color: #d1d5db;
  border: 1px solid #293241;
}
.btn.back:hover { border-color: #334155; color: #e5e7eb; }
.btn.back:active { transform: translateY(1px); }
.btn.save {
  background: linear-gradient(135deg, #ea580c, #f97316, #fb7a1e);
  color: #0b1220;
  box-shadow: 0 12px 26px rgba(249,115,22,0.2);
  opacity: .9;
}
.btn.save:hover { box-shadow: 0 14px 30px rgba(249,115,22,0.24); }
.btn.save:active { transform: translateY(1px); box-shadow: 0 8px 20px rgba(249,115,22,0.18); }
.btn.save:disabled { filter: grayscale(.25); opacity: .7; cursor: not-allowed; }

/* Custom dropdown */
.dropdown { position: relative; display: grid; align-content: start; }
.dropdown-trigger {
  width: 100%;
  display: grid; grid-template-columns: 1fr auto; align-items: center; gap: .6rem;
  background: #0b1220; color: #e6edf3; border: 1px solid #293241; border-radius: .5rem;
  padding: .95rem 1.1rem; text-align: left;
}
.dropdown.open .dropdown-trigger { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.18); }
.dropdown .selected { font-size: clamp(.98rem, 3.8vw, 1.02rem); }
.dropdown .caret { width: 18px; height: 18px; color: #9aa6b2; transition: transform .2s ease, color .2s ease; }
.dropdown.open .caret { transform: rotate(180deg); color: #f97316; }
.dropdown-menu {
  position: absolute; left: 0; right: 0; top: calc(100% + .4rem);
  background: #0b1220; border: 1px solid #293241; border-radius: .6rem;
  box-shadow: 0 14px 30px rgba(0,0,0,0.35);
  padding: .3rem; z-index: 10;
}
.dropdown.open .dropdown-menu { position: static; top: auto; box-shadow: 0 10px 24px rgba(0,0,0,0.28); margin-top: .4rem; }
.dropdown-menu .option {
  display: grid; grid-template-columns: 1fr auto; align-items: center;
  padding: .7rem .8rem; border-radius: .5rem; color: #c3ccd8;
}
.dropdown-menu .option:hover { background: rgba(255,255,255,0.04); color: #e6edf3; }
.dropdown-menu .option.selected { background: rgba(249,115,22,0.08); color: #f97316; }
.dropdown-menu .option .check { width: 18px; height: 18px; }

 
</style>
