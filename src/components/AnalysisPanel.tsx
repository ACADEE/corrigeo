import { AnalysisResponse, ExercisesResponse } from "@/types";
import { useState } from "react";
import { Loader2, Printer } from "lucide-react";

export function AnalysisPanel({ data, onSaveAdjustments }: { data: AnalysisResponse, onSaveAdjustments?: (text: string) => void }) {
  const [extractedText, setExtractedText] = useState(data.extracted_text || "");
  const [exercisesRes, setExercisesRes] = useState<ExercisesResponse | null>(null);
  const [generatingExercises, setGeneratingExercises] = useState(false);
  const [exercisesError, setExercisesError] = useState<string | null>(null);

  const handleGenerateExercises = async () => {
    setGeneratingExercises(true);
    setExercisesError(null);
    try {
      const res = await fetch("/api/generate-exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          improvement_priorities: data.improvement_priorities,
          class_name: data.student_detected?.class_name
        })
      });
      if (!res.ok) throw new Error("Erreur de génération des exercices");
      const generated = await res.json();
      setExercisesRes(generated);
    } catch (err: any) {
      setExercisesError(err.message);
    } finally {
      setGeneratingExercises(false);
    }
  };

  const handlePrintExercises = () => {
    if (!exercisesRes) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let html = `
      <html>
        <head>
          <title>Exercices de remédiation</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; color: #1e293b; }
            h1 { font-size: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 2rem; }
            .lesson { background: #f8fafc; padding: 1.5rem; border-left: 4px solid #10b981; margin-bottom: 2rem; border-radius: 0.5rem; }
            .lesson-title { font-size: 0.85rem; font-weight: bold; color: #10b981; text-transform: uppercase; margin-bottom: 0.5rem; }
            .lesson-content { font-size: 0.95rem; line-height: 1.6; }
            .exercise { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px dashed #cbd5e1; }
            .objective { font-size: 0.75rem; font-weight: bold; color: #9a3412; background: #ffedd5; display: inline-block; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin-bottom: 0.5rem; }
            .instruction { font-size: 1rem; font-weight: 500; margin-bottom: 2rem; line-height: 1.5; }
            .lines { border-bottom: 1px solid #e2e8f0; margin-top: 2rem; }
            .expected { font-size: 0.85rem; color: #059669; font-style: italic; margin-top: 1rem; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>Exercices de remédiation - ${data.student_detected?.first_name || 'Élève'} ${data.student_detected?.last_name || ''}</h1>
          
          <div class="lesson">
            <div class="lesson-title">Leçon du jour</div>
            <div class="lesson-content">${exercisesRes.lesson.replace(/\n/g, '<br/>')}</div>
          </div>
    `;
    
    exercisesRes.exercises.forEach((ex, i) => {
      html += `
        <div class="exercise">
          <div class="objective">Objectif : ${ex.priority_reference}</div>
          <div class="instruction">${i + 1}. ${ex.instruction}</div>
          <div class="lines"></div>
          <div class="lines"></div>
          <!-- <div class="expected">Attendu: ${ex.expected_answer}</div> -->
        </div>
      `;
    });
    
    html += `
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const renderSentenceWithHighlight = (sentence: string | undefined, original: string) => {
    if (!sentence) return null;
    if (!original) return `"${sentence}"`;
    const parts = sentence.split(original);
    if (parts.length === 1) return `"${sentence}"`;
    return (
      <>
        "
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="text-red-600 underline font-black">{original}</span>
            )}
          </span>
        ))}
        "
      </>
    );
  };

  return (
    <section className="w-full bg-white flex flex-col shrink-0 print:block print:w-full">
      <div className="flex-1 overflow-visible xl:overflow-y-auto print:overflow-visible p-4 sm:p-6 space-y-8">
        
        {/* Analyse IA Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <h2 className="text-sm font-bold text-slate-800">Analyse IA</h2>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-600">Synthèse Pédagogique</h3>
            <p className="text-xs leading-relaxed text-slate-600 bg-emerald-50 p-4 rounded-lg">
              {data.global_assessment?.summary_teacher || "Aucun commentaire fourni."}
            </p>
          </div>

          {(data.strengths || []).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest border-b-2 border-slate-100 pb-1">Points Forts</h3>
              <ul className="space-y-2">
                {(data.strengths || []).map((str, i) => (
                  <li key={i} className="flex items-start gap-3 text-[11px] font-bold text-slate-800">
                    <span className="text-green-500 mt-px">●</span> {str}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(data.improvement_priorities || []).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest border-b-2 border-slate-100 pb-1">Priorités de Progrès</h3>
              <div className="space-y-2">
                {(data.improvement_priorities || []).map((imp, i) => (
                  <div key={i} className="p-3 border-l-4 border-orange-400 bg-orange-50 text-[11px] leading-snug text-slate-800 font-medium">
                    {imp}
                  </div>
                ))}
              </div>
              <div className="pt-2 print:hidden">
                {!exercisesRes && !generatingExercises && (
                  <button 
                    onClick={handleGenerateExercises}
                    className="w-full py-2 bg-orange-100 text-orange-800 font-bold text-xs rounded-lg hover:bg-orange-200 transition-all border border-orange-200 flex items-center justify-center gap-2 shadow-[2px_2px_0px_transparent] hover:shadow-[2px_2px_0px_#ea580c] active:translate-y-0.5 active:shadow-none"
                  >
                    Générer 10 exercices ciblés
                  </button>
                )}
                {generatingExercises && (
                  <div className="w-full py-2 bg-slate-50 flex items-center justify-center gap-2 text-slate-600 text-xs font-bold border border-slate-200 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération en cours...
                  </div>
                )}
                {exercisesError && (
                  <div className="text-red-500 text-xs font-bold mt-2">
                    {exercisesError}
                  </div>
                )}
              </div>
              {exercisesRes && (
                <div className="mt-6 pt-4 border-t-2 border-slate-100 print:hidden relative isolate">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Exercices Proposés</h3>
                    <button onClick={handlePrintExercises} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-bold hover:bg-slate-200 transition-colors shadow-sm">
                      <Printer className="w-3 h-3" /> Imprimer.pdf
                    </button>
                  </div>
                  
                  <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4 font-serif text-sm leading-relaxed text-slate-700">
                    <div className="font-bold font-sans text-xs uppercase tracking-widest text-slate-500 mb-2">Leçon du jour</div>
                    {exercisesRes.lesson}
                  </div>

                  <div className="space-y-4">
                    {exercisesRes.exercises.map((ex, i) => (
                      <div key={i} className="bg-white border text-xs border-slate-200 rounded p-4 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-800 font-bold text-[9px] uppercase tracking-wider rounded border border-orange-100">
                            {ex.priority_reference}
                          </span>
                          <span className="text-slate-300 font-black text-lg leading-none">{(i+1).toString().padStart(2, '0')}</span>
                        </div>
                        <div className="font-medium text-slate-800 mb-3">{ex.instruction}</div>
                        <div className="italic text-emerald-600 font-serif border-l-2 border-emerald-200 pl-3 py-1 text-[11px] bg-emerald-50 rounded-r">
                          Attendu : {ex.expected_answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(data.detected_errors || []).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest border-b-2 border-slate-100 pb-1">Erreurs Repérées</h3>
              <div className="space-y-3">
                {(data.detected_errors || []).map((err, i) => (
                  <div key={i} className="text-[11px] border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    {err.sentence_context && (
                      <div className="p-3 bg-slate-50 border-b border-slate-200 text-slate-700 italic font-serif">
                        {renderSentenceWithHighlight(err.sentence_context, err.original)}
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex justify-between font-bold mb-2 items-start gap-2">
                        <span className="text-red-600">{err.original || "?"}</span>
                        <span className="text-emerald-600 whitespace-nowrap">→ {err.suggestion || "?"}</span>
                      </div>
                      <p className="text-slate-600 mt-1 font-medium leading-relaxed">{err.explanation}</p>
                      <span className="inline-block mt-3 px-2 py-1 bg-slate-100 text-slate-500 text-[9px] uppercase tracking-widest font-black rounded">
                        {err.type || "Général"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
            <h3 className="text-xs font-bold text-slate-800">Feedback Élève</h3>
            <p className="text-xs italic font-serif leading-relaxed text-slate-600 border-l-2 border-slate-300 pl-3">
              "{data.global_assessment?.summary_student || "Aucun feedback rédigé."}"
            </p>
          </div>
        </div>

      </div>

      {/* Action bar bottom right */}
      <div className="p-4 bg-white border-t border-slate-200 flex gap-2 shrink-0 print:hidden justify-end">
        <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-sm hover:bg-emerald-700 transition-all">
          Valider la note
        </button>
      </div>
    </section>
  );
}
