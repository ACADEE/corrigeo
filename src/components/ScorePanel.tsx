import { AnalysisResponse } from "@/types";

export function ScorePanel({ data }: { data: AnalysisResponse }) {
  return (
    <section className="w-full bg-white xl:border-b-4 border-b-4 xl:border-b-0 border-slate-200 flex flex-col p-6 shrink-0 print:block print:w-full">
      <div className="mb-8">
        <div className="flex items-end justify-between mb-4">
          <span className="text-sm font-bold text-slate-600">Note Générale</span>
          <div className="text-5xl font-bold text-emerald-500 leading-none">
            {data.global_assessment?.score ?? "?"}<span className="text-2xl text-slate-400 font-normal">/{data.global_assessment?.score_max ?? "20"}</span>
            <span className="text-xl ml-2 text-emerald-500">({data.global_assessment?.level || "-"})</span>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 rounded-full" 
            style={{ width: `${Math.min(((data.global_assessment?.score ?? 0) / (data.global_assessment?.score_max ?? 20)) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-sm font-bold text-slate-800">Détail par critère</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-6">
          {(data.criteria || []).map((c, i) => {
            const ratio = (c.score ?? 0) / (c.score_max ?? 1);
            const colors = ['bg-orange-400', 'bg-pink-500', 'bg-blue-400', 'bg-purple-500', 'bg-emerald-400', 'bg-amber-500'];
            const barColor = colors[i % colors.length];
            return (
              <div key={i}>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-2">
                  <span className="truncate pr-2">{c.name}</span>
                  <span className="font-bold whitespace-nowrap">{c.score ?? 0}/{c.score_max ?? 1}</span>
                </div>
                <div className="h-1.5 bg-slate-100 w-full rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${barColor} rounded-full`} 
                    style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${(data.ocr_quality?.confidence || 0) < 0.85 ? 'bg-orange-400' : 'bg-emerald-500'}`}></div>
            <span>Qualité du scan: {((data.ocr_quality?.confidence || 0) * 100).toFixed(0)}%</span>
          </div>
        </div>
        
        {data.teacher_validation_required && (
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-700 flex items-center justify-center">
            Validation du professeur requise
          </div>
        )}
      </div>
    </section>
  );
}
