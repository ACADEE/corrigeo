import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function Footer() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");

  useEffect(() => {
    fetch("/api/gemini-status")
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          setStatus("connected");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <footer className="h-12 bg-slate-900 border-t-4 border-slate-900 flex items-center justify-between px-8 shrink-0 text-white mt-auto">
      <div className="text-[10px] font-black tracking-widest uppercase text-slate-400">
        Corrigeo • propulsé par l'IA • Créé par <a href="https://www.acadee.fr" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">ACADEE</a>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
          Statut Gemini 3.1 Pro :
        </span>
        {status === "loading" && (
          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
            <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse"></span>
            Vérification...
          </span>
        )}
        {status === "connected" && (
          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-400">
            <CheckCircle2 className="h-3 w-3" />
            Connecté
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange-400">
            <AlertCircle className="h-3 w-3" />
            Non configuré
          </span>
        )}
      </div>
    </footer>
  );
}
