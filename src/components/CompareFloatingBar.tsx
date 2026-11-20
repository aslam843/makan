import { ArrowRight, Scale, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function CompareFloatingBar() {
  const { compareList, removeCompareItem, clearCompareList, toastMessage } = useAppContext();
  const location = useLocation();
  const hideCompareTray = location.pathname === '/compare';

  return (
    <>
      {/* Subtle Toast Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-4 sm:right-6 z-50 bg-slate-950 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg border border-slate-800"
        >
          {toastMessage}
        </div>
      )}

      {/* Compact Compare Dock (only when user explicitly adds projects) */}
      {!hideCompareTray && compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Scale className="w-4 h-4 text-[#D1D5DB] shrink-0" />
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {compareList.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 whitespace-nowrap"
                >
                  <span className="max-w-[110px] truncate">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => removeCompareItem(item.id)}
                    aria-label={`Remove ${item.name} from compare`}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={clearCompareList}
              className="hidden sm:inline text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Clear
            </button>
            <Link
              to={`/compare?ids=${compareList.map((c) => c.id).join(',')}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#4B5563] hover:bg-[#374151] text-white rounded-lg transition-colors whitespace-nowrap"
            >
              Compare ({compareList.length}/3)
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
