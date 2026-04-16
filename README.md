# Samassa Technologie - Gestion Documentaire & Services IT

Application web complète pour Samassa Technologie, combinant une vitrine publique professionnelle et un système de gestion documentaire avancé.

## 🎯 Fonctionnalités Principales

### Vitrine Publique
- **Présentation de l'entreprise** : Samassa Technologie, basée au Grand Marché de Kayes
- **Services détaillés** :
  - Maintenance informatique
  - Sécurisation des systèmes
  - Installation et configuration
  - Solutions digitales
  - Gestion documentaire
  - Assistance et conseil
- **Informations de contact** : Téléphone, email, localisation
- **Design élégant** : Couleur bleu #2E8FB5, typographie soignée

### Tableau de Bord Authentifié
- **Authentification sécurisée** : OAuth Manus
- **Gestion des clients** : Création et gestion des clients récurrents
- **Gestion documentaire** : Accès complet aux documents

### Types de Documents Supportés

#### 1. **Factures** (FAC-2026-001, FAC-2026-002, ...)
- Numérotation automatique
- Gestion des clients
- Montant avec TVA configurable
- Export PDF professionnel
- Statuts : Brouillon, Envoyée, Payée

#### 2. **Devis** (DEV-2026-001, DEV-2026-002, ...)
- Numérotation automatique
- Validité configurable
- Montant avec TVA
- Export PDF
- Statuts : Brouillon, Envoyé, Accepté, Refusé

#### 3. **Reçus** (REC-2026-001, REC-2026-002, ...)
- Numérotation automatique
- Modes de paiement : Espèces, Chèque, Virement, Carte, Mobile Money
- Export PDF
- Statuts : Brouillon, Émis, Annulé

#### 4. **Fiches d'Intervention** (INT-2026-001, INT-2026-002, ...)
- Numérotation automatique
- Informations du technicien
- Durée et description détaillée
- Montant optionnel
- Export PDF
- Statuts : Brouillon, Complétée, Facturée, Annulée

### Fonctionnalités Avancées

#### Export PDF
- Templates professionnels aux couleurs de Samassa
- En-têtes avec logo et informations de l'entreprise
- Mise en page optimisée pour impression
- Support complet des caractères spéciaux (français)

#### Mode PWA (Progressive Web App)
- **Installation sur l'écran d'accueil** : Fonctionne comme une app native
- **Mode hors ligne** : Accès aux données en cache
- **Service Worker** : Synchronisation automatique des données
- **Support iOS** : Compatible avec Safari sur iPhone/iPad

#### Recherche et Filtres
- Recherche par client, numéro de document, date
- Filtrage par type de document
- Filtrage par statut
- Tri par date, montant, client

## 🚀 Démarrage Rapide

### Installation

```bash
# Cloner le repository
git clone https://github.com/yourusername/samassa-technologie.git
cd samassa-technologie

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos paramètres
```

### Développement

```bash
# Démarrer le serveur de développement
pnpm dev

# Le site sera accessible à http://localhost:5173
# L'API sera accessible à http://localhost:3000
```

### Build pour la Production

```bash
# Compiler le projet
pnpm build

# Tester la build
pnpm preview
```

## 📋 Configuration Requise

### Variables d'Environnement

```env
# Base de données
DATABASE_URL=mysql://user:password@host:port/database

# Authentification
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name

# APIs
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key

# Analytics
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
```

## 🏗️ Architecture

### Stack Technologique

**Frontend**
- React 19 + TypeScript
- Tailwind CSS 4 pour le styling
- tRPC pour la communication avec le backend
- Wouter pour le routing
- Lucide React pour les icônes
- jsPDF + html2canvas pour l'export PDF

**Backend**
- Express.js pour le serveur
- tRPC pour les procédures RPC
- Drizzle ORM pour la base de données
- MySQL/TiDB pour la persistance

**Infrastructure**
- Service Worker pour PWA
- Manifest.json pour l'installation mobile
- OAuth Manus pour l'authentification

