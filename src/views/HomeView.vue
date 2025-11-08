<template>
  <section class="hero">
    <fieldset class="hero-box">
      <h1 class="title">Input Dev</h1>

      <h2 class="subtitle">Le backend invisible pour vos sites à formulaires ou à enregistrement d’informations client</h2>
      <p class="description">Collectez formulaires, réservations et emails sans base de données ni serveur.</p>

      <div class="auth">
        <template v-if="!user">
          <button
            type="button"
            class="btn-primary btn-google"
            @click="loginWithGoogle"
            :disabled="loading"
            :aria-busy="loading"
          >
            <svg class="g-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.78 6.053 29.136 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.68 15.108 19.001 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C33.78 6.053 29.136 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c4.958 0 9.534-1.897 12.989-4.993l-6-4.909C29.008 35.51 26.627 36 24 36c-5.202 0-9.62-3.322-11.281-7.957l-6.54 5.033C9.464 39.556 16.235 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.239-2.231 4.166-4.014 5.598l.003-.002 6 4.909C35.013 39.47 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"/>
            </svg>
            <span>{{ loading ? 'Connexion…' : 'Continuer avec Google' }}</span>
          </button>
          <p v-if="errorMsg" class="auth-error" role="alert">{{ errorMsg }}</p>
        </template>
        <template v-else>
          <div class="user-card">
            <img v-if="user.photoURL" :src="user.photoURL" alt="avatar" class="avatar" />
            <div class="user-meta">
              <strong>{{ user.displayName }}</strong>
              <small>{{ user.email }}</small>
            </div>
            <button type="button" class="btn-secondary" @click="logout">Se déconnecter</button>
          </div>
        </template>
      </div>

      
    </fieldset>
  </section>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { auth, googleProvider } from '../lib/firebase'
  import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, type User } from 'firebase/auth'
  import type { FirebaseError } from 'firebase/app'

  const router = useRouter()
  const user = ref<User | null>(null)
  const loading = ref(false)
  const errorMsg = ref('')

  onMounted(async () => {
    onAuthStateChanged(auth, (u: User | null) => {
      user.value = u
      if (u) {
        // Redirection sûre dès qu'on est authentifié
        router.replace('/dashboard')
      }
    })
    // Gérer un éventuel retour de signInWithRedirect
    try {
      const res = await getRedirectResult(auth)
      if (res?.user) {
        router.replace('/dashboard')
      }
    } catch {
      /* ignore */
    }
  })

  let inFlight = false
  type PopupAttemptResult = true | false | 'retry'
  const loginWithGoogle = async () => {
    if (inFlight || loading.value) return
    inFlight = true
    loading.value = true
    errorMsg.value = ''
    try {
      // Essaye d'abord le popup avec 2 tentatives si erreurs réseau transitoires
      const tryPopup = async (): Promise<PopupAttemptResult> => {
        try {
          await signInWithPopup(auth, googleProvider)
          return true
        } catch (e: unknown) {
          const code = (e as FirebaseError)?.code || ''
          // Si popup est bloqué, passer en redirect immédiatement
          if (code === 'auth/popup-blocked' || code === 'auth/popup-blocked-by-browser') return false
          if (code === 'auth/popup-closed-by-user') { errorMsg.value = 'Popup fermée. Réessayez.'; throw e }
          if (code === 'auth/network-request-failed') return 'retry'
          // autres erreurs, on remonte
          throw e
        }
      }

      let popupResult: PopupAttemptResult = await tryPopup()
      if (popupResult === 'retry') {
        await new Promise(r => setTimeout(r, 500))
        popupResult = await tryPopup()
      }
      if (popupResult === false) {
        // Fallback en redirect si popup bloqué
        await signInWithRedirect(auth, googleProvider)
        return
      }
      // Sinon, on sera redirigé par onAuthStateChanged
    } catch (e: unknown) {
      const code = (e as FirebaseError)?.code || ''
      if (!errorMsg.value) {
        errorMsg.value = code ? `Erreur (${code}). Réessayez.` : 'Erreur de connexion. Réessayez.'
      }
    } finally {
      loading.value = false
      inFlight = false
    }
  }

  const logout = async () => {
    await signOut(auth)
  }
</script>

