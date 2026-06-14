
import React from 'react';
import { UserInputs } from '../types';
import { BUSINESS_TYPES, VIZAG_LOCATIONS } from '../constants';
import { Settings2, Play } from 'lucide-react';

interface InputFormProps {
  inputs: UserInputs;
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
  onRun: () => void;
  loading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs, onRun, loading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'locationName') {
      const selectedLoc = VIZAG_LOCATIONS.find(l => l.name === value);
      if (selectedLoc) {
        setInputs(prev => ({
          ...prev,
          locationName: value,
          latitude: selectedLoc.lat,
          longitude: selectedLoc.lng
        }));
        return;
      }
    }

    setInputs(prev => ({
      ...prev,
      [name]: (name === 'businessType' || name === 'locationName') ? value : parseFloat(value) || 0
    }));
  };

  return (
    <div className="bg-[#0b1426] border border-slate-800/60 rounded-xl p-8 shadow-2xl max-w-full mx-auto relative overflow-hidden">
      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-600 opacity-30" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-[#1a2b3d] p-2.5 rounded-lg border border-slate-700/50">
          <Settings2 className="text-teal-400" size={20} />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Business Analysis Parameters</h2>
      </div>
      
      {/* 3-Column Grid matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
        {/* Row 1 */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Business Type</label>
          <div className="relative group">
            <select
              name="businessType"
              value={inputs.businessType}
              onChange={handleChange}
              className="w-full bg-[#16213e] border border-slate-800/80 rounded-lg py-3.5 px-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-200 transition-all appearance-none cursor-pointer font-medium"
            >
              {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-teal-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Location Name</label>
          <div className="relative group">
            <select
              name="locationName"
              value={inputs.locationName}
              onChange={handleChange}
              className="w-full bg-[#16213e] border border-slate-800/80 rounded-lg py-3.5 px-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-200 transition-all appearance-none cursor-pointer font-medium"
            >
              {VIZAG_LOCATIONS.map(loc => <option key={loc.name} value={loc.name}>{loc.name}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-teal-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Latitude</label>
          <input
            type="number"
            name="latitude"
            value={inputs.latitude}
            readOnly
            className="w-full bg-[#16213e]/60 border border-slate-800/80 rounded-lg py-3.5 px-4 focus:outline-none text-slate-400 cursor-not-allowed font-mono text-sm"
          />
        </div>

        {/* Row 2 */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Longitude</label>
          <input
            type="number"
            name="longitude"
            value={inputs.longitude}
            readOnly
            className="w-full bg-[#16213e]/60 border border-slate-800/80 rounded-lg py-3.5 px-4 focus:outline-none text-slate-400 cursor-not-allowed font-mono text-sm"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Budget (Lakhs)</label>
          <input
            type="number"
            name="budget"
            value={inputs.budget}
            onChange={handleChange}
            placeholder="E.g. 10"
            className="w-full bg-[#16213e] border border-slate-800/80 rounded-lg py-3.5 px-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-200 transition-all font-medium"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Area (Sq.M)</label>
          <input
            type="number"
            name="area"
            value={inputs.area}
            onChange={handleChange}
            placeholder="E.g. 200"
            className="w-full bg-[#16213e] border border-slate-800/80 rounded-lg py-3.5 px-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-200 transition-all font-medium"
          />
        </div>

        {/* Row 3 */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Analysis Radius (KM)</label>
          <input
            type="number"
            name="radius"
            value={inputs.radius}
            onChange={handleChange}
            placeholder="E.g. 2"
            className="w-full bg-[#16213e] border border-slate-800/80 rounded-lg py-3.5 px-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 text-slate-200 transition-all font-medium"
          />
        </div>

        <div className="md:col-span-2 flex items-end">
          <button
            onClick={onRun}
            disabled={loading}
            className="w-full bg-[#14b8a6] hover:bg-[#0d9488] text-[#0b1426] font-black py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-teal-500/10 uppercase tracking-widest text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#0b1426] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play size={18} fill="currentColor" className="opacity-80" />
                Run Analysis
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
