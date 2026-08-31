import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, Settings } from "lucide-react";

interface Criterion {
  name: string;
  weight: number;
  description: string;
}

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setCriteria(data.criteria || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur de chargement des paramètres");
        setLoading(false);
      });
  }, []);

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleSave = async () => {
    if (totalWeight !== 100) {
      setError("Le total des pondérations doit être égal à 100%.");
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria }),
      });
      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateCriterion = (index: number, field: keyof Criterion, value: string | number) => {
    const newCriteria = [...criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setCriteria(newCriteria);
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const addCriterion = () => {
    setCriteria([...criteria, { name: "Nouveau critère", weight: 0, description: "Description" }]);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border-4 border-slate-900">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b-4 border-slate-900 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 shrink-0" />
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900">Paramètres d'Évaluation</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-slate-100">
          {loading ? (
            <div className="text-center py-8 font-bold text-slate-500 uppercase tracking-widest text-sm">
              Chargement...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 p-4 border-2 border-amber-400 text-amber-900 text-sm font-medium">
                Définissez la grille d'analyse utilisée par l'IA. Les scores individuels seront calculés en fonction du barème sur 20 selon ces pondérations.
              </div>

              <div className="space-y-4">
                {criteria.map((c, i) => (
                  <div key={i} className="bg-white p-4 border-2 border-slate-900 shadow-[4px_4px_0px_#000] relative group">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex-1 space-y-3 w-full">
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            value={c.name} 
                            onChange={(e) => updateCriterion(i, 'name', e.target.value)}
                            className="flex-1 font-bold text-sm bg-slate-50 border-2 border-slate-300 p-2 focus:border-slate-900 focus:outline-none transition-colors"
                            placeholder="Nom du critère"
                          />
                          <div className="flex items-center gap-2 border-2 border-slate-300 bg-white px-2 focus-within:border-slate-900 transition-colors w-24 shrink-0">
                            <input 
                              type="number" 
                              value={c.weight}
                              onChange={(e) => updateCriterion(i, 'weight', parseInt(e.target.value) || 0)}
                              className="w-full text-right font-black text-lg p-1 focus:outline-none"
                            />
                            <span className="font-bold text-slate-500">%</span>
                          </div>
                        </div>
                        <input 
                          type="text" 
                          value={c.description} 
                          onChange={(e) => updateCriterion(i, 'description', e.target.value)}
                          className="w-full text-sm font-medium text-slate-600 bg-slate-50 border-2 border-slate-300 p-2 focus:border-slate-900 focus:outline-none transition-colors italic"
                          placeholder="Analyse attendue (ex: L'élève répond-il à la consigne ?)"
                        />
                      </div>
                      <button 
                        onClick={() => removeCriterion(i)}
                        className="text-slate-400 hover:text-red-600 transition-colors shrink-0 p-2 absolute -top-3 -right-3 bg-white border-2 border-slate-900 rounded-full shadow-[2px_2px_0px_#000] opacity-0 group-hover:opacity-100 sm:opacity-100 sm:relative sm:top-0 sm:right-0 sm:bg-transparent sm:border-none sm:shadow-none"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addCriterion}
                className="w-full border-2 border-dashed border-slate-400 text-slate-500 font-bold uppercase tracking-widest text-sm py-4 flex items-center justify-center gap-2 hover:bg-white hover:border-slate-900 hover:text-slate-900 transition-colors"
              >
                <Plus className="w-5 h-5" /> Ajouter un critère
              </button>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t-4 border-slate-900 bg-white shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black uppercase tracking-widest">Total :</span>
            <span className={`text-xl font-black ${totalWeight === 100 ? 'text-green-600' : 'text-orange-600'}`}>
              {totalWeight}%
            </span>
            {totalWeight !== 100 && (
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Le total doit être de 100%
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {error && <span className="text-red-500 text-sm font-bold">{error}</span>}
            <button 
              onClick={handleSave}
              disabled={saving || totalWeight !== 100}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 border-2 border-slate-900 text-white px-6 py-3 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Save className="w-4 h-4" />
              {saving ? "..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