<style scoped>
  .hero {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: flex-start; /* placer le contenu en haut */
    justify-content: center;
    padding: 3.5rem 1rem 2.5rem; /* plus d'espace et marge latérale sur mobile */
    background: #000; /* fond noir unique */
    color: #e6edf3;
  }

  .hero-box {
    width: 100%;
    max-width: 1100px; /* limite pour lisibilité tout en restant plein écran */
    margin: 0 auto;
    padding: 1rem 1.5rem 3rem;
    border: none;
    border-radius: 0;
    background: transparent;
    text-align: left;
  }

  /* rythme vertical: ajoute de l'espace entre les éléments successifs */
  .hero-box > * + * { margin-top: 1.1rem; }

  .title {
    margin: 0 0 1.6rem;
    font-size: clamp(2rem, 8.5vw, 3rem);
    line-height: 1.04;
    font-weight: 500;
    letter-spacing: .3px;
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
    left: 0;
    bottom: -10px;
    width: clamp(88px, 36vw, 160px);
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.8) 20%, rgba(249,115,22,0.95) 50%, rgba(249,115,22,0.8) 80%, rgba(249,115,22,0) 100%);
    box-shadow: 0 0 16px rgba(249,115,22,0.35);
  }

  /* icônes supprimées pour n'afficher qu'un seul titre */

  .subtitle {
    font-size: clamp(1.1rem, 2.8vw, 1.6rem);
    font-weight: 700;
    color: #d7dde6;
    line-height: 1.4;
    margin: 1rem 0 1.15rem;
  }

  .description {
    color: #b7c1cd;
    margin: 0 0 1.9rem;
    font-size: clamp(1rem, 2.2vw, 1.15rem);
    line-height: 1.6;
  }

  .auth { display: grid; place-items: center; margin-top: .5rem; }

  .user-card {
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .6rem .75rem;
    border: 1px solid #2a2a2a;
    border-radius: .75rem;
    background: rgba(255,255,255,0.03);
  }

  .avatar { width: 36px; height: 36px; border-radius: 999px; }
  .user-meta { display: flex; flex-direction: column; line-height: 1.15; }
  .user-meta small { color: #a7b0bc; }

  

  .btn-primary {
    appearance: none;
    border: 0;
    background: linear-gradient(135deg, #ea580c, #f97316, #fb7a1e);
    color: #0b1220;
    font-weight: 850;
    padding: clamp(1.05rem, 2.6vw, 1.3rem) clamp(1.1rem, 3.2vw, 1.7rem);
    border-radius: 1rem;
    cursor: pointer;
    transition: transform .06s ease, box-shadow .2s ease, filter .2s ease;
    box-shadow: 0 16px 36px rgba(234, 88, 12, 0.26);
    letter-spacing: .35px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .8rem;
    font-size: clamp(1.18rem, 2.8vw, 1.45rem);
  }

  .btn-google .g-icon { width: clamp(28px, 5vw, 40px); height: clamp(28px, 5vw, 40px); }

  .btn-secondary {
    appearance: none;
    border: 1px solid #475569;
    background: #1f2937;
    color: #e5e7eb;
    font-weight: 600;
    padding: .6rem .85rem;
    border-radius: .6rem;
    cursor: pointer;
    transition: background .2s ease;
  }

  .btn-primary:hover { filter: brightness(1.05); }
  .btn-primary:active { transform: translateY(1px); }
  .btn-secondary:hover { background: #111827; }

  /* Mobile-first affinement */
  @media (max-width: 640px) {
    .hero {
      padding: 2.2rem 1rem 6.5rem; /* réserve un footer plus grand */
      align-items: center; /* centre verticalement le contenu */
      justify-content: center;
    }
    .title { font-size: clamp(2.2rem, 10.5vw, 3.2rem); }
    .subtitle { font-size: clamp(1.15rem, 4.4vw, 1.4rem); }
    .description { font-size: clamp(1rem, 4vw, 1.1rem); }
    .auth {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 50;
      padding: 1rem 1rem calc(1.1rem + env(safe-area-inset-bottom));
      background: rgba(10, 12, 20, 0.75);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      border-top: 1px solid #1f2937;
    }
    .btn-primary { width: 100%; padding: 1.35rem 1.5rem; font-size: 1.34rem; }
  }
  .user-card { width: 100%; justify-content: space-between; }

  @media (min-width: 1024px) {
    .title { font-size: clamp(3rem, 6vw, 4.2rem); }
    .subtitle { font-size: clamp(1.2rem, 1.8vw, 1.6rem); }
    .description { font-size: clamp(1.05rem, 1.4vw, 1.2rem); }
    .btn-primary { font-size: clamp(1.05rem, 1.4vw, 1.2rem); padding: clamp(1rem, 1.6vw, 1.2rem) clamp(1.2rem, 2vw, 1.6rem); }
    .auth {
      position: fixed;
      right: 2rem;
      bottom: 2rem;
      z-index: 40;
      display: block;
      padding: 0;
      background: transparent;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      border-top: 0;
    }
  }
</style>
