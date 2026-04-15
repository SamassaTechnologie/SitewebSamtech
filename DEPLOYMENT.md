# Déploiement - Samassa Technologie

Ce projet peut être déployé en mode **statique** (frontend seulement) ou **full-stack** (frontend + serveur Express).

## 1) Netlify (frontend statique)

> Recommandé si vous utilisez seulement la gestion locale dans le navigateur.

- Build command: `pnpm build`
- Publish directory: `dist/public`

### Redirection SPA
Créer `public/_redirects` avec:

```txt
/* /index.html 200
```

## 2) Vercel (frontend statique)

- Framework preset: `Vite`
- Build command: `pnpm build`
- Output directory: `dist/public`

## 3) Render (full-stack)

> Recommandé si vous voulez servir l'app avec Node.js.

- Environment: `Node`
- Build command: `pnpm install && pnpm build`
- Start command: `pnpm start`
- Node version: 22+

## Variables d'environnement

Pour la version actuelle, aucune variable obligatoire n'est requise pour démarrer.

## Vérifications après déploiement

- La page d'accueil s'affiche.
- La création de facture/devis/réçu/intervention fonctionne.
- Le PDF se télécharge correctement.
- L'app est installable comme PWA.
