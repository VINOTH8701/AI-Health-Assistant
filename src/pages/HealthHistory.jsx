import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateHealthReportPDF } from '../utils/pdfGenerator';
import { 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  FileDown, 
  BarChart3, 
  Calendar, 
  AlertCircle,
  TrendingUp,
  Stethoscope
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const HealthHistory = ({ setActiveTab }) => {
  const { user, symptomHistory, deleteSymptomRecord } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showChart, setShowChart] = useState(true);

  // Filter logs
  const filteredHistory = symptomHistory.filter(item => {
    const matchesSearch = item.rawInput.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.aiAnalysis?.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (severityFilter === 'mild') return matchesSearch && item.severityScale <= 3;
    if (severityFilter === 'moderate') return matchesSearch && item.severityScale >= 4 && item.severityScale <= 6;
    if (severityFilter === 'severe') return matchesSearch && item.severityScale >= 7;
    return matchesSearch;
  });

  // Chart Data preparation
  const chartLabels = symptomHistory.slice().reverse().map(item => new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  const chartValues = symptomHistory.slice().reverse().map(item => item.severityScale);

  const chartData = {
    labels: chartLabels.length > 0 ? chartLabels : ['No Logs'],
    datasets: [
      {
        label: 'Symptom Severity (1-10)',
        data: chartValues.length > 0 ? chartValues : [0],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#10b981'
      }
    },
    scales: {
      y: { min: 0, max: 10, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  const handleDownloadPDF = () => {
    generateHealthReportPDF(user, symptomHistory);
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-emerald-400" />
            <span>Health History & Medical Timeline</span>
          </h1>
          <p className="text-xs text-slate-400">
            Chronological records of all AI symptom evaluations, severity trends, and PDF export logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChart(!showChart)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-800"
          >
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span>{showChart ? 'Hide Chart' : 'Show Analytics'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
          >
            <FileDown className="w-4 h-4" />
            <span>Export PDF Digest</span>
          </button>
        </div>
      </div>

      {/* Analytics Graph Card */}
      {showChart && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Symptom Severity Trend Graph</h3>
            </div>
            <span className="text-xs text-slate-400">10-Point Rating Scale</span>
          </div>
          <div className="h-56">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symptoms or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {['all', 'mild', 'moderate', 'severe'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSeverityFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                severityFilter === filter
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No matching symptom logs found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or log a new symptom.</p>
            <button
              onClick={() => setActiveTab('triage')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold inline-flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Start New AI Triage</span>
            </button>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              
              <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      Input: {item.inputMode || 'text'}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white">
                    "{item.rawInput}"
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.severityScale >= 7 ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    item.severityScale >= 4 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    Severity {item.severityScale}/10
                  </span>

                  <button
                    onClick={() => deleteSymptomRecord(item.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="font-extrabold text-emerald-400">AI Assessment:</span>
                  <p className="text-slate-300">{item.aiAnalysis?.summary}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="font-extrabold text-teal-400">Recommended Self Care:</span>
                  <p className="text-slate-300">
                    {item.aiAnalysis?.recommendedActions ? item.aiAnalysis.recommendedActions.join(' • ') : 'Rest and stay hydrated.'}
                  </p>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
