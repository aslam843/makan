import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface LeadModalContextPayload {
  title?: string;
  subtitle?: string;
  preferredCity?: string;
  preferredLocality?: string;
  propertySlug?: string;
  propertyName?: string;
  serviceSlug?: string;
  defaultRequirements?: string;
}

interface CompareItemSummary {
  id: string;
  slug: string;
  name: string;
  locality: string;
  city: string;
  heroImage: string;
}

interface AppContextValue {
  isLeadModalOpen: boolean;
  leadContext: LeadModalContextPayload;
  openLeadModal: (payload?: LeadModalContextPayload) => void;
  closeLeadModal: () => void;
  compareList: CompareItemSummary[];
  toggleCompareItem: (item: CompareItemSummary) => void;
  removeCompareItem: (id: string) => void;
  clearCompareList: () => void;
  isInCompare: (id: string) => boolean;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const COMPARE_STORAGE_KEY = 'makani_compare_list_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadContext, setLeadContext] = useState<LeadModalContextPayload>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<CompareItemSummary[]>(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (saved) return JSON.parse(saved) as CompareItemSummary[];
    } catch {
      // Ignore storage error
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
    } catch {
      // Ignore storage error
    }
  }, [compareList]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  }, []);

  const openLeadModal = useCallback((payload?: LeadModalContextPayload) => {
    setLeadContext(payload ?? {});
    setIsLeadModalOpen(true);
  }, []);

  const closeLeadModal = useCallback(() => {
    setIsLeadModalOpen(false);
  }, []);

  const toggleCompareItem = useCallback(
    (item: CompareItemSummary) => {
      setCompareList((prev) => {
        const exists = prev.some((p) => p.id === item.id);
        if (exists) {
          showToast(`Removed ${item.name} from comparison.`);
          return prev.filter((p) => p.id !== item.id);
        }
        if (prev.length >= 3) {
          showToast('You can compare up to 3 properties at a time.');
          return prev;
        }
        showToast(`Added ${item.name} to comparison (${prev.length + 1}/3).`);
        return [...prev, item];
      });
    },
    [showToast]
  );

  const removeCompareItem = useCallback((id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCompareList = useCallback(() => {
    setCompareList([]);
  }, []);

  const isInCompare = useCallback(
    (id: string) => compareList.some((p) => p.id === id),
    [compareList]
  );

  return (
    <AppContext.Provider
      value={{
        isLeadModalOpen,
        leadContext,
        openLeadModal,
        closeLeadModal,
        compareList,
        toggleCompareItem,
        removeCompareItem,
        clearCompareList,
        isInCompare,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
