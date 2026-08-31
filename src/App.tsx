import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { NewCorrectionForm } from "./components/NewCorrectionForm";
import { EvaluationBoard } from "./components/EvaluationBoard";
import { SettingsModal } from "./components/SettingsModal";
import { LandingPage } from "./components/LandingPage";
import { AnalysisResponse } from "@/types";

export default function App() {
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [evaluationData, setEvaluationData] = useState<{
    data: AnalysisResponse | null;
    fileUrls: string[];
  }>({
    data: null,
    fileUrls: []
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleEvaluationComplete = (data: AnalysisResponse, fileDataUrls: string[]) => {
    setEvaluationData({ data, fileUrls: fileDataUrls });
  };

  const handleBack = () => {
    setEvaluationData({ data: null, fileUrls: [] });
  };

  if (!isAppStarted) {
    return <LandingPage onStart={() => setIsAppStarted(true)} />;
  }

  if (evaluationData.data && evaluationData.fileUrls.length > 0) {
    return (
      <>
        <EvaluationBoard 
          data={evaluationData.data} 
          fileUrls={evaluationData.fileUrls} 
          onBack={handleBack}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      <main className="flex-1 w-full relative mb-auto">
        <NewCorrectionForm onEvaluationComplete={handleEvaluationComplete} />
      </main>
      <Footer />
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}
