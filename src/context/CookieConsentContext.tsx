import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentContextType {
  consent: ConsentState;
  hasInteracted: boolean;
  acceptAll: () => void;
  acceptSelected: (selected: ConsentState) => void;
  rejectAll: () => void;
  updateConsent: (category: ConsentCategory, value: boolean) => void;
  resetConsent: () => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const CONSENT_KEY = 'taptopmenu_cookie_consent';

const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

function loadConsent(): { consent: ConsentState; hasInteracted: boolean } | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        consent: {
          necessary: parsed.necessary ?? true,
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
          preferences: parsed.preferences ?? false,
        },
        hasInteracted: true,
      };
    }
  } catch { /* ignore */ }
  return null;
}

function saveConsent(consent: ConsentState) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify({
    ...consent,
    timestamp: new Date().toISOString(),
  }));
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showBanner, setShowBannerRaw] = useState(true);

  useEffect(() => {
    const saved = loadConsent();
    if (saved) {
      setConsent(saved.consent);
      setHasInteracted(true);
      setShowBannerRaw(false);
    }
  }, []);

  const setShowBanner = useCallback((show: boolean) => {
    setShowBannerRaw(show);
  }, []);

  const applyConsent = useCallback((newConsent: ConsentState) => {
    setConsent(newConsent);
    setHasInteracted(true);
    setShowBannerRaw(false);
    saveConsent(newConsent);
  }, []);

  const acceptAll = useCallback(() => {
    applyConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  }, [applyConsent]);

  const acceptSelected = useCallback((selected: ConsentState) => {
    applyConsent({ ...selected, necessary: true });
  }, [applyConsent]);

  const rejectAll = useCallback(() => {
    applyConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  }, [applyConsent]);

  const updateConsent = useCallback((category: ConsentCategory, value: boolean) => {
    setConsent(prev => {
      const next = { ...prev, [category]: value };
      saveConsent(next);
      return next;
    });
  }, []);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_KEY);
    setConsent(defaultConsent);
    setHasInteracted(false);
    setShowBannerRaw(true);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasInteracted,
        acceptAll,
        acceptSelected,
        rejectAll,
        updateConsent,
        resetConsent,
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
