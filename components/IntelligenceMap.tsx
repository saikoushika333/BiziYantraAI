
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import { AnalysisResult, Competitor } from '../types.ts';
import { Map as MapIcon, Layers } from 'lucide-react';

// Fix Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const RecenterMap: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

const HeatmapLayer: React.FC<{ competitors: Competitor[] }> = ({ competitors }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!competitors || competitors.length === 0) return;
    
    // Set global L so leaflet.heat can find and attach to it
    (window as any).L = L;
    
    let active = true;
    let heatLayerInstance: any = null;
    
    const initHeatmap = async () => {
      // @ts-ignore
      if (!L.heatLayer) {
        await import('leaflet.heat');
      }
      
      if (!active) return;
      
      // Explicitly trigger size recalculation
      map.invalidateSize();
      const size = map.getSize();
      
      if (size.x === 0 || size.y === 0) {
        const checkSizeAndInit = () => {
          if (!active) return;
          map.invalidateSize();
          const currentSize = map.getSize();
          if (currentSize.x > 0 && currentSize.y > 0) {
            createHeatmap();
          } else {
            setTimeout(checkSizeAndInit, 100);
          }
        };
        setTimeout(checkSizeAndInit, 100);
        return;
      }
      
      createHeatmap();
    };
    
    const createHeatmap = () => {
      if (!active) return;
      // Prepare points: [lat, lng, intensity]
      const points = competitors.map(c => [
        c.lat, 
        c.lng, 
        c.status === 'Successful' ? 0.8 : c.status === 'Active' ? 0.6 : 0.4
      ] as [number, number, number]);
      
      try {
        // @ts-ignore - leaflet.heat attaches to L
        heatLayerInstance = L.heatLayer(points, {
          radius: 35,
          blur: 20,
          maxZoom: 17,
          gradient: {
            0.4: 'blue',
            0.6: 'cyan',
            0.7: 'lime',
            0.8: 'yellow',
            1.0: 'red'
          }
        });
        
        heatLayerInstance.addTo(map);
      } catch (err) {
        console.error("Failed to append heatlayer:", err);
      }
    };
    
    initHeatmap();
    
    return () => {
      active = false;
      if (heatLayerInstance && map) {
        try {
          map.removeLayer(heatLayerInstance);
        } catch (err) {
          // ignore already removed
        }
      }
    };
  }, [map, competitors]);
  
  return null;
};

const getTargetIcon = () => {
  return L.divIcon({
    className: 'custom-target-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 rounded-full border-4 border-cyan-400 animate-ping opacity-30"></div>
        <div class="w-7 h-7 rounded-full border-2 border-white bg-cyan-400 flex items-center justify-center shadow-lg">
           <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const getCompetitorIcon = (status: string) => {
  const color = status === 'Successful' ? '#22c55e' : status === 'Failed' ? '#f43f5e' : '#3b82f6';
  return L.divIcon({
    className: 'competitor-dot',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

interface IntelligenceMapProps {
  data: AnalysisResult;
  radius: number;
}

export default function IntelligenceMap({ data, radius }: IntelligenceMapProps) {
  return (
    <div className="relative bg-slate-900 border border-slate-800 p-1 rounded-[2.5rem] overflow-hidden group shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/20 group-hover:bg-teal-500/40 transition-colors" />
      
      <div className="bg-slate-950/50 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800">
        <div>
           <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic">
            <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20">
              <MapIcon className="text-teal-400" size={24} />
            </div>
            Geospatial Market Node Analysis
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-[0.3em] px-14">Cluster mapping Protocol v4.0</p>
        </div>
      </div>
      
      <div className="h-[600px] relative z-0">
        <MapContainer center={data.center} zoom={14} scrollWheelZoom={false} className="grayscale-[0.1] contrast-[1.05]">
          <LayersControl position="topright">
            <LayersControl.BaseLayer name="Street View">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Dark Map">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite View" checked>
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; Esri'
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay name="Competitor Pins" checked>
              <LayerGroup>
                {data.competitors.map((comp, idx) => (
                  <Marker 
                    key={idx} 
                    position={[comp.lat, comp.lng]}
                    icon={getCompetitorIcon(comp.status)}
                  >
                    <Popup>
                      <div className="text-slate-900 font-sans p-2 min-w-[150px]">
                        <h4 className="font-black text-xs uppercase tracking-tight leading-tight mb-1">{comp.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">{comp.type}</p>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                          <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded-md">{comp.rating} ⭐</span>
                          <span className={`text-[10px] font-black uppercase ${comp.status === 'Successful' ? 'text-green-600' : comp.status === 'Failed' ? 'text-red-600' : 'text-blue-600'}`}>
                            {comp.status}
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Market Saturation Heatmap" checked>
              <HeatmapLayer competitors={data.competitors} />
            </LayersControl.Overlay>
          </LayersControl>
          
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
            opacity={0.8}
            zIndex={10}
          />
          
          <RecenterMap center={data.center} />
          
          <Marker position={data.center} icon={getTargetIcon()}>
            <Popup className="custom-popup">
              <div className="font-sans p-2">
                <p className="text-[9px] font-black uppercase text-teal-600 mb-1 tracking-widest">Inquiry Focal Point</p>
                <b className="text-slate-900 text-sm">{data.locationOverview}</b>
              </div>
            </Popup>
          </Marker>

          <Circle 
            center={data.center} 
            radius={2000} 
            pathOptions={{ 
              color: '#22c55e', 
              weight: 4, 
              fillColor: '#22c55e', 
              fillOpacity: 0.08 
            }} 
          />
          
          <Circle 
            center={data.center} 
            radius={3000} 
            pathOptions={{ 
              color: '#06b6d4', 
              weight: 3, 
              dashArray: '12, 12', 
              fillColor: '#06b6d4', 
              fillOpacity: 0.04 
            }} 
          />

          <div className="leaflet-bottom leaflet-right m-6">
             <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 p-6 rounded-[1.5rem] shadow-2xl pointer-events-auto min-w-[220px]">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-5 border-b border-slate-800 pb-3">Analysis Matrix</h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-3.5">
                      <div className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-500/10"></div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Success Zone (2km)</span>
                   </div>
                   <div className="flex items-center gap-3.5">
                      <div className="w-5 h-5 rounded-full border-2 border-cyan-500 border-dashed bg-cyan-500/5"></div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Boundary (3km)</span>
                   </div>
                   <div className="flex items-center gap-3.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Successful Entity</span>
                   </div>
                   <div className="flex items-center gap-3.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Failed Entity</span>
                   </div>
                   <div className="flex items-center gap-3.5">
                      <div className="w-5 h-5 rounded-full border-2 border-white bg-cyan-400 flex items-center justify-center p-[2.5px] shadow-lg">
                         <div className="w-full h-full rounded-full bg-white"></div>
                      </div>
                      <span className="text-[10px] text-white font-black uppercase tracking-widest">Selected Focus</span>
                   </div>
                </div>
             </div>
          </div>
        </MapContainer>
      </div>
      
      <div className="bg-slate-950 p-6 border-t border-slate-800 flex items-center justify-between text-slate-500">
        <div className="flex items-center gap-4">
          <Layers size={16} className="text-teal-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Heuristic Stream Active</span>
        </div>
        <div className="flex gap-2.5">
           <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
           <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse delay-100"></div>
           <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
}
