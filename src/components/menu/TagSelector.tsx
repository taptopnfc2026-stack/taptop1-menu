import React, { useState } from 'react';
import { Tag, X, Plus } from 'lucide-react';

export interface TagGroup {
  category: 'dietary' | 'style' | 'characteristics';
  label: string;
  labelZh: string;
  labelEs: string;
  labelFr: string;
  labelDe: string;
  max: number;
  tags: {
    id: string;
    label: string;
    labelZh: string;
    labelEs: string;
    labelFr: string;
    labelDe: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }[];
}

export const TAG_GROUPS: TagGroup[] = [
  {
    category: 'dietary',
    label: 'Dietary',
    labelZh: '饮食类型',
    labelEs: 'Dietético',
    labelFr: 'Régime',
    labelDe: 'Ernährung',
    max: 3,
    tags: [
      { id: 'gluten-free', label: 'Gluten Free', labelZh: '无麸质', labelEs: 'Sin Gluten', labelFr: 'Sans Gluten', labelDe: 'Glutenfrei', color: '#059669', bgColor: '#ECFDF5', borderColor: '#A7F3D0' },
      { id: 'vegan', label: 'Vegan', labelZh: '纯素', labelEs: 'Vegano', labelFr: 'Végétalien', labelDe: 'Vegan', color: '#16A34A', bgColor: '#F0FDF4', borderColor: '#86EFAC' },
      { id: 'vegetarian', label: 'Vegetarian', labelZh: '素食', labelEs: 'Vegetariano', labelFr: 'Végétarien', labelDe: 'Vegetarisch', color: '#65A30D', bgColor: '#F7FEE7', borderColor: '#D9F99D' },
      { id: 'halal', label: 'Halal', labelZh: '清真', labelEs: 'Halal', labelFr: 'Halal', labelDe: 'Halal', color: '#047857', bgColor: '#ECFDF5', borderColor: '#A7F3D0' },
      { id: 'kosher', label: 'Kosher', labelZh: '犹太洁食', labelEs: 'Kosher', labelFr: 'Casher', labelDe: 'Koscher', color: '#0F766E', bgColor: '#F0FDFA', borderColor: '#99F6E4' },
      { id: 'dairy-free', label: 'Dairy Free', labelZh: '无乳制品', labelEs: 'Sin Lactosa', labelFr: 'Sans Lactose', labelDe: 'Laktosefrei', color: '#0891B2', bgColor: '#ECFEFF', borderColor: '#A5F3FC' },
      { id: 'nut-free', label: 'Nut Free', labelZh: '无坚果', labelEs: 'Sin Frutos Secos', labelFr: 'Sans Fruits à Coque', labelDe: 'Nussfrei', color: '#7C3AED', bgColor: '#F5F3FF', borderColor: '#DDD6FE' },
    ],
  },
  {
    category: 'style',
    label: 'Style',
    labelZh: '风格',
    labelEs: 'Estilo',
    labelFr: 'Style',
    labelDe: 'Stil',
    max: 3,
    tags: [
      { id: 'new', label: 'New', labelZh: '新品', labelEs: 'Nuevo', labelFr: 'Nouveau', labelDe: 'Neu', color: '#2563EB', bgColor: '#EFF6FF', borderColor: '#BFDBFE' },
      { id: 'best-seller', label: 'Best Seller', labelZh: '热销', labelEs: 'Más Vendido', labelFr: 'Best-Seller', labelDe: 'Bestseller', color: '#D97706', bgColor: '#FFFBEB', borderColor: '#FDE68A' },
      { id: 'signature', label: 'Signature', labelZh: '招牌', labelEs: 'Especialidad', labelFr: 'Signature', labelDe: 'Signatur', color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA' },
      { id: 'chefs-choice', label: "Chef's Choice", labelZh: '主厨推荐', labelEs: 'Selección del Chef', labelFr: 'Choix du Chef', labelDe: "Chef's Choice", color: '#7C2D12', bgColor: '#FFF7ED', borderColor: '#FED7AA' },
      { id: 'seasonal', label: 'Seasonal', labelZh: '时令', labelEs: 'De Temporada', labelFr: 'Saisonnier', labelDe: 'Saisonal', color: '#EA580C', bgColor: '#FFF7ED', borderColor: '#FED7AA' },
      { id: 'limited', label: 'Limited', labelZh: '限量', labelEs: 'Limitado', labelFr: 'Limité', labelDe: 'Limitiert', color: '#BE185D', bgColor: '#FDF2F8', borderColor: '#FBCFE8' },
    ],
  },
  {
    category: 'characteristics',
    label: 'Characteristics',
    labelZh: '特色',
    labelEs: 'Características',
    labelFr: 'Caractéristiques',
    labelDe: 'Eigenschaften',
    max: 5,
    tags: [
      { id: 'homemade', label: 'Homemade', labelZh: '自制', labelEs: 'Casero', labelFr: 'Fait Maison', labelDe: 'Hausgemacht', color: '#9333EA', bgColor: '#FAF5FF', borderColor: '#E9D5FF' },
      { id: 'local', label: 'Local', labelZh: '本地', labelEs: 'Local', labelFr: 'Local', labelDe: 'Lokal', color: '#059669', bgColor: '#ECFDF5', borderColor: '#A7F3D0' },
      { id: 'spicy', label: 'Spicy', labelZh: '辣', labelEs: 'Picante', labelFr: 'Épicé', labelDe: 'Scharf', color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA' },
      { id: 'in-season', label: 'In Season', labelZh: '当季', labelEs: 'De Temporada', labelFr: 'De Saison', labelDe: 'Saisonal', color: '#16A34A', bgColor: '#F0FDF4', borderColor: '#86EFAC' },
      { id: 'organic', label: 'Organic', labelZh: '有机', labelEs: 'Orgánico', labelFr: 'Bio', labelDe: 'Bio', color: '#65A30D', bgColor: '#F7FEE7', borderColor: '#D9F99D' },
      { id: 'fresh', label: 'Fresh', labelZh: '新鲜', labelEs: 'Fresco', labelFr: 'Frais', labelDe: 'Frisch', color: '#0D9488', bgColor: '#F0FDFA', borderColor: '#99F6E4' },
      { id: 'grilled', label: 'Grilled', labelZh: '烤制', labelEs: 'A la Parrilla', labelFr: 'Grillé', labelDe: 'Gegrillt', color: '#B45309', bgColor: '#FFFBEB', borderColor: '#FDE68A' },
      { id: 'handcrafted', label: 'Handcrafted', labelZh: '手工', labelEs: 'Artesanal', labelFr: 'Artisanal', labelDe: 'Handgefertigt', color: '#4F46E5', bgColor: '#EEF2FF', borderColor: '#C7D2FE' },
      { id: 'traditional', label: 'Traditional', labelZh: '传统', labelEs: 'Tradicional', labelFr: 'Traditionnel', labelDe: 'Traditionell', color: '#7C2D12', bgColor: '#FFF7ED', borderColor: '#FED7AA' },
    ],
  },
];

const getTagLabel = (tag: TagGroup['tags'][0], lang?: string) => {
  switch (lang) {
    case 'zh': return tag.labelZh;
    case 'es': return tag.labelEs;
    case 'fr': return tag.labelFr;
    case 'de': return tag.labelDe;
    default: return tag.label;
  }
};

const getGroupLabel = (group: TagGroup, lang?: string) => {
  switch (lang) {
    case 'zh': return group.labelZh;
    case 'es': return group.labelEs;
    case 'fr': return group.labelFr;
    case 'de': return group.labelDe;
    default: return group.label;
  }
};

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  language?: string;
  maxCustomTags?: number;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  language = 'en',
  maxCustomTags = 10,
}) => {
  const [customTagInput, setCustomTagInput] = useState('');
  const [customTags, setCustomTags] = useState<{ id: string; label: string }[]>([]);

  const toggleTag = (id: string) => {
    if (selectedTags.includes(id)) {
      onChange(selectedTags.filter(t => t !== id));
    } else {
      onChange([...selectedTags, id]);
    }
  };

  const addCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (customTags.length >= maxCustomTags) return;
    if (customTags.some(t => t.label.toLowerCase() === trimmed.toLowerCase())) return;
    
    const newTag = { id: `custom-${Date.now()}`, label: trimmed };
    setCustomTags([...customTags, newTag]);
    onChange([...selectedTags, newTag.id]);
    setCustomTagInput('');
  };

  const removeCustomTag = (id: string) => {
    setCustomTags(customTags.filter(t => t.id !== id));
    onChange(selectedTags.filter(t => t !== id));
  };

  const totalSelected = selectedTags.length;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          <h4 className="font-semibold text-gray-900">
            {language === 'zh' ? '标签' : 'Tags'}
          </h4>
          <span className="text-xs text-gray-400">
            {language === 'zh' ? '可选' : 'optional'}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {language === 'zh' ? `${totalSelected} 已选` : `${totalSelected} selected`}
        </span>
      </div>

      {/* Tag Groups */}
      {TAG_GROUPS.map(group => {
        const groupSelected = selectedTags.filter(id => 
          group.tags.some(t => t.id === id)
        );
        return (
          <div key={group.category} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {getGroupLabel(group, language)}
              </span>
              <span className="text-xs text-gray-400">
                ({groupSelected.length}/{group.max})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.tags.map(tag => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => {
                      if (!isSelected && groupSelected.length >= group.max) return;
                      toggleTag(tag.id);
                    }}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-all duration-200"
                    style={isSelected ? {
                      color: tag.color,
                      backgroundColor: tag.bgColor,
                      borderColor: tag.borderColor,
                    } : {
                      color: '#6B7280',
                      backgroundColor: '#F9FAFB',
                      borderColor: '#E5E7EB',
                    }}
                  >
                    {getTagLabel(tag, language)}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Custom Tags */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {language === 'zh' ? '自定义标签' : 'Custom Tags'}
          </span>
          <span className="text-xs text-gray-400">
            ({customTags.length}/{maxCustomTags})
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
            placeholder={language === 'zh' ? '输入自定义标签...' : 'Add custom tag...'}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
          <button
            onClick={addCustomTag}
            disabled={!customTagInput.trim() || customTags.length >= maxCustomTags}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {customTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg"
              >
                {tag.label}
                <button
                  onClick={() => removeCustomTag(tag.id)}
                  className="p-0.5 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;
