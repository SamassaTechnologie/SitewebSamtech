# Samassa Technologie

Site web vitrine + application de gestion documentaire pour **Samassa Technologie** (Grand Marché de Kayes).

## Fonctionnalités livrées

- Présentation claire de l'entreprise et de ses services.
- Coordonnées complètes (adresse, téléphone, email).
- Module de gestion des documents :
  - Factures
  - Devis
  - Réçus
  - Fiches d'intervention
- Numérotation automatique par type de document.
- Tableau de bord (nombre de documents + montant total).
- Export PDF de chaque document.
- Stockage local (navigateur) pour usage hors ligne.
- Installation PWA (manifest + service worker).

## Stack

- React + TypeScript + Vite
- Express (serveur Node)
- jsPDF pour l'export PDF

## Lancer en local

```bash
pnpm install
pnpm dev
```

- Frontend (Vite) : `http://localhost:5173`
- API Health : `http://localhost:3000/api/health`

## Build & démarrage production

```bash
pnpm build
pnpm start
```

Le build frontend est généré dans `dist/public` et servi par Express.

## Déploiement

Consultez `DEPLOYMENT.md` pour Netlify, Vercel et Render.

## Informations entreprise

- **Nom** : Samassa Technologie
- **Adresse** : Grand Marché de Kayes, près du 1er arrondissement de police
- **Téléphone** : 00223 77 29 19 31
- **Email** : samassatechnologie10@gmail.com
- **Mission** : offrir des solutions informatiques fiables, modernes et accessibles.