### Structure des Fichiers

```
samassa-technologie/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Pages (Home, Dashboard, Formulaires)
│   │   ├── components/       # Composants réutilisables
│   │   ├── hooks/            # Hooks personnalisés (usePWA)
│   │   ├── lib/              # Utilitaires (tRPC, PDF)
│   │   └── App.tsx           # Routeur principal
│   ├── public/               # Assets statiques
│   │   ├── manifest.json     # Configuration PWA
│   │   └── sw.js             # Service Worker
│   └── index.html            # HTML principal
├── server/                    # Backend Express
│   ├── routers.ts            # Procédures tRPC
│   ├── db.ts                 # Helpers de base de données
│   └── _core/                # Infrastructure (Auth, OAuth, etc.)
├── drizzle/                  # Schéma de base de données
│   └── schema.ts             # Tables et types
├── shared/                   # Code partagé
└── DEPLOYMENT.md             # Guide de déploiement
```

## 🎨 Design & Branding

### Couleurs Principales
- **Bleu Samassa** : #2E8FB5
- **Blanc** : #FFFFFF
- **Gris clair** : #F5F5F5
- **Gris foncé** : #333333

### Typographie
- **Titres** : Poppins (300, 400, 500, 600, 700)
- **Corps** : Inter (400, 500, 600, 700)

### Logo
- Logo Samassa Technologie avec icônes d'ordinateur et imprimante
- Couleur : Bleu #2E8FB5
- Tagline : "Tout pour l'Informatique"

## 📱 Utilisation Mobile

### Installation PWA

**Sur Android**
1. Ouvrez le site dans Chrome
2. Cliquez sur le menu (⋮) → "Installer l'app"
3. Confirmez l'installation

**Sur iOS**
1. Ouvrez le site dans Safari
2. Cliquez sur le bouton Partage
3. Sélectionnez "Sur l'écran d'accueil"

### Mode Hors Ligne
- Les données en cache restent accessibles
- Les formulaires peuvent être remplis hors ligne
- La synchronisation se fait automatiquement lors de la reconnexion

## 🔐 Sécurité

- **Authentification OAuth** : Manus OAuth pour la sécurité
- **Procédures protégées** : Accès au tableau de bord réservé aux utilisateurs authentifiés
- **Chiffrement des données** : JWT pour les sessions
- **HTTPS obligatoire** : Toutes les connexions sont chiffrées

## 📊 Base de Données

### Tables Principales

**users**
- id, openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn

**clients**
- id, userId, name, email, phone, address, city, country, taxId, createdAt, updatedAt

**invoices**
- id, userId, clientId, documentNumber, issueDate, dueDate, description, amount, taxRate, status, notes, createdAt, updatedAt

**quotes**
- id, userId, clientId, documentNumber, issueDate, validUntil, description, amount, taxRate, status, notes, createdAt, updatedAt

**receipts**
- id, userId, clientId, documentNumber, issueDate, description, amount, paymentMethod, status, notes, createdAt, updatedAt

**interventions**
- id, userId, clientId, documentNumber, issueDate, interventionDate, description, technician, duration, amount, status, notes, createdAt, updatedAt

**document_sequences**
- id, userId, documentType, lastNumber, createdAt, updatedAt

## 🧪 Tests

```bash
# Exécuter les tests Vitest
pnpm test

# Exécuter les tests avec couverture
pnpm test -- --coverage
```

## 📦 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées de déploiement sur Netlify, Vercel ou Render.

## 🤝 Contribution

Les contributions sont bienvenues ! Veuillez :

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- **Email** : samassatechnologie10@gmail.com
- **Téléphone** : +223 77 29 19 31
- **Localisation** : Grand Marché de Kayes, Kayes, Mali

## 🙏 Remerciements

Merci à tous ceux qui ont contribué au développement de cette application !

---

**Samassa Technologie** - Tout pour l'Informatique
