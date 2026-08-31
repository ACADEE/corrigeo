import React, { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { AnalysisResponse } from "@/types";

interface NewCorrectionFormProps {
  onEvaluationComplete: (data: AnalysisResponse, fileDataUrls: string[]) => void;
}

export function NewCorrectionForm({ onEvaluationComplete }: NewCorrectionFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    studentName: "",
    className: "",
    date: new Date().toISOString().split('T')[0],
    topic: "",
    level: "3e",
    gradingScale: "20"
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analyse en cours...",
    "Extraction du texte (OCR)...",
    "Évaluation du contenu...",
    "Recherche des erreurs...",
    "Génération de la synthèse...",
    "Finalisation des résultats..."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError("Veuillez sélectionner au moins un fichier PDF ou image.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(curr => Math.min(curr + 1, loadingMessages.length - 1));
    }, 4500);

    const form = new FormData();
    selectedFiles.forEach(file => form.append("files", file));
    form.append("level", formData.level);
    form.append("topic", formData.topic);
    form.append("gradingScale", formData.gradingScale);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: form
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "L'analyse a échoué. Veuillez réessayer.");
      }
      
      let analysisData: AnalysisResponse;
      try {
        const text = await response.text();
        analysisData = JSON.parse(text);
      } catch (e: any) {
        console.error("Erreur de parsing de la réponse:", e);
        throw new Error("L'IA n'a pas renvoyé une réponse valide.");
      }
      
      // Merge detected info with manually entered info
      analysisData.student_detected = {
        first_name: formData.studentName || analysisData.student_detected?.first_name || "",
        last_name: analysisData.student_detected?.last_name || "", 
        class_name: formData.className || analysisData.student_detected?.class_name || "",
        date: formData.date || analysisData.student_detected?.date || "",
      };

      // Read files to data URLs for the viewer
      const fileUrls = await Promise.all(selectedFiles.map(file => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      })));
      
      onEvaluationComplete(analysisData, fileUrls);
      
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue est survenue.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
      setError(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0px_#000] p-6 sm:p-10">
        <div className="mb-8 border-b-4 border-slate-900 pb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">Nouvelle Correction</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Analyse Assistée par l'Intelligence Artificielle</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-700" htmlFor="studentName">Élève (Optionnel)</label>
              <input 
                id="studentName" 
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-900 font-bold focus:outline-none focus:bg-white transition-colors"
                placeholder="Nom Prénom" 
                value={formData.studentName}
                onChange={e => setFormData({...formData, studentName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-700" htmlFor="className">Classe (Optionnel)</label>
              <input 
                id="className" 
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-900 font-bold focus:outline-none focus:bg-white transition-colors"
                placeholder="Ex: 3ème B" 
                value={formData.className}
                onChange={e => setFormData({...formData, className: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-700" htmlFor="date">Date</label>
              <input 
                id="date" 
                type="date"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-900 font-bold focus:outline-none focus:bg-white transition-colors"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-700" htmlFor="level">Niveau</label>
              <select 
                id="level"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-900 font-bold focus:outline-none focus:bg-white transition-colors appearance-none"
                value={formData.level} 
                onChange={(e) => setFormData({...formData, level: e.target.value})}
              >
                <option value="CM2">CM2</option>
                <option value="6e">6ème</option>
                <option value="5e">5ème</option>
                <option value="4e">4ème</option>
                <option value="3e">3ème</option>
                <option value="2nde">Seconde</option>
                <option value="1ere">Première</option>
                <option value="Terminale">Terminale</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-700" htmlFor="topic">Sujet de la rédaction</label>
              <input 
                id="topic" 
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-900 font-bold focus:outline-none focus:bg-white transition-colors"
                placeholder="Thème ou consigne" 
                value={formData.topic}
                onChange={e => setFormData({...formData, topic: e.target.value})}
              />
            </div>
          </div>

          <div 
            className={`border-4 border-dashed border-slate-300 p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFiles.length > 0 ? 'border-indigo-600 bg-indigo-50' : 'hover:border-slate-500 hover:bg-slate-50'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              multiple
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,image/*" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFiles(Array.from(e.target.files));
                  setError(null);
                }
              }}
            />
            <UploadCloud className={`h-12 w-12 mb-4 ${selectedFiles.length > 0 ? 'text-indigo-600' : 'text-slate-400'}`} />
            {selectedFiles.length > 0 ? (
              <div className="text-center">
                <p className="font-black text-slate-900">{selectedFiles.length} fichier(s) sélectionné(s)</p>
                <div className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider flex flex-col gap-1">
                  {selectedFiles.map((f, i) => (
                    <span key={i}>{f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-black text-slate-900 uppercase">Importer la rédaction (PDF ou Images)</p>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Glissez-déposez ou cliquez pour parcourir. Vous pouvez sélectionner plusieurs fichiers.</p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-500 flex items-center justify-center">
              <p className="text-sm font-bold text-red-700 uppercase tracking-wider">{error}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || selectedFiles.length === 0}
            className="w-full py-4 bg-indigo-600 border-4 border-slate-900 text-white font-black uppercase tracking-widest shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#000] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {loadingMessages[loadingStep]}
              </>
            ) : "Lancer l'analyse"}
          </button>
        </form>
      </div>
    </div>
  );
}
