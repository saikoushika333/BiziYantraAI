import { analyzeWithML } from './services/mlApiServices.ts';
import React, { useState } from 'react';
import { AnalysisResult, UserInputs } from './types.ts';
import { DEFAULT_INPUTS } from './constants.ts';
import { performBusinessAnalysis } from './services/geminiService.ts';
import InputForm from './components/InputForm.tsx';
import Dashboard from './components/Dashboard.tsx';
import IntelligenceMap from './components/IntelligenceMap.tsx';
import ChatDrawer from './components/ChatDrawer.tsx';
import { ShieldCheck, BrainCircuit, ChevronLeft, Binary, Database, Cpu } from 'lucide-react';

type AppView = 'input' | 'analysis';

export default function App() {
  const [inputs, setInputs] = useState<UserInputs>(DEFAULT_INPUTS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<AppView>('input');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const [geminiResult, mlResult] = await Promise.all([
        performBusinessAnalysis(inputs),
        analyzeWithML(inputs)
      ]);

      console.log("ML prediction:", mlResult.analysis.prediction);
      console.log("Gemini result:", geminiResult);

      // Merge ML model predictions into the final result
      // ML model replaces Gemini's guessed values with real trained model values
      const mlPrediction = mlResult.analysis.prediction;
      const mlCosts = mlResult.analysis.costs;
      const mlLocation = mlResult.analysis.location;

      const mergedResult = {
        ...geminiResult,
        prediction: {
          ...geminiResult.prediction,
          successProb: Math.round(mlPrediction.success_probability),
          failureProb: Math.round(mlPrediction.failure_probability),
          confidence: mlPrediction.confidence_level,
          timeToProfitability: mlPrediction.time_to_profitability,
        },
        suitabilityScore: mlLocation.overall_score ?? geminiResult.suitabilityScore,
        suitabilityBreakdown: {
          populationDensity: mlLocation.breakdown.population_density ?? geminiResult.suitabilityBreakdown.populationDensity,
          footTraffic: mlLocation.breakdown.foot_traffic ?? geminiResult.suitabilityBreakdown.footTraffic,
          competitionScore: mlLocation.breakdown.competition ?? geminiResult.suitabilityBreakdown.competitionScore,
          accessibility: mlLocation.breakdown.accessibility ?? geminiResult.suitabilityBreakdown.accessibility,
          parking: mlLocation.breakdown.parking ?? geminiResult.suitabilityBreakdown.parking,
        },
        costEstimation: {
          ...geminiResult.costEstimation,
          initialSetup: mlCosts.initial_setup ?? geminiResult.costEstimation.initialSetup,
          monthlyRent: mlCosts.monthly_rent ?? geminiResult.costEstimation.monthlyRent,
          monthlySalaries: mlCosts.monthly_salaries ?? geminiResult.costEstimation.monthlySalaries,
          monthlyUtilities: mlCosts.monthly_utilities ?? geminiResult.costEstimation.monthlyUtilities,
          monthlySupplies: mlCosts.monthly_supplies ?? geminiResult.costEstimation.monthlySupplies,
          monthlyMarketing: mlCosts.monthly_marketing ?? geminiResult.costEstimation.monthlyMarketing,
          monthlyMaintenance: mlCosts.monthly_maintenance ?? geminiResult.costEstimation.monthlyMaintenance,
          totalMonthly: mlCosts.total_monthly ?? geminiResult.costEstimation.totalMonthly,
          breakEvenMonths: mlCosts.breakeven_months ?? geminiResult.costEstimation.breakEvenMonths,
        },
        finalRecommendation: mlPrediction.recommendation + "\n\n" + geminiResult.finalRecommendation,
      };

      setResult(mergedResult);
      setView('analysis');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError("Analysis engine failed to initialize. Please check network telemetry.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden selection:bg-teal-500/30">
      {/* Immersive background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-teal-500/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <header className="sticky top-0 z-[100] bg-[#020617]/90 backdrop-blur-2xl border-b border-slate-800/40">
        <div className="container mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-teal-500 blur-xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-gradient-to-br from-teal-500 to-emerald-600 p-3 rounded-2xl shadow-2xl">
                <BrainCircuit className="text-white" size={30} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white italic uppercase leading-none">
                SmartBuzi <span className="text-teal-400 underline decoration-2 underline-offset-8">Analyzer</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.4em] font-mono">Neural Decision Intelligence</span>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-teal-500/70" />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Encrypted Data Stream</span>
              </div>
              <div className="flex items-center gap-3">
                <Database size={18} className="text-blue-500/70" />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Ensemble ML Training</span>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/30 text-white font-black py-3 px-8 rounded-2xl text-xs transition-all flex items-center gap-3 uppercase tracking-widest shadow-2xl group"
            >
              <Binary size={18} className="text-teal-400 group-hover:rotate-12 transition-transform" />
              Ask AI Agent
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-16 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 gap-16">
          
          {view === 'input' ? (
            <div className="space-y-16 animate-in fade-in slide-in-from-top-6 duration-700">
              <div className="space-y-6 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
                   <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                   <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Ensemble Model: Gradient Boosting + Random Forest</span>
                </div>
                <h2 className="text-6xl font-black tracking-tighter text-white leading-[0.9] italic uppercase">
                  Predict your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Business Success</span>
                </h2>
                <h3 className="text-slate-400 text-xl font-medium leading-relaxed">
                  Analyze location suitability, estimate operational overhead, and predict success probability using advanced geospatial heuristics and ML training epochs.
                </h3>
              </div>

              <InputForm 
                inputs={inputs} 
                setInputs={setInputs} 
                onRun={runAnalysis} 
                loading={loading} 
              />
            </div>
          ) : (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-slate-800 pb-10">
                 <div className="flex items-center gap-6">
                   <button 
                    onClick={handleBack}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-400 hover:text-teal-400 transition-all group shadow-xl"
                   >
                     <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                   </button>
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Analysis ID: {Math.floor(Math.random() * 10000)}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{inputs.locationName.toUpperCase()} • {inputs.businessType.toUpperCase()}</span>
                      </div>
                      <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Heuristic Intelligence Report</h2>
                   </div>
                 </div>
                 
                 <div className="flex gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-lg">
                       <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Ensemble Accuracy</span>
                       <span className="text-xl font-black text-teal-400 font-mono">{((result?.prediction.confidence ?? 0) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-lg">
                       <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Processing Status</span>
                       <span className="text-xl font-black text-emerald-400">OPTIMIZED</span>
                    </div>
                 </div>
              </div>

              {result && (
                <>
                  <Dashboard data={result} />
                  <IntelligenceMap data={result} radius={inputs.radius} />
                </>
              )}
            </div>
          )}

          {error && (
            <div className="max-w-3xl mx-auto bg-rose-500/10 border border-rose-500/30 p-8 rounded-[2rem] flex items-center gap-6 text-rose-400 animate-in zoom-in-95">
              <div className="bg-rose-500 p-3 rounded-2xl shadow-xl shadow-rose-500/20">
                 <ShieldCheck className="text-white" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Heuristic Exception Alert</p>
                <p className="font-bold text-lg">{error}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Agent Chat Interface */}
      <ChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        currentAnalysis={result}
      />
      
      <footer className="container mx-auto px-8 py-16 border-t border-slate-800/40 text-slate-600">
         <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-4">
              <Cpu className="text-teal-500 opacity-20" size={24} />
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] block">SmartBuzi Decision Engine &copy; 2024</span>
                <span className="text-[8px] font-mono mt-1 block">Powered by Ensemble Learning Logic</span>
              </div>
            </div>
            <div className="flex gap-10">
               {['Model Training', 'System Logs', 'Privacy Policy', 'Security Matrix'].map(item => (
                 <a key={item} href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-teal-400 transition-colors">{item}</a>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
}