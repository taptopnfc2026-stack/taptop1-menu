import React, { useState } from 'react';
import { Sparkles, Shield, X, Info } from 'lucide-react';

export interface AllergenInfo {
  id: string;
  name: string;
  nameZh: string;
  nameEs: string;
  nameFr: string;
  nameDe: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

export const EU_ALLERGENS: AllergenInfo[] = [
  {
    id: 'gluten',
    name: 'Gluten',
    nameZh: '麸质',
    nameEs: 'Gluten',
    nameFr: 'Gluten',
    nameDe: 'Gluten',
    color: '#D97706',
    bgColor: '#FEF3C7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-1 2-3 4-3 7" />
        <path d="M12 3c1 2 3 4 3 7" />
        <path d="M8 8c-1 1-2 3-2 5" />
        <path d="M16 8c1 1 2 3 2 5" />
        <path d="M12 10v8" />
        <path d="M9 15c0 1 1 2 3 2s3-1 3-2" />
      </svg>
    ),
  },
  {
    id: 'crustaceans',
    name: 'Crustaceans',
    nameZh: '甲壳类',
    nameEs: 'Crustáceos',
    nameFr: 'Crustacés',
    nameDe: 'Krebstiere',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 14c-2 0-3-2-3-4" />
        <path d="M18 14c2 0 3-2 3-4" />
        <path d="M8 12c0-2 2-5 4-5s4 3 4 5" />
        <path d="M10 12c-1 1-1 3 0 5" />
        <path d="M14 12c1 1 1 3 0 5" />
        <path d="M12 17v4" />
        <circle cx="12" cy="9" r="1" />
      </svg>
    ),
  },
  {
    id: 'eggs',
    name: 'Eggs',
    nameZh: '蛋类',
    nameEs: 'Huevos',
    nameFr: 'Oeufs',
    nameDe: 'Eier',
    color: '#EAB308',
    bgColor: '#FEF9C3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="13" rx="6" ry="8" />
        <path d="M12 5c-2 2-3 4-3 6" />
      </svg>
    ),
  },
  {
    id: 'fish',
    name: 'Fish',
    nameZh: '鱼类',
    nameEs: 'Pescado',
    nameFr: 'Poisson',
    nameDe: 'Fisch',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12c0-3 3-5 8-5s8 2 8 5-3 5-8 5-8-2-8-5z" />
        <path d="M2 12c1 0 3 1 4 2" />
        <circle cx="16" cy="11" r="1" fill="currentColor" />
        <path d="M6 12c-1 1-1 3 0 4" />
      </svg>
    ),
  },
  {
    id: 'peanuts',
    name: 'Peanuts',
    nameZh: '花生',
    nameEs: 'Cacahuetes',
    nameFr: 'Arachides',
    nameDe: 'Erdnüsse',
    color: '#92400E',
    bgColor: '#FEF3C7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="10" cy="14" rx="4" ry="6" transform="rotate(-30 10 14)" />
        <ellipse cx="14" cy="14" rx="4" ry="6" transform="rotate(30 14 14)" />
        <path d="M12 8c0-1 1-3 2-3" />
        <path d="M12 8c0-1-1-3-2-3" />
      </svg>
    ),
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    nameZh: '大豆',
    nameEs: 'Soja',
    nameFr: 'Soja',
    nameDe: 'Soja',
    color: '#65A30D',
    bgColor: '#ECFCCB',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c-2 2-3 5-3 8" />
        <path d="M12 3c2 2 3 5 3 8" />
        <ellipse cx="9" cy="13" rx="3" ry="4" />
        <ellipse cx="15" cy="13" rx="3" ry="4" />
        <path d="M9 17c0 1 1 2 3 2s3-1 3-2" />
      </svg>
    ),
  },
  {
    id: 'milk',
    name: 'Milk / Lactose',
    nameZh: '牛奶/乳糖',
    nameEs: 'Leche / Lactosa',
    nameFr: 'Lait / Lactose',
    nameDe: 'Milch / Laktose',
    color: '#0891B2',
    bgColor: '#CFFAFE',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 6c0-2 2-3 5-3s5 1 5 3v14c0 2-2 3-5 3s-5-1-5-3V6z" />
        <path d="M7 6c-1 0-2 1-2 2v10c0 1 1 2 2 2" />
        <path d="M17 6c1 0 2 1 2 2v10c0 1-1 2-2 2" />
        <line x1="12" y1="3" x2="12" y2="6" />
      </svg>
    ),
  },
  {
    id: 'nuts',
    name: 'Tree Nuts',
    nameZh: '坚果',
    nameEs: 'Frutos secos',
    nameFr: 'Fruits à coque',
    nameDe: 'Schalenfrüchte',
    color: '#7C2D12',
    bgColor: '#FEF3C7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4c-3 0-5 2-5 5 0 3 2 6 5 8" />
        <path d="M12 4c3 0 5 2 5 5 0 3-2 6-5 8" />
        <path d="M12 17v4" />
        <path d="M10 21h4" />
      </svg>
    ),
  },
  {
    id: 'celery',
    name: 'Celery',
    nameZh: '芹菜',
    nameEs: 'Apio',
    nameFr: 'Céleri',
    nameDe: 'Sellerie',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 4v16" />
        <path d="M14 4v16" />
        <path d="M8 8h4" />
        <path d="M12 12h4" />
        <path d="M8 16h4" />
        <path d="M10 4c0-1 1-2 2-2s2 1 2 2" />
      </svg>
    ),
  },
  {
    id: 'mustard',
    name: 'Mustard',
    nameZh: '芥末',
    nameEs: 'Mostaza',
    nameFr: 'Moutarde',
    nameDe: 'Senf',
    color: '#CA8A04',
    bgColor: '#FEF9C3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
        <path d="M12 5V3" />
        <path d="M16 7l1.5-1.5" />
        <path d="M8 7L6.5 5.5" />
      </svg>
    ),
  },
  {
    id: 'sesame',
    name: 'Sesame',
    nameZh: '芝麻',
    nameEs: 'Sésamo',
    nameFr: 'Sésame',
    nameDe: 'Sesam',
    color: '#4338CA',
    bgColor: '#E0E7FF',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="12" cy="6" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="17" cy="9" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="17" cy="15" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="12" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="7" cy="15" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="7" cy="9" r="1.5" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'sulphites',
    name: 'Sulphur dioxide / Sulphites',
    nameZh: '亚硫酸盐',
    nameEs: 'Dióxido de azufre / Sulfitos',
    nameFr: 'Dioxyde de soufre / Sulfites',
    nameDe: 'Schwefeldioxid / Sulfite',
    color: '#475569',
    bgColor: '#F1F5F9',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 16c0-4 3-8 6-10" />
        <path d="M18 16c0-4-3-8-6-10" />
        <path d="M6 16h12" />
        <path d="M8 12h8" />
        <path d="M10 8h4" />
      </svg>
    ),
  },
  {
    id: 'lupin',
    name: 'Lupin',
    nameZh: '羽扇豆',
    nameEs: 'Altramuz',
    nameFr: 'Lupin',
    nameDe: 'Lupine',
    color: '#BE185D',
    bgColor: '#FCE7F3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4c1 1 2 3 2 5" />
        <path d="M12 4c-1 1-2 3-2 5" />
        <ellipse cx="12" cy="13" rx="4" ry="5" />
        <path d="M12 18v3" />
        <path d="M10 21h4" />
      </svg>
    ),
  },
  {
    id: 'molluscs',
    name: 'Molluscs',
    nameZh: '软体动物',
    nameEs: 'Moluscos',
    nameFr: 'Mollusques',
    nameDe: 'Weichtiere',
    color: '#0F766E',
    bgColor: '#CCFBF1',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 18c0-5 2-10 4-10s4 5 4 10" />
        <path d="M8 18c-2 0-3-1-3-3" />
        <path d="M16 18c2 0 3-1 3-3" />
        <path d="M10 18c0 1 1 2 2 2s2-1 2-2" />
        <path d="M11 10c0-1 1-2 1-2s1 1 1 2" />
      </svg>
    ),
  },
];

// Keyword-based allergen detection map
export const ALLERGEN_KEYWORDS: Record<string, string[]> = {
  gluten: ['pasta', 'bread', 'pizza', 'noodle', 'burger', 'sandwich', 'croissant', 'cake', 'pie', 'dumpling', 'spring roll', 'wonton', 'bao', 'ramen', 'udon', 'soba', 'fettuccine', 'spaghetti', 'lasagna', 'pastry', 'flour', 'wheat', 'barley', 'rye', 'seitan', 'couscous', 'bulgur', 'farro', 'semolina'],
  crustaceans: ['shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'krill', 'langoustine', 'scampi', 'crawfish'],
  eggs: ['omelette', 'quiche', 'meringue', 'mayonnaise', 'egg', 'aioli', 'custard', 'hollandaise', 'flan', 'tiramisu', 'souffle', 'frittata'],
  fish: ['salmon', 'tuna', 'cod', 'sushi', 'sashimi', 'fish', 'anchovy', 'sardine', 'mackerel', 'trout', 'halibut', 'bass', 'snapper', 'ceviche', 'fish sauce', 'worcestershire'],
  peanuts: ['peanut', 'satay', 'kung pao', 'kungpo', 'kungpao', 'groundnut'],
  soybeans: ['soy', 'tofu', 'miso', 'tempeh', 'edamame', 'soybean', 'soya', 'soy sauce', 'tamari', 'natto'],
  milk: ['cheese', 'cream', 'yogurt', 'butter', 'milk', 'ice cream', 'gelato', 'custard', 'lactose', 'dairy', 'feta', 'mozzarella', 'parmesan', 'cheddar', 'brie', 'ricotta', 'gouda', 'mascarpone'],
  nuts: ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'nut', 'pesto', 'macadamia', 'brazil nut', 'pine nut', 'praline', 'gianduja', 'marzipan'],
  celery: ['celery', 'celeriac', 'celery salt', 'celery seed'],
  mustard: ['mustard', 'dijon', 'wholegrain mustard', 'mustard seed'],
  sesame: ['sesame', 'tahini', 'goma', 'sesame oil', 'halva'],
  sulphites: ['wine', 'vinegar', 'sulphite', 'sulfite', 'sulphur', 'dried fruit', 'pickled', 'canned'],
  lupin: ['lupin', 'lupine', 'lupini'],
  molluscs: ['oyster', 'mussel', 'clam', 'scallop', 'squid', 'octopus', 'snail', 'escargot', 'calamari', 'cuttlefish', 'abalone'],
};

export function detectAllergens(name: string, description: string = ''): string[] {
  const text = `${name} ${description}`.toLowerCase();
  const detected: string[] = [];
  
  Object.entries(ALLERGEN_KEYWORDS).forEach(([allergenId, keywords]) => {
    if (keywords.some(kw => text.includes(kw))) {
      detected.push(allergenId);
    }
  });
  
  return [...new Set(detected)];
}

interface AllergenSelectorProps {
  selectedAllergens: string[];
  onChange: (allergens: string[]) => void;
  suggestedAllergens?: string[];
  onDetect?: () => void;
  isDetecting?: boolean;
  language?: string;
}

const getAllergenName = (allergen: AllergenInfo, lang?: string) => {
  switch (lang) {
    case 'zh': return allergen.nameZh;
    case 'es': return allergen.nameEs;
    case 'fr': return allergen.nameFr;
    case 'de': return allergen.nameDe;
    default: return allergen.name;
  }
};

export const AllergenSelector: React.FC<AllergenSelectorProps> = ({
  selectedAllergens,
  onChange,
  suggestedAllergens = [],
  onDetect,
  isDetecting = false,
  language = 'en',
}) => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const toggleAllergen = (id: string) => {
    if (selectedAllergens.includes(id)) {
      onChange(selectedAllergens.filter(a => a !== id));
    } else {
      onChange([...selectedAllergens, id]);
    }
  };

  const applySuggestion = (id: string) => {
    if (!selectedAllergens.includes(id)) {
      onChange([...selectedAllergens, id]);
    }
  };

  const dismissSuggestion = (id: string) => {
    setDismissedSuggestions([...dismissedSuggestions, id]);
  };

  const activeSuggestions = suggestedAllergens.filter(
    id => !selectedAllergens.includes(id) && !dismissedSuggestions.includes(id)
  );

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          <h4 className="font-semibold text-gray-900">
            {language === 'zh' ? '过敏原' : 'Allergens'}
          </h4>
          <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">
            EU Mandatory
          </span>
        </div>
        {onDetect && (
          <button
            onClick={onDetect}
            disabled={isDetecting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {language === 'zh' ? 'AI 检测' : 'Detect with AI'}
          </button>
        )}
      </div>

      {/* AI Suggestions */}
      {activeSuggestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-800 font-medium">
                {language === 'zh' 
                  ? `检测到 ${activeSuggestions.length} 个可能的过敏原，请确认：` 
                  : `${activeSuggestions.length} potential allergen${activeSuggestions.length > 1 ? 's' : ''} detected. Please confirm:`}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeSuggestions.map(id => {
                  const allergen = EU_ALLERGENS.find(a => a.id === id);
                  if (!allergen) return null;
                  return (
                    <div key={id} className="flex items-center gap-1 bg-white border border-amber-300 rounded-lg px-2 py-1">
                      <span className="text-xs font-medium text-amber-800">
                        {getAllergenName(allergen, language)}
                      </span>
                      <button
                        onClick={() => applySuggestion(id)}
                        className="p-0.5 text-green-600 hover:bg-green-50 rounded"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </button>
                      <button
                        onClick={() => dismissSuggestion(id)}
                        className="p-0.5 text-gray-400 hover:bg-gray-100 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Allergen Grid */}
      <div className="grid grid-cols-7 gap-2">
        {EU_ALLERGENS.map(allergen => {
          const isSelected = selectedAllergens.includes(allergen.id);
          return (
            <button
              key={allergen.id}
              onClick={() => toggleAllergen(allergen.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-current shadow-sm scale-105'
                  : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
              }`}
              style={isSelected ? { color: allergen.color, backgroundColor: allergen.bgColor } : { color: '#9CA3AF' }}
              title={getAllergenName(allergen, language)}
            >
              <div className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                isSelected ? 'bg-white shadow-sm' : 'bg-gray-100'
              }`}>
                <div className="w-6 h-6">
                  {allergen.icon}
                </div>
              </div>
              <span className={`text-[10px] font-medium leading-tight text-center ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                {getAllergenName(allergen, language).split(' ')[0].split('/')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legal Disclaimer */}
      {showDisclaimer && (
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-blue-700 leading-relaxed">
              {language === 'zh'
                ? '过敏原信息由经营者手动确认和填写。AI 建议仅供参考，不构成医疗或法律建议。经营者对过敏原信息的准确性负全部责任。'
                : 'Allergen information must be manually confirmed and entered by the operator. AI suggestions are for reference only and do not constitute medical or legal advice. The operator bears full responsibility for the accuracy of allergen information.'}
            </p>
          </div>
          <button
            onClick={() => setShowDisclaimer(false)}
            className="p-0.5 text-blue-400 hover:text-blue-600 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AllergenSelector;
