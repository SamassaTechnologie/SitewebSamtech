# Guide de Déploiement - Samassa Technologie

Ce guide explique comment déployer l'application Samassa Technologie sur Netlify, Vercel ou Render.

## Prérequis

- Un compte sur la plateforme de déploiement (Netlify, Vercel ou Render)
- Accès au repository GitHub du projet
- Variables d'environnement configurées

## Variables d'Environnement Requises

Avant le déploiement, configurez les variables d'environnement suivantes :

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## Déploiement sur Netlify

### Option 1 : Via l'interface Netlify

1. **Connectez-vous à Netlify** : https://app.netlify.com
2. **Cliquez sur "New site from Git"**
3. **Sélectionnez GitHub** et autorisez l'accès
4. **Choisissez le repository** `samassa-technologie`
5. **Configurez les paramètres de build** :
   - **Build command** : `pnpm build`
   - **Publish directory** : `dist`
   - **Node version** : 22.x
6. **Ajoutez les variables d'environnement** dans Settings → Environment
7. **Cliquez sur "Deploy site"**

### Option 2 : Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod --build
```

## Déploiement sur Vercel

### Option 1 : Via l'interface Vercel

1. **Allez sur Vercel** : https://vercel.com
2. **Cliquez sur "New Project"**
3. **Importez le repository GitHub**
4. **Configurez les paramètres** :
   - **Framework** : Vite
   - **Build command** : `pnpm build`
   - **Output directory** : `dist`
5. **Ajoutez les variables d'environnement** dans Settings → Environment Variables
6. **Cliquez sur "Deploy"**

### Option 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel --prod
```

## Déploiement sur Render

### Configuration via l'interface Render

1. **Allez sur Render** : https://render.com
2. **Cliquez sur "New +"** → **"Web Service"**
3. **Connectez votre repository GitHub**
4. **Configurez les paramètres** :
   - **Name** : `samassa-technologie`
   - **Environment** : Node
   - **Build command** : `pnpm install && pnpm build`
   - **Start command** : `pnpm start`
   - **Node version** : 22
5. **Ajoutez les variables d'environnement** dans Environment
6. **Cliquez sur "Create Web Service"**

## Configuration de la Base de Données

### Pour Netlify/Vercel (Serverless)

Ces plateformes ne supportent pas les applications Node.js full-stack. Vous devez :

1. **Utiliser une base de données externe** (TiDB Cloud, PlanetScale, etc.)
2. **Déployer le serveur séparément** sur Render ou Railway
3. **Configurer CORS** pour la communication frontend-backend

### Pour Render (Full-Stack)

Render supporte les applications full-stack. Vous pouvez :

1. **Créer une base de données PostgreSQL** sur Render
2. **Connecter le service web** à la base de données
3. **Configurer les variables d'environnement** automatiquement

## Déploiement Recommandé

Pour cette application, nous recommandons :

### Option A : Render (Recommandé)
- **Avantages** : Support full-stack complet, base de données intégrée, prix abordable
- **Déploiement** : Voir section "Déploiement sur Render"

### Option B : Netlify + Railway
- **Frontend** : Netlify (gratuit avec limites)
- **Backend** : Railway (base de données + serveur Node.js)
- **Communication** : Via API REST

### Option C : Vercel + Railway
- **Frontend** : Vercel (gratuit avec limites)
- **Backend** : Railway (base de données + serveur Node.js)
- **Communication** : Via API REST

## Vérification Post-Déploiement

Après le déploiement, vérifiez :

1. **La page d'accueil** s'affiche correctement
2. **L'authentification** fonctionne
3. **Le tableau de bord** est accessible après connexion
4. **La création de documents** fonctionne
5. **L'export PDF** génère des fichiers valides
6. **Le mode PWA** fonctionne (installable sur mobile)

## Troubleshooting

### Erreur : "DATABASE_URL not found"
- Vérifiez que la variable d'environnement `DATABASE_URL` est configurée
- Assurez-vous que la base de données est accessible

### Erreur : "OAuth callback failed"
- Vérifiez que `VITE_OAUTH_PORTAL_URL` est correctement configuré
- Assurez-vous que le domaine de déploiement est autorisé dans la configuration OAuth

### Erreur : "Build failed"
- Vérifiez les logs de build
- Assurez-vous que toutes les dépendances sont installées
- Vérifiez que Node.js version 22+ est utilisée

## Support

Pour plus d'informations :
- Documentation Netlify : https://docs.netlify.com
- Documentation Vercel : https://vercel.com/docs
- Documentation Render : https://render.com/docs
- Documentation du projet : Voir README.md
