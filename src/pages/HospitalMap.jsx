import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, PhoneCall, Navigation } from 'lucide-react';

const HOSPITALS_DATA = [
  {
    id: 'hosp_1',
    name: 'St. Jude General Hospital & Trauma Center',
    type: 'Level 1 Trauma Center',
    distance: '1.2 km',
    lat: 40.7128,
    lng: -74.0060,
    phone: '+1 (555) 911-0199',
    address: '450 Healthcare Blvd, Metro Center',
    emergencyRoom: 'Open 24/7'
  },
  {
    id: 'hosp_2',
    name: 'Mercy Urgent Care & Specialty Clinic',
    type: 'Urgent Care',
    distance: '2.8 km',
    lat: 40.7180,
    lng: -74.0120,
    phone: '+1 (555) 432-8800',
    address: '120 Wellness Ave, Suite 300',
    emergencyRoom: '8:00 AM - 10:00 PM'
  },
  {
    id: 'hosp_3',
    name: 'City Children & Family Medical Center',
    type: 'Pediatric & General ER',
    distance: '4.1 km',
    lat: 40.7050,
    lng: -73.9980,
    phone: '+1 (555) 777-3400',
    address: '88 Riverfront Drive',
    emergencyRoom: 'Open 24/7'
  }
];

export const HospitalMap = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const hospitalIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: #ef4444; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);">🏥</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      HOSPITALS_DATA.forEach((hosp) => {
        const marker = L.marker([hosp.lat, hosp.lng], { icon: hospitalIcon }).addTo(map);
        marker.bindPopup(`<b>${hosp.name}</b><br/>${hosp.type}<br/>📞 ${hosp.phone}`);
        marker.on('click', () => setSelectedHospital(hosp));
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <MapPin className="w-8 h-8 text-amber-400" />
            <span>Geospatial Nearby Hospital Finder</span>
          </h1>
          <p className="text-xs text-slate-400">
            Powered by Leaflet.js & OpenStreetMap tile rendering. Locate 24/7 emergency trauma centers and urgent care clinics.
          </p>
        </div>

        <a
          href="tel:911"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-extrabold text-xs shadow-lg hover:bg-red-500 transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 911 / 112 Hotline</span>
        </a>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-2 glass-panel p-2 rounded-3xl border border-slate-800 overflow-hidden h-[450px] relative">
          <div ref={mapContainerRef} className="w-full h-full rounded-2xl z-10"></div>
        </div>

        {/* Facilities List */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-400" />
            <span>Nearby Medical Facilities ({HOSPITALS_DATA.length})</span>
          </h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {HOSPITALS_DATA.map((hosp) => (
              <div
                key={hosp.id}
                onClick={() => setSelectedHospital(hosp)}
                className={`glass-panel p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedHospital?.id === hosp.id 
                    ? 'border-amber-500 bg-amber-500/10' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-white">{hosp.name}</h4>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {hosp.distance}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-1">{hosp.address}</p>
                
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold">{hosp.emergencyRoom}</span>
                  <a
                    href={`tel:${hosp.phone}`}
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
