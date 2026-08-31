import { GraduationCap, Settings } from "lucide-react";

export function Header({ onOpenSettings }: { onOpenSettings?: () => void }) {
  return (
    <header className="h-20 bg-white border-b-4 border-slate-900 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-8">
        <h1 className="text-3xl font-black tracking-tighter">CORRIGEO<span className="text-indigo-600">.</span></h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest hidden sm:block">
          Assistant Pédagogique IA
        </div>
        {onOpenSettings && (
          <button 
            onClick={onOpenSettings}
            className="p-2 border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-100 transition-colors text-slate-600"
            title="Paramètres d'évaluation"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
