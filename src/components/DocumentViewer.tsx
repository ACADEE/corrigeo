import { useState } from "react";

export function DocumentViewer({ fileUrls }: { fileUrls: string[] }) {
  const [zoom, setZoom] = useState(100);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentUrl = fileUrls && fileUrls.length > 0 ? fileUrls[currentIndex] : "";

  return (
    <section className="w-full h-[500px] xl:h-[50vh] bg-slate-200 p-4 xl:p-8 flex flex-col items-center justify-start relative overflow-hidden xl:z-0 print:hidden border-b-4 xl:border-b-0 border-slate-900 shrink-0">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 print:hidden items-center justify-center w-full max-w-md">
        <div className="px-3 py-1.5 bg-white border-2 border-slate-900 font-bold text-[10px] shadow-[2px_2px_0px_#000] uppercase tracking-widest flex items-center">
          SCAN ORIGINAL
        </div>
        
        {fileUrls && fileUrls.length > 1 && (
          <>
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              className="px-3 py-1.5 bg-white border-2 border-slate-900 font-bold text-[10px] shadow-[2px_2px_0px_#000] disabled:opacity-50 active:translate-y-px active:shadow-none transition-all uppercase tracking-widest"
            >
              Préc.
            </button>
            <div className="px-2 py-1.5 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center">
              {currentIndex + 1} / {fileUrls.length}
            </div>
            <button 
              disabled={currentIndex === fileUrls.length - 1}
              onClick={() => setCurrentIndex(i => Math.min(fileUrls.length - 1, i + 1))}
              className="px-3 py-1.5 bg-white border-2 border-slate-900 font-bold text-[10px] shadow-[2px_2px_0px_#000] disabled:opacity-50 active:translate-y-px active:shadow-none transition-all uppercase tracking-widest"
            >
              Suiv.
            </button>
          </>
        )}

        <button 
          onClick={() => setZoom(z => Math.max(z - 20, 20))}
          className="px-3 py-1.5 bg-white border-2 border-slate-900 font-bold text-[12px] shadow-[2px_2px_0px_#000] active:translate-y-px active:shadow-none transition-all ml-2"
        >
          -
        </button>
        <div className="px-3 py-1.5 bg-white border-2 border-slate-900 font-bold text-[10px] shadow-[2px_2px_0px_#000] min-w-[60px] text-center flex items-center justify-center">
          {zoom}%
        </div>
        <button 
          onClick={() => setZoom(z => Math.min(z + 20, 300))}
          className="px-3 py-1.5 bg-white border-2 border-slate-900 font-bold text-[12px] shadow-[2px_2px_0px_#000] active:translate-y-px active:shadow-none transition-all"
        >
          +
        </button>
      </div>
      
      <div className="flex-1 overflow-auto w-full p-4 mt-8 cursor-grab flex items-start justify-center">
         {currentUrl && (
           <div 
             className="bg-white shadow-2xl border-2 border-slate-300 transition-transform origin-top relative print:shadow-none print:border-none print:!transform-none" 
             style={{ transform: `scale(${zoom / 100})` }}
           >
             {currentUrl.startsWith('data:image') ? (
               <img src={currentUrl} alt="Document" className="max-w-full h-auto object-contain" />
             ) : (
               <iframe src={currentUrl} className="w-[800px] h-[1130px] border-none bg-white pointer-events-none" title="PDF Viewer" />
             )}
           </div>
         )}
      </div>
    </section>
  );
}
