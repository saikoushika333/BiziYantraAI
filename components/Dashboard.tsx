
import React, { useState, useEffect } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { 
  Target, 
  CircleDollarSign, 
  ShieldAlert, 
  Binary, 
  FileJson, 
  Share2, 
  Clock, 
  BarChart4, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Star,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Cell as BarCell 
} from 'recharts';

interface DashboardProps {
  data: AnalysisResult;
}

const ProgressBar: React.FC<{ value: number; color: string; label: string }> = ({ value, color, label }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-mono font-bold text-slate-200">{value}%</span>
    </div>
    <div className="w-full bg-slate-950/50 rounded-full h-1.5 p-[1px] border border-slate-800">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ${color} shadow-[0_0_10px_rgba(45,212,191,0.2)]`} 
        style={{ width: `${Math.min(value, 100)}%` }} 
      />
    </div>
  </div>
);

const IntelligenceCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string; subValue?: string }> = ({ icon, label, value, color, subValue }) => (
  <div className="relative overflow-hidden bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl group hover:border-teal-500/30 transition-all duration-500">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 64 })}
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${color}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
      </div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-3xl font-black tracking-tighter text-white">{value}</span>
      {subValue && <span className="text-[10px] font-mono text-slate-500 mt-2 uppercase tracking-widest">{subValue}</span>}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const successData = [
    { name: 'Success Chance', value: data.prediction.successProb },
    { name: 'Risk Probability', value: data.prediction.failureProb }
  ];
  
  const costChartData = [
    { name: 'Rent', value: data.costEstimation.monthlyRent, color: '#2dd4bf' },
    { name: 'Salaries', value: data.costEstimation.monthlySalaries, color: '#3b82f6' },
    { name: 'Utilities', value: data.costEstimation.monthlyUtilities, color: '#a855f7' },
    { name: 'Supplies', value: data.costEstimation.monthlySupplies, color: '#ec4899' },
    { name: 'Marketing', value: data.costEstimation.monthlyMarketing, color: '#f59e0b' },
    { name: 'Maintenance', value: data.costEstimation.monthlyMaintenance, color: '#10b981' },
  ];

  const PIE_COLORS = ['#2dd4bf', '#f43f5e'];
  const riskColor = data.riskAnalysis.level === RiskLevel.LOW ? 'text-teal-400' : data.riskAnalysis.level === RiskLevel.MEDIUM ? 'text-amber-400' : 'text-red-400';

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackEntry = {
      timestamp: new Date().toISOString(),
      rating,
      comment,
      businessType: data.locationOverview
    };
    
    const existingFeedback = JSON.parse(localStorage.getItem('bizyantra_feedback') || '[]');
    localStorage.setItem('bizyantra_feedback', JSON.stringify([...existingFeedback, feedbackEntry]));
    
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 1. Intelligence Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <IntelligenceCard 
          icon={<Target />} 
          label="Location Rating" 
          value={`${data.suitabilityScore.toFixed(0)}/100`} 
          color="text-teal-400" 
          subValue="Locational Node Score"
        />
        <IntelligenceCard 
          icon={<Clock />} 
          label="Profitability Target" 
          value={data.prediction.timeToProfitability} 
          subValue="Estimated Wait Time"
          color="text-emerald-400" 
        />
        <IntelligenceCard 
          icon={<ShieldAlert />} 
          label="Risk Assessment" 
          value={data.riskAnalysis.level} 
          color={riskColor} 
          subValue={`Risk Score: ${data.riskAnalysis.score}%`}
        />
        <IntelligenceCard 
          icon={<Binary />} 
          label="AI Prediction" 
          value={`${data.prediction.successProb}%`} 
          subValue={`System Confidence: ${(data.prediction.confidence * 100).toFixed(0)}%`}
          color="text-blue-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Success Distribution Logic (Pie Chart) */}
        <div className="lg:col-span-1 bg-[#0b1426] border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-20" />
          <h3 className="text-[10px] font-black text-white self-start flex items-center gap-2 mb-8 uppercase tracking-[0.2em]">
            <TrendingUp className="text-teal-400" size={16} />
            Success Distribution Logic (100%)
          </h3>
          
          <div className="relative w-full aspect-square max-h-[260px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {successData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl font-black text-white tracking-tighter">{data.prediction.successProb}%</span>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mt-2">Overall Success</span>
            </div>
          </div>
          
          <div className="w-full grid grid-cols-1 gap-3 mt-4">
             <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                  <span className="text-[10px] text-slate-400 font-black uppercase">Success Probability</span>
                </div>
                <span className="text-teal-400 font-black font-mono text-base">{data.prediction.successProb}%</span>
             </div>
             <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <span className="text-[10px] text-slate-400 font-black uppercase">Failure Risk</span>
                </div>
                <span className="text-rose-500 font-black font-mono text-base">{data.prediction.failureProb}%</span>
             </div>
          </div>
        </div>

        {/* 3. Market Strength Indicators (Bar Charts) */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] space-y-10">
           <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
                <BarChart4 className="text-teal-400" size={16} />
                Market Strength Indicators
              </h3>
              <div className="text-[10px] font-mono text-slate-600 bg-slate-950/50 px-3 py-1 rounded-full uppercase tracking-tighter">Heuristic Mapping v2.4</div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <ProgressBar value={data.suitabilityBreakdown.populationDensity} color="bg-teal-400" label="Population Concentration" />
              <ProgressBar value={data.suitabilityBreakdown.footTraffic} color="bg-blue-400" label="Estimated Footfall" />
              <ProgressBar value={data.suitabilityBreakdown.competitionScore} color="bg-purple-400" label="Competition Saturation" />
              <ProgressBar value={data.suitabilityBreakdown.accessibility} color="bg-emerald-400" label="Ease of Access" />
              <ProgressBar value={data.suitabilityBreakdown.parking} color="bg-amber-400" label="Parking Infrastructure" />
              <ProgressBar value={data.competitionAnalysis.pressureIndex} color="bg-rose-400" label="Market Rivalry Tension" />
           </div>

           <div className="pt-10 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="group">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Capital Needs</p>
                <p className="text-xl font-black font-mono">₹{(data.costEstimation.initialSetup / 100000).toFixed(1)}L</p>
              </div>
              <div className="group">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Monthly OpEx</p>
                <p className="text-xl font-black font-mono">₹{(data.costEstimation.totalMonthly / 1000).toFixed(0)}K</p>
              </div>
              <div className="group">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Months to Win</p>
                <p className="text-xl font-black font-mono">{data.costEstimation.breakEvenMonths} MO</p>
              </div>
              <div className="group">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Market Rivals</p>
                <p className="text-xl font-black font-mono">{data.competitionAnalysis.count}</p>
              </div>
           </div>
        </div>
      </div>

      {/* 4. Financial breakdown visualization (New Bar Chart) */}
      <div className="bg-[#0b1426] border border-slate-800 p-10 rounded-[2.5rem] shadow-xl overflow-hidden group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h3 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
            <CircleDollarSign className="text-emerald-400" size={16} />
            OpEx Architecture Breakdown
          </h3>
          <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Initial Setup Capital</p>
            <p className="text-lg font-black text-white font-mono">₹{data.costEstimation.initialSetup.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(45,212,191,0.05)' }}
                contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 900 }}
                formatter={(val: number) => `₹${val.toLocaleString()}`}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {costChartData.map((entry, index) => (
                  <BarCell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Allocated Financial Architecture (Table) */}
      <div className="bg-[#0b1426] border border-slate-800 p-10 rounded-[2.5rem] shadow-xl">
        <h3 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-[0.2em] mb-10">
          <CircleDollarSign className="text-emerald-400" size={16} />
          Allocated Financial Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { label: 'Real Estate/Rent', val: data.costEstimation.monthlyRent },
             { label: 'Staffing Overhead', val: data.costEstimation.monthlySalaries },
             { label: 'Utilities & Power', val: data.costEstimation.monthlyUtilities },
             { label: 'Inventory/Supplies', val: data.costEstimation.monthlySupplies },
             { label: 'Marketing/Client Acq', val: data.costEstimation.monthlyMarketing },
             { label: 'Maintenance Node', val: data.costEstimation.monthlyMaintenance }
           ].map((item, i) => (
             <div key={i} className="flex justify-between items-center bg-[#16213e]/40 p-5 rounded-xl border border-slate-800/60 group hover:border-teal-500/30 transition-colors">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                <span className="font-mono font-bold text-slate-200">₹{item.val.toLocaleString()}</span>
             </div>
           ))}
        </div>
      </div>

      {/* 6. AI Reasoning & Data Logic Section */}
      <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] relative">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-1.5 h-8 bg-teal-500 rounded-full" />
           <h3 className="text-lg font-black text-white uppercase tracking-tight">AI Reasoning & Data Logic</h3>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-400 leading-relaxed font-medium whitespace-pre-wrap text-lg">
            {data.reasoning}
          </p>
        </div>
        
        <div className="mt-12 flex flex-wrap gap-4">
          {data.riskAnalysis.identifiedRisks.map((risk, i) => (
             <div key={i} className="flex items-center gap-3 px-5 py-3 bg-rose-500/5 border border-rose-500/20 text-rose-400 text-[10px] font-black rounded-xl uppercase tracking-wider">
                <AlertCircle size={14} className="opacity-70" />
                Risk: {risk}
             </div>
          ))}
          {data.riskAnalysis.mitigationFactors.map((factor, i) => (
             <div key={i} className="flex items-center gap-3 px-5 py-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-xl uppercase tracking-wider">
                <CheckCircle2 size={14} className="opacity-70" />
                Fix: {factor}
             </div>
          ))}
        </div>
      </div>

      {/* 7. Rate this Analysis (Feedback Mechanism) */}
      <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center animate-in zoom-in-95 duration-500">
             <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-full flex items-center justify-center text-teal-400">
                <ThumbsUp size={32} />
             </div>
             <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Report Stored in Neural Logs</h3>
             <p className="text-slate-500 text-sm font-medium">Thank you for your qualitative feedback. Our ensemble models value your grit.</p>
             <button 
              onClick={() => setSubmitted(false)}
              className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mt-4 hover:underline"
             >
                Send another signal
             </button>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
                <MessageSquare className="text-teal-400" size={16} />
                Rate this Intelligence Report
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-4">Accuracy Rating:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-lg transition-all ${rating >= star ? 'text-amber-400' : 'text-slate-700 hover:text-slate-500'}`}
                    >
                      <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Qualitative Assessment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us how we can sharpen our heuristics..."
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 focus:outline-none focus:border-teal-500 transition-colors min-h-[100px] font-medium"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={rating === 0}
                  className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black py-3 px-8 rounded-xl text-[10px] transition-all flex items-center gap-3 uppercase tracking-widest active:scale-95 shadow-lg shadow-teal-500/10"
                >
                  Confirm Neural Submission
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* 8. Expert Advice Recommendation (At the very bottom) */}
      <div className="relative overflow-hidden bg-[#0b1426] border border-teal-500/20 p-1 rounded-[2.5rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent" />
        <div className="relative bg-[#020617]/90 backdrop-blur-3xl rounded-[2.35rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 flex-1">
            <div className="shrink-0 w-20 h-20 rounded-[2rem] bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-teal-500/20">
               <Sparkles className="text-white" size={32} />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <span className="text-[10px] text-teal-400 font-black uppercase tracking-[0.4em]">Expert Mentor Advice</span>
                <div className="h-[1px] w-12 bg-teal-500/30" />
              </div>
              <div className="text-base font-semibold text-slate-100 leading-relaxed whitespace-pre-wrap max-w-2xl italic">
                {data.finalRecommendation}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 shrink-0">
            <button className="bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-3 transition-all group shadow-xl uppercase tracking-widest text-[10px]">
              <FileJson size={18} className="text-teal-400" />
              Full Report
            </button>
            <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 p-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-teal-500/20">
              <Share2 size={22} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
