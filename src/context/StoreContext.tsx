import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Store, ReviewTemplate } from '@/types';

interface StoreState {
  stores: Store[];
  templates: ReviewTemplate[];
  isLoading: boolean;
}

type StoreAction =
  | { type: 'SET_STORES'; payload: Store[] }
  | { type: 'ADD_STORE'; payload: Store }
  | { type: 'UPDATE_STORE'; payload: Store }
  | { type: 'DELETE_STORE'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: ReviewTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: ReviewTemplate }
  | { type: 'ADD_TEMPLATES'; payload: ReviewTemplate[] }
  | { type: 'UPDATE_TEMPLATE'; payload: ReviewTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

interface StoreContextType extends StoreState {
  addStore: (store: Store) => void;
  updateStore: (store: Store) => void;
  deleteStore: (id: string) => void;
  getStoreById: (id: string) => Store | undefined;
  addTemplate: (template: ReviewTemplate) => void;
  addBulkTemplates: (templates: ReviewTemplate[]) => void;
  updateTemplate: (template: ReviewTemplate) => void;
  deleteTemplate: (id: string) => void;
  getTemplatesByStoreId: (storeId: string) => ReviewTemplate[];
  markTemplateUsed: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialState: StoreState = {
  stores: [],
  templates: [],
  isLoading: true,
};

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'SET_STORES':
      return { ...state, stores: action.payload, isLoading: false };
    case 'ADD_STORE':
      return { ...state, stores: [...state.stores, action.payload] };
    case 'UPDATE_STORE':
      return {
        ...state,
        stores: state.stores.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'DELETE_STORE':
      return {
        ...state,
        stores: state.stores.filter((s) => s.id !== action.payload),
        templates: state.templates.filter((t) => t.storeId !== action.payload),
      };
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'ADD_TEMPLATES':
      return { ...state, templates: [...state.templates, ...action.payload] };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TEMPLATE':
      return { ...state, templates: state.templates.filter((t) => t.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  useEffect(() => {
    const storedStores = localStorage.getItem('taptopmenu_stores');
    const storedTemplates = localStorage.getItem('taptopmenu_templates');
    
    if (storedStores) {
      try {
        const stores = JSON.parse(storedStores).map((s: Store) => ({
          ...s,
          createdAt: new Date(s.createdAt),
        }));
        dispatch({ type: 'SET_STORES', payload: stores });
      } catch {
        dispatch({ type: 'SET_STORES', payload: [] });
      }
    } else {
      dispatch({ type: 'SET_STORES', payload: [] });
    }

    if (storedTemplates) {
      try {
        const templates = JSON.parse(storedTemplates).map((t: ReviewTemplate) => ({
          ...t,
          createdAt: new Date(t.createdAt),
        }));
        dispatch({ type: 'SET_TEMPLATES', payload: templates });
      } catch {
        dispatch({ type: 'SET_TEMPLATES', payload: [] });
      }
    } else {
      dispatch({ type: 'SET_TEMPLATES', payload: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('taptopmenu_stores', JSON.stringify(state.stores));
    }
  }, [state.stores, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('taptopmenu_templates', JSON.stringify(state.templates));
    }
  }, [state.templates, state.isLoading]);

  const addStore = (store: Store) => {
    dispatch({ type: 'ADD_STORE', payload: store });
  };

  const updateStore = (store: Store) => {
    dispatch({ type: 'UPDATE_STORE', payload: store });
  };

  const deleteStore = (id: string) => {
    dispatch({ type: 'DELETE_STORE', payload: id });
  };

  const getStoreById = (id: string) => {
    return state.stores.find((s) => s.id === id);
  };

  const addTemplate = (template: ReviewTemplate) => {
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  };

  const addBulkTemplates = (templates: ReviewTemplate[]) => {
    dispatch({ type: 'ADD_TEMPLATES', payload: templates });
  };

  const updateTemplate = (template: ReviewTemplate) => {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: template });
  };

  const deleteTemplate = (id: string) => {
    dispatch({ type: 'DELETE_TEMPLATE', payload: id });
  };

  const getTemplatesByStoreId = (storeId: string) => {
    return state.templates.filter((t) => t.storeId === storeId);
  };

  const markTemplateUsed = (id: string) => {
    const template = state.templates.find((t) => t.id === id);
    if (template) {
      updateTemplate({ ...template, status: 'used' });
    }
  };

  return (
    <StoreContext.Provider
      value={{
        ...state,
        addStore,
        updateStore,
        deleteStore,
        getStoreById,
        addTemplate,
        addBulkTemplates,
        updateTemplate,
        deleteTemplate,
        getTemplatesByStoreId,
        markTemplateUsed,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStores() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
}
