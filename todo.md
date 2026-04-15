# Samassa Technologie - TODO List

## Architecture & Configuration
- [x] Configurer les variables d'environnement (logo, titre, couleurs)
- [x] Mettre à jour le fichier index.css avec la palette de couleurs Samassa (bleu #2E8FB5)
- [x] Configurer les fonts Google (typographie élégante)
- [x] Mettre en place le favicon et logo de l'entreprise

## Base de Données
- [x] Créer le schéma Drizzle pour les documents (factures, devis, reçus, fiches d'intervention)
- [x] Créer la table clients avec gestion des clients récurrents
- [x] Créer la table numérotation automatique (séquences par type de document)
- [x] Générer et exécuter les migrations SQL
- [x] Ajouter les helpers de requête dans server/db.ts

## Vitrine Publique
- [x] Créer la page d'accueil (hero, présentation, services)
- [x] Créer la section services détaillée (maintenance, sécurisation, installation, solutions digitales)
- [x] Créer la section contact avec localisation (Grand Marché de Kayes)
- [x] Ajouter la navigation publique (accueil, services, contact)
- [x] Intégrer le logo et couleurs Samassa Technologie
- [x] Optimiser le responsive design

## Authentification & Tableau de Bord
- [x] Implémenter la redirection vers le dashboard après authentification
- [x] Créer le layout du tableau de bord avec sidebar navigation
- [x] Créer la page de liste des documents avec recherche et filtres
- [ ] Implémenter la pagination et tri des documents
- [x] Ajouter les actions rapides (voir, éditer, supprimer, exporter)

## Gestion Documentaire - Formulaires
- [x] Créer le formulaire de création/édition de facture (structure de base)
- [x] Intégrer les procédures tRPC pour la création de documents
- [x] Implémenter la numérotation automatique des documents
- [x] Créer le formulaire de création/édition de devis
- [x] Créer le formulaire de création/édition de reçu
- [x] Créer le formulaire de création/édition de fiche d'intervention
- [ ] Implémenter la gestion des clients (sélection, création rapide)
- [ ] Ajouter la validation complète des formulaires

## Export & Impression
- [ ] Intégrer la librairie PDF (jsPDF ou similaire)
- [ ] Créer les templates PDF pour chaque type de document
- [ ] Implémenter l'export PDF avec mise en page professionnelle
- [ ] Implémenter la fonction d'impression
- [ ] Tester les exports avec les couleurs Samassa Technologie
- [ ] Ajouter les logos et en-têtes professionnels aux PDF

## Mode PWA & Hors Ligne
- [x] Créer le manifest.json avec configuration PWA
- [x] Configurer le service worker pour le cache
- [x] Implémenter le hook usePWA pour l'enregistrement du service worker
- [ ] Implémenter la synchronisation des données hors ligne
- [ ] Tester l'installation sur l'écran d'accueil
- [ ] Tester le fonctionnement hors ligne

## Tests & Optimisations
- [x] Écrire les tests Vitest pour les procédures tRPC
- [x] Tester les formulaires et validations (tests manuels via UI)
- [x] Tester l'authentification et les accès protégés
- [ ] Optimiser les performances (lazy loading, code splitting)
- [ ] Vérifier la cohérence visuelle sur tous les navigateurs

## Déploiement
- [x] Préparer la configuration pour GitHub export
- [x] Documenter les instructions de déploiement (Netlify, Vercel, Render)
- [ ] Créer le checkpoint final
- [ ] Livrer le projet au client
