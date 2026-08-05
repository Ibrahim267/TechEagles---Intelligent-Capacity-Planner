import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapacity } from '../context/CapacityContext';
import { parseExcelWorkbook } from '../services/dataParser';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Store, 
  Users, 
  Clock, 
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { loadCustomDataset, loadBaselineDataset, dataset } = useCapacity();

  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrorMessage('Please upload a valid Excel workbook (.xlsx or .xls)');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const parsedDataset = await parseExcelWorkbook(file);
      loadCustomDataset(parsedDataset);
      setLoading(false);
      // Navigate to animated loading transition page
      navigate('/analysis-loading');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to parse Excel workbook: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  const handleBaselineLoad = () => {
    setLoading(true);
    setTimeout(() => {
      loadBaselineDataset();
      setLoading(false);
      navigate('/analysis-loading');
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-cyan-400">
          <Database className="w-3.5 h-3.5" />
          <span>Step 1 of 3: Dataset Ingestion & Validation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Ingest Operational Dataset</h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Upload an Excel workbook containing <code className="text-cyan-300 font-mono">Store_Metadata</code>, <code className="text-cyan-300 font-mono">Demand_Forecast</code>, and <code className="text-cyan-300 font-mono">Courier_Roster</code> sheets, or load the pre-parsed EMX Hackathon dataset.
        </p>
      </div>

      {/* Main Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Custom Excel File Drag & Drop */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`relative p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-4 ${
            dragOver 
              ? 'border-blue-400 bg-blue-500/10' 
              : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Upload Custom .xlsx Workbook</h3>
            <p className="text-xs text-slate-400 mt-1">Accepts .xlsx multi-sheet files with 3 required sheets</p>
          </div>

          <label className="cursor-pointer">
            <span className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold inline-block transition-all">
              Browse Excel File
            </span>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
          </label>

          <div className="text-[10px] text-slate-500 space-y-1">
            <p>Required Sheets: Store_Metadata • Demand_Forecast • Courier_Roster</p>
          </div>
        </div>

        {/* Instant Pre-Parsed Baseline Loader Button */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Load Baseline Hackathon Dataset</h3>
              <p className="text-xs text-slate-400 mt-1">
                Instantly load pre-parsed 13-week operational data across 10 EMX Dark Stores, 43,680 demand slots, and 67 active couriers.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                <span>Pre-configured 10 Dark Stores across UAE</span>
              </div>
              <div className="flex items-center text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                <span>43,680 30-minute interval demand slots</span>
              </div>
              <div className="flex items-center text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                <span>67 Couriers with FTE/FTC shift rosters</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBaselineLoad}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Loading Dataset...</span>
            ) : (
              <>
                <span>Load EMX Hackathon Baseline Dataset</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Dataset Summary Widget */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Current Loaded Dataset Statistics</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {dataset.metadata.filename || 'EMX Baseline Dataset'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
              <Store className="w-4 h-4 text-blue-400" />
              <span>Total Dark Stores</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{dataset.stores.length}</div>
            <div className="text-[10px] text-slate-500">Dubai, AUH, SHJ, Ajman, RAK</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Forecast Horizon</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{dataset.metadata.horizon_weeks} Weeks</div>
            <div className="text-[10px] text-slate-500">Rolling 13-Week Horizon</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>30-Min Demand Slots</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{dataset.demand.length.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">00:00 to 23:30 Granularity</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Active Fleet Roster</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{dataset.couriers.length} Couriers</div>
            <div className="text-[10px] text-slate-500">
              {dataset.couriers.filter(c => c.employment_type === 'FTE').length} FTE / {dataset.couriers.filter(c => c.employment_type === 'FTC').length} FTC
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
