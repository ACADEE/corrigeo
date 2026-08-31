import { useState } from "react";
import { ArrowRight, CheckCircle, BrainCircuit, FileText, Target, Zap, LayoutDashboard, Quote, Play, X } from "lucide-react";

export function LandingPage({ onStart }: { onStart: () => void }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-800">
                CORRIGEO<span className="text-emerald-500">.</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Fonctionnalités</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Comment ça marche</a>
              <button 
                onClick={onStart}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Connexion
              </button>
            </div>
            <button 
              onClick={onStart}
              className="md:hidden px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors"
            >
              Démarrer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-200">
              <Zap className="w-3 h-3" />
              Nouveau modèle IA
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
              Corrigez vos copies en un instant. Gagnez des heures.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed font-medium">
              L'assistant pédagogique qui lit, comprend et évalue les rédactions manuscrites. Barème sur-mesure, commentaires constructifs et exercices de remédiation ciblés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={onStart}
                className="px-8 py-4 bg-emerald-600 text-white rounded-xl text-lg font-bold hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Démarrer une correction
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setShowVideo(true)}
                className="px-8 py-4 bg-white text-slate-700 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all shadow-sm border border-slate-200 flex items-center justify-center gap-2 group/demo"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover/demo:scale-110 transition-transform">
                  <Play className="w-4 h-4 text-emerald-600 fill-emerald-600 ml-0.5" />
                </div>
                Voir une démo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-indigo-500 rounded-2xl md:rounded-3xl blur-2xl opacity-20 transform -rotate-6"></div>
            <img 
              src="https://res.cloudinary.com/dkrhrbf1n/image/upload/v1782122108/corrigeo_prof_niwtrj.png" 
              alt="Un enseignant satisfait utilisant Corrigeo sur son ordinateur, souriant devant ses résultats" 
              className="relative rounded-2xl md:rounded-3xl shadow-2xl border border-white/50 w-full object-cover aspect-[4/3]"
            />
            
            {/* Overlay stats card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 hidden sm:flex">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mt-1 shrink-0">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temps gagné</div>
                <div className="text-2xl font-black text-slate-800">12h/mois</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="border-y border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Technologie propulsée par :</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="text-2xl font-black font-serif italic text-slate-800">Google Gemini</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">
            Tout ce dont vous avez besoin pour évaluer vos élèves.
          </h2>
          <p className="text-lg text-slate-600">
            Une suite d'outils complète pensée pour faciliter votre quotidien et accompagner la progression de vos classes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 border border-indigo-100">
              <BrainCircuit className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Analyse Automatique OCR</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Extraction du texte manuscrit à partir d'une simple photo et analyse sémantique du contenu pour repérer les fautes et le sens.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 border border-amber-100">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Scoring & Barème Personnalisé</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Application stricte de votre propre barème de correction (grammaire, imagination, style...) avec note globale et détail par critère.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6 border border-sky-100">
              <FileText className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Réponse & Feedback Constructifs</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Génération de commentaires pédagogiques bienveillants adaptés à l'élève et synthèse détaillée réservée à l'enseignant.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-4">
                La plus-value pédagogique
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Génération d'exercices sur-mesure</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Chaque copie révèle des lacunes spécifiques. L'IA génère instantanément 10 exercices de remédiation parfaitement ciblés sur les erreurs réelles de l'élève (orthographe ciblée, conjugaison, etc.), prêts à être imprimés en PDF.
              </p>
              <button onClick={onStart} className="text-emerald-600 font-bold flex items-center gap-2 hover:text-emerald-700 transition-colors">
                Générer mon premier lot <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner">
              <div className="space-y-3">
                <div className="bg-white p-3 rounded shadow-sm border-l-2 border-emerald-500 text-xs">
                  <div className="font-bold text-slate-800 mb-1">Objectif : Accords du participe passé</div>
                  <div className="text-slate-600">Réécrivez la phrase : "Elles ont (manger) des pommes qu'elles ont (cueillir)."</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border-l-2 border-emerald-500 text-xs">
                  <div className="font-bold text-slate-800 mb-1">Objectif : Richesse du vocabulaire</div>
                  <div className="text-slate-600">Remplacez le verbe "faire" par un verbe plus précis : "Il a fait une maison."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-slate-300">
              Trois étapes simples pour transformer votre pile de copies en insights pédagogiques.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl font-black text-emerald-400 mb-6 shadow-lg border border-slate-700">1</div>
              <h3 className="text-xl font-bold mb-3">Téléchargez</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Photographiez la copie manuscrite ou téléchargez un PDF. Ajustez votre barème personnalisé dans les réglages si besoin.</p>
            </div>
            <div className="flex flex-col items-center text-center relative">
              <div className="hidden md:block absolute top-8 left-0 w-full h-[2px] bg-gradient-to-r from-slate-700 to-emerald-700/50 -z-10"></div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-900/50">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">L'IA Analyse</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Les modèles d'IA procèdent à la transcription, notent selon vos critères, et identifient les erreurs majeures en quelques secondes.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="hidden md:block absolute top-8 right-1/2 w-1/2 h-[2px] bg-gradient-to-r from-emerald-700/50 to-slate-700 -z-10"></div>
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl font-black text-emerald-400 mb-6 shadow-lg border border-slate-700">3</div>
              <h3 className="text-xl font-bold mb-3">Validez et Imprimez</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Revoyez les notes suggérées, lisez les synthèses, et imprimez les 10 exercices de remédiation personnalisés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">
              Ils ont retrouvé leurs week-ends
            </h2>
            <p className="text-lg text-slate-600">
              Découvrez comment Corrigeo transforme le quotidien des enseignants.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
              <Quote className="w-10 h-10 text-emerald-100 absolute top-6 right-6" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=sophie&backgroundColor=e2e8f0" alt="Sophie P." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Sophie M.</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Professeur de Lettres</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm italic">
                "Je gagne environ 3h par paquet de 30 copies. Ce que je préfère, ce sont les exercices générés sur-mesure pour chaque élève. Je n'ai plus qu'à les imprimer, c'est une plus-value incroyable."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
              <Quote className="w-10 h-10 text-emerald-100 absolute top-6 right-6" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=marc&backgroundColor=e2e8f0" alt="Marc L." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Marc D.</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Professeur des Écoles</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm italic">
                "Ce qui m'impressionne le plus, c'est la pertinence du barème. L'IA applique mes critères de notation avec une rigueur absolue. Mes élèves apprécient les retours détaillés et bienveillants."
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
              <Quote className="w-10 h-10 text-emerald-100 absolute top-6 right-6" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=claire&backgroundColor=e2e8f0" alt="Claire T." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Claire T.</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Professeur de Collège</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-sm italic">
                "La reconnaissance de l'écriture manuscrite est bluffante, même sur les copies difficiles. Les suggestions de correction orthographique ciblent systématiquement les points abordés en classe."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6">
          Prêt à retrouver du temps libre ?
        </h2>
        <p className="text-xl text-slate-600 mb-10">
          Rejoignez la nouvelle génération d'enseignants qui utilisent l'IA de manière éthique et pédagogique.
        </p>
        <button 
          onClick={onStart}
          className="px-10 py-5 bg-emerald-600 text-white rounded-xl text-xl font-bold hover:bg-emerald-700 hover:-translate-y-1 active:translate-y-0 transition-all shadow-xl hover:shadow-2xl hover:shadow-emerald-600/30 w-full sm:w-auto"
        >
          Créer un compte gratuit
        </button>
        <p className="mt-4 text-sm text-slate-500">Aucune carte de crédit requise. 14 jours d'essai gratuit.</p>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-black tracking-tight text-slate-800">CORRIGEO.</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Corrigeo • propulsé par l'IA • Créé par <a href="https://www.acadee.fr" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-bold">ACADEE</a>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8" onClick={() => setShowVideo(false)}>
          <div className="w-full max-w-5xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white font-bold tracking-widest text-sm flex items-center gap-2 transition-colors"
            >
              FERMER
              <X className="w-5 h-5" />
            </button>
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/-K-sZmnpoIc?autoplay=1" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
