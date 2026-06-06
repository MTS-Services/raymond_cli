const STORAGE_KEY = 'skyridge:mortgageApplicationDraft';
const MORTGAGE_KEY = 'skyridge:mortgageApplicationDraft:mortgage';
const REFINANCE_KEY = 'skyridge:mortgageApplicationDraft:refinance';
const ACTIVE_CALCULATOR_KEY = 'skyridge:mortgageApplicationDraft:activeCalculator';

export const CALCULATOR_TYPES = {
  MORTGAGE: 'mortgage',
  REFINANCE: 'refinance',
};

export function saveMortgageApplicationDraft(draft) {
  if (typeof window === 'undefined') return;

  const payload = {
    ...draft,
    updatedAt: Date.now(),
  };

  const key =
    draft?.calculatorType === CALCULATOR_TYPES.REFINANCE
      ? REFINANCE_KEY
      : MORTGAGE_KEY;

  window.localStorage.setItem(key, JSON.stringify(payload));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getAllMortgageApplicationDrafts() {
  if (typeof window === 'undefined') return { mortgage: null, refinance: null, activeCalculator: null };

  const readDraft = (key) => {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  return {
    mortgage: readDraft(MORTGAGE_KEY),
    refinance: readDraft(REFINANCE_KEY),
    activeCalculator: window.localStorage.getItem(ACTIVE_CALCULATOR_KEY),
  };
}

export function setActiveCalculator(calculatorType) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACTIVE_CALCULATOR_KEY, calculatorType || '');
}

export function getMortgageApplicationDraft() {
  if (typeof window === 'undefined') return null;

  const readDraft = (key) => {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const activeDraft = readDraft(STORAGE_KEY);
  const mortgageDraft = readDraft(MORTGAGE_KEY);
  const refinanceDraft = readDraft(REFINANCE_KEY);
  const activeCalculator = window.localStorage.getItem(ACTIVE_CALCULATOR_KEY);

  if (activeCalculator === CALCULATOR_TYPES.MORTGAGE && mortgageDraft) {
    return mortgageDraft;
  }

  if (activeCalculator === CALCULATOR_TYPES.REFINANCE && refinanceDraft) {
    return refinanceDraft;
  }

  const drafts = [activeDraft, mortgageDraft, refinanceDraft].filter(Boolean);
  if (drafts.length === 0) return null;

  return drafts.reduce((latest, current) => {
    const latestTime = latest?.updatedAt || 0;
    const currentTime = current?.updatedAt || 0;
    return currentTime >= latestTime ? current : latest;
  });
}

export function clearMortgageApplicationDraft() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(MORTGAGE_KEY);
  window.localStorage.removeItem(REFINANCE_KEY);
  window.localStorage.removeItem(ACTIVE_CALCULATOR_KEY);
}
