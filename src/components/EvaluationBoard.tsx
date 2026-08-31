import { AnalysisResponse } from "@/types";
import { ScorePanel } from "./ScorePanel";
import { DocumentViewer } from "./DocumentViewer";
import { AnalysisPanel } from "./AnalysisPanel";
import { AlertCircle, ChevronLeft, Settings } from "lucide-react";
import { Footer } from "./Footer";
import { useState, useEffect, useRef } from "react";

interface EvaluationBoardProps {
  data: AnalysisResponse;
  fileUrls: string[];
  onBack: () => void;
  onOpenSettings?: () => void;
}

export function EvaluationBoard({ data, fileUrls, onBack, onOpenSettings }: EvaluationBoardProps) {
  const [leftWidth, setLeftWidth] = useState(33.33); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1280);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1280);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !isDesktop) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isDesktop]);
  
  const handleExportPDF = () => {
    window.print();
  };

  const isMissingInfo = !data.student_detected?.first_name || !data.student_detected?.class_name || !data.student_detected?.date;

  return (
    <div className="w-full h-screen print:h-auto print:min-h-screen print:overflow-visible bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-900">
      {/* Header: Metadata & Controls */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 print:hidden z-20">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <div className="flex items-center gap-4 shrink-0">
            <button onClick={onBack} title="Retour" className="w-8 h-8 rounded shrink-0 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600">
               <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight hidden md:block">CORRIGEO<span className="text-emerald-500">.</span></h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 border-l border-slate-200 pl-4 sm:pl-8 overflow-hidden min-w-0">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Étudiant</span>
              <span className="font-bold text-sm text-slate-700 truncate">{data.student_detected?.first_name} {data.student_detected?.last_name || "?"}</span>
            </div>
            <div className="flex flex-col min-w-0 hidden sm:flex">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Classe / Niveau</span>
              <span className="font-bold text-sm text-slate-700 truncate">{data.student_detected?.class_name || "Non spécifié"}</span>
            </div>
            <div className="flex flex-col min-w-0 hidden lg:flex">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Date</span>
              <span className="font-bold text-sm text-slate-700 truncate">{data.student_detected?.date || "Date inconnue"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center shrink-0">
          {isMissingInfo && (
            <div className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-md flex items-center gap-2 max-w-[150px] sm:max-w-none">
               <AlertCircle className="h-4 w-4 shrink-0" />
               <span className="text-[10px] font-bold uppercase tracking-widest truncate">Infos manquantes</span>
            </div>
          )}
          {onOpenSettings && (
            <button 
              onClick={onOpenSettings} 
              title="Paramètres d'évaluation"
              className="w-9 h-9 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0 text-slate-500"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
          <button onClick={handleExportPDF} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-md shadow-sm hover:bg-emerald-700 transition-all whitespace-nowrap">
            Exporter PDF
          </button>
        </div>
      </header>

      {/* Main Workflow Area */}
      <main ref={containerRef} className="flex-1 flex flex-col xl:flex-row overflow-y-auto xl:overflow-hidden print:overflow-visible print:block relative bg-slate-50">
        
        {/* Left Column: The Scan Original & OCR */}
        <div 
          className="flex flex-col shrink-0 overflow-y-auto print:hidden bg-slate-200 w-full xl:border-r-4 xl:border-slate-300"
          style={{ width: isDesktop ? `${leftWidth}%` : '100%' }}
        >
          <DocumentViewer fileUrls={fileUrls} />
          
          <div className="p-4 sm:p-6 bg-slate-100 flex-1 border-t-4 border-slate-900 border-dashed min-h-[300px]">
            <h2 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-widest pl-2 border-l-4 border-emerald-500">Texte Extrait (OCR)</h2>
            <textarea 
              className="w-full h-full min-h-[500px] xl:min-h-[250px] p-4 font-mono text-[11px] leading-relaxed resize-none border-2 border-slate-900 shadow-[4px_4px_0px_#000] bg-white text-slate-700 focus:outline-none"
              readOnly
              defaultValue={data.extracted_text || ""}
            />
          </div>
        </div>

        {/* Resizer Handle for Desktop */}
        {isDesktop && (
          <div 
            className="w-2 h-full bg-slate-300 hover:bg-emerald-500 cursor-col-resize shrink-0 z-10 transition-colors print:hidden flex items-center justify-center"
            onMouseDown={() => setIsDragging(true)}
          >
            <div className="w-1 h-8 bg-slate-400 rounded-full" />
          </div>
        )}

        {/* Right Column: Score & Analysis combined */}
        <div className="flex-1 flex flex-col min-w-0 bg-white print:w-full print:block print:border-none overflow-y-auto print:overflow-visible print:h-auto shadow-sm">
          <ScorePanel data={data} />
          <AnalysisPanel data={data} />
        </div>
        
      </main>

      <Footer />
    </div>
  );
}
