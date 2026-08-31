# Corrigeo 📝✨

Corrigeo est une application web innovante propulsée par l'Intelligence Artificielle qui permet aux enseignants d'automatiser et d'améliorer la correction de copies manuscrites. 

En un seul scan, l'application extrait le texte de la copie, analyse la qualité de la rédaction selon un barème personnalisable (orthographe, grammaire, vocabulaire, etc.), et génère automatiquement des exercices de remédiation sur-mesure pour aider l'élève à progresser.

## 🚀 Fonctionnalités principales

- **Scan & Extraction (OCR)** : Importez l'image d'une copie manuscrite, Corrigeo se charge d'extraire le texte avec précision.
- **Analyse Multicritère** : L'IA évalue la copie selon plusieurs critères configurables (Maîtrise de la langue, Cohérence, Vocabulaire, etc.).
- **Retours Détaillés** : L'application souligne les erreurs, propose des corrections et donne des explications pédagogiques claires.
- **Exercices Sur-Mesure** : Génération automatique d'une leçon ciblée et d'exercices de remédiation adaptés aux lacunes spécifiques repérées dans la copie.
- **Interface Ergonomique & Responsive** : Un espace de travail pensé pour la productivité, divisé entre la visionneuse de document (scan/OCR) et le panneau d'analyse/notation.
- **Impression PDF** : Exportez facilement la copie corrigée ou les exercices de remédiation au format PDF pour les distribuer aux élèves.

## 🛠️ Technologies utilisées

- **Frontend** : React 18, Vite, Tailwind CSS, Lucide React (Icônes), React Resizable Panels
- **Backend** : Node.js, Express
- **Intelligence Artificielle** : **Google Gemini 3.1 Pro** via le SDK `@google/genai` (pour l'extraction de texte, la notation et la génération d'exercices).

## ⚙️ Installation & Configuration

### Prérequis

- [Node.js](https://nodejs.org/) installé sur votre machine.
- Une clé d'API Google Gemini.

### Obtenir une clé API Gemini

L'application s'appuie sur le modèle de langage avancé de Google (Gemini 3.1 Pro). Vous devez créer une clé API pour utiliser les fonctionnalités d'analyse.
Vous pouvez générer votre clé API gratuitement sur Google AI Studio :
👉 **[Obtenir une clé API Gemini](https://aistudio.google.com/apikey?hl=fr)**

### Lancer l'application en local

1. **Cloner le dépôt** (ou télécharger les fichiers sources).
2. **Installer les dépendances** :
   ```bash
   npm install
   ```
3. **Configurer les variables d'environnement** :
   Copiez le fichier `.env.example` vers `.env` et ajoutez votre clé API Gemini :
   ```bash
   cp .env.example .env
   ```
   Éditez ensuite le fichier `.env` :
   ```env
   GEMINI_API_KEY="VOTRE_CLE_API_GEMINI"
   ```
4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`.

## 🏗️ Structure du projet

- `/src` : Code source frontend (React)
  - `/components` : Composants UI (LandingPage, EvaluationBoard, AnalysisPanel, etc.)
  - `types.ts` : Définitions des types TypeScript
- `/server.ts` : Serveur Express backend responsable de la communication avec l'API Gemini.
- `package.json` : Dépendances et scripts du projet.

## 📄 Crédits

Corrigeo est propulsé par l'IA et créé par [ACADEE](https://www.acadee.fr).
