import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  UtensilsCrossed,
  Globe,
  ArrowLeft,
  ShoppingCart,
  MessageSquare,
  Languages,
  Filter,
} from 'lucide-react';
import type { Menu, MenuItem } from '../../types/menu';
import { supportedLanguages, currencies } from '../../types/menu';
import { EU_ALLERGENS } from '@/components/menu/AllergenSelector';
import { TAG_GROUPS } from '@/components/menu/TagSelector';

interface CartItem {
  item: MenuItem;
  quantity: number;
  categoryName: string;
}

interface Order {
  id: string;
  items: { itemId: string; itemName: string; itemNameMerchant: string; quantity: number; price: number; categoryName: string }[];
  totalAmount: number;
  customerNotes?: string;
  createdAt: Date;
}

// UI labels translation map
const labels: Record<string, Record<string, string>> = {
  viewCart: { en: 'View Cart', zh: '查看购物车', ja: 'カートを見る', ko: '장바구니', es: 'Ver carrito', fr: 'Voir le panier', de: 'Warenkorb', pt: 'Ver carrinho', ar: 'عرض السلة' },
  confirmOrder: { en: 'Confirm Order', zh: '确认订单', ja: '注文確認', ko: '주문 확인', es: 'Confirmar pedido', fr: 'Confirmer', de: 'Bestellung', pt: 'Confirmar', ar: 'تأكيد الطلب' },
  placeOrder: { en: 'Place Order', zh: '确认下单', ja: '注文する', ko: '주문하기', es: 'Hacer pedido', fr: 'Commander', de: 'Bestellen', pt: 'Fazer pedido', ar: 'إرسال الطلب' },
  orderConfirmed: { en: 'Order Confirmed!', zh: '下单成功！', ja: '注文完了！', ko: '주문 완료!', es: '¡Pedido confirmado!', fr: 'Commande confirmée!', de: 'Bestellung bestätigt!', pt: 'Pedido confirmado!', ar: 'تم تأكيد الطلب!' },
  orderNumber: { en: 'Order #', zh: '订单号：', ja: '注文番号：', ko: '주문 번호: ', es: 'Pedido #', fr: 'Commande #', de: 'Bestellung #', pt: 'Pedido #', ar: 'رقم الطلب #' },
  totalItems: { en: 'items', zh: '件', ja: '点', ko: '개', es: 'artículos', fr: 'articles', de: 'Artikel', pt: 'itens', ar: 'عناصر' },
  total: { en: 'Total', zh: '合计', ja: '合計', ko: '합계', es: 'Total', fr: 'Total', de: 'Gesamt', pt: 'Total', ar: 'المجموع' },
  notes: { en: 'Notes', zh: '备注', ja: 'メモ', ko: '메모', es: 'Notas', fr: 'Notes', de: 'Hinweise', pt: 'Notas', ar: 'ملاحظات' },
  notesPlaceholder: { en: 'Any special requests? e.g., less spicy, no cilantro...', zh: '有什么特殊要求？例如：少辣、不要香菜...', ja: '特別なリクエストは？例：少なめ...' , ko: '특별 요청이 있으신가요? 예: 덜 맵게...', es: '¿Alguna petición especial?', fr: 'Des demandes spéciales?', de: 'Besondere Wünsche?', pt: 'Pedidos especiais?', ar: 'طلبات خاصة؟' },
  addToCartHint: { en: 'Tap items to add to cart', zh: '点击菜品添加到购物车', ja: 'タップしてカートに追加', ko: '탭하여 장바구니에 추가', es: 'Toca los artículos para añadir', fr: 'Appuyez pour ajouter', de: 'Tippen zum Hinzufügen', pt: 'Toque para adicionar', ar: 'انقر لإضافة للسلة' },
  yourOrder: { en: 'Your Order', zh: '您的订单', ja: 'お客様の注文', ko: '고객님의 주문', es: 'Su pedido', fr: 'Votre commande', de: 'Ihre Bestellung', pt: 'Seu pedido', ar: 'طلبك' },
  close: { en: 'Close', zh: '关闭', ja: '閉じる', ko: '닫기', es: 'Cerrar', fr: 'Fermer', de: 'Schließen', pt: 'Fechar', ar: 'إغلاق' },
  done: { en: 'Done', zh: '完成', ja: '完了', ko: '완료', es: 'Hecho', fr: 'Terminé', de: 'Fertig', pt: 'Feito', ar: 'تم' },
  language: { en: 'Language', zh: '语言', ja: '言語', ko: '언어', es: 'Idioma', fr: 'Langue', de: 'Sprache', pt: 'Idioma', ar: 'اللغة' },
  filterBy: { en: 'Filter by', zh: '快速筛选', ja: 'フィルター', ko: '필터', es: 'Filtrar por', fr: 'Filtrer par', de: 'Filtern nach', pt: 'Filtrar por', ar: 'تصفية حسب' },
};

// Get UI label based on current language (default to English)
const getLabel = (key: string, lang: string): string => {
  const labelMap = labels[key];
  if (!labelMap) return key;
  const currentLang = lang || 'en';
  return labelMap[currentLang] || labelMap.en || key;
};

// Mock data
const mockMenus: Record<string, Menu> = {
  demo: {
    id: 'demo',
    storeName: 'Golden Dragon Restaurant',
    storeLanguage: 'zh',
    storeCurrency: 'CNY',
    categories: [
      {
        id: '1',
        name: 'Appetizers',
        translations: { en: 'Appetizers', zh: '开胃菜' },
        items: [
          { id: '1', name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 8.99, category: 'Appetizers', translations: { en: { name: 'Spring Rolls', description: 'Crispy vegetable rolls' }, zh: { name: '春卷', description: '酥脆蔬菜卷' } } },
          { id: '2', name: 'Chicken Wings', description: 'Buffalo style wings', price: 10.99, category: 'Appetizers', translations: { en: { name: 'Chicken Wings', description: 'Buffalo style wings' }, zh: { name: '鸡翅', description: '水牛城风格' } } },
        ],
      },
      {
        id: '2',
        name: 'Main Course',
        translations: { en: 'Main Course', zh: '主菜' },
        items: [
          { id: '3', name: 'Grilled Steak', description: 'Premium beef with vegetables', price: 24.99, category: 'Main Course', translations: { en: { name: 'Grilled Steak', description: 'Premium beef with vegetables' }, zh: { name: '烤牛排', description: '优质牛肉配时蔬' } } },
          { id: '4', name: 'Signature Pasta', description: 'Fresh pasta with special sauce', price: 18.99, category: 'Main Course', translations: { en: { name: 'Signature Pasta', description: 'Fresh pasta with special sauce' }, zh: { name: '招牌意面', description: '新鲜意面配特制酱汁' } } },
        ],
      },
      {
        id: '3',
        name: 'Desserts',
        translations: { en: 'Desserts', zh: '甜点' },
        items: [
          { id: '5', name: 'Chocolate Cake', description: 'Rich chocolate cake', price: 8.99, category: 'Desserts', translations: { en: { name: 'Chocolate Cake', description: 'Rich chocolate cake' }, zh: { name: '巧克力蛋糕', description: '浓郁巧克力蛋糕' } } },
        ],
      },
      {
        id: '4',
        name: 'Beverages',
        translations: { en: 'Beverages', zh: '饮料' },
        items: [
          { id: '6', name: 'Fresh Juice', description: 'Orange or apple', price: 5.99, category: 'Beverages', translations: { en: { name: 'Fresh Juice', description: 'Orange or apple' }, zh: { name: '鲜榨果汁', description: '橙汁或苹果汁' } } },
          { id: '7', name: 'Coffee', description: 'Espresso or cappuccino', price: 4.99, category: 'Beverages', translations: { en: { name: 'Coffee', description: 'Espresso or cappuccino' }, zh: { name: '咖啡', description: '浓缩或卡布奇诺' } } },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const MenuDisplayPage: React.FC = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [customerLang, setCustomerLang] = useState<string>('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showLangPrompt, setShowLangPrompt] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [customerNotes, setCustomerNotes] = useState('');
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Quick filter states
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [includedTags, setIncludedTags] = useState<string[]>([]);

  const toggleExcludedAllergen = (id: string) => {
    setExcludedAllergens(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleIncludedTag = (id: string) => {
    setIncludedTags(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setExcludedAllergens([]);
    setIncludedTags([]);
  };

  const isItemVisible = (item: MenuItem): boolean => {
    // Exclude items containing selected allergens
    if (excludedAllergens.length > 0 && item.allergens) {
      const hasExcluded = item.allergens.some(a => excludedAllergens.includes(a));
      if (hasExcluded) return false;
    }
    // Only show items matching selected dietary preferences
    if (includedTags.length > 0 && item.tags) {
      const hasIncluded = item.tags.some(t => includedTags.includes(t));
      if (!hasIncluded) return false;
    }
    return true;
  };

  const hasActiveFilters = excludedAllergens.length > 0 || includedTags.length > 0;

  // Quick allergen filters (most common)
  const quickAllergens = ['peanuts', 'nuts', 'milk', 'eggs', 'soybeans', 'gluten', 'fish', 'crustaceans', 'sesame'];
  // Quick dietary preference filters
  const quickDietary = ['vegetarian', 'vegan', 'halal', 'gluten-free', 'dairy-free', 'spicy'];

  const getAllergenDisplayName = (allergen: any, lang: string) => {
    switch (lang) {
      case 'zh': return allergen.nameZh;
      case 'es': return allergen.nameEs;
      case 'fr': return allergen.nameFr;
      case 'de': return allergen.nameDe;
      default: return allergen.name;
    }
  };

  const getTagDisplayLabel = (tag: any, lang: string) => {
    switch (lang) {
      case 'zh': return tag.labelZh;
      case 'es': return tag.labelEs;
      case 'fr': return tag.labelFr;
      case 'de': return tag.labelDe;
      default: return tag.label;
    }
  };

  useEffect(() => {
    // Try to load menu by menuId first
    let savedMenu = null;
    if (menuId) {
      const menuById = localStorage.getItem(`menu_${menuId}`);
      if (menuById) {
        try {
          savedMenu = JSON.parse(menuById);
        } catch (e) {
          // ignore
        }
      }
    }
    
    // Fallback to currentMenu if not found by ID
    if (!savedMenu) {
      const currentMenu = localStorage.getItem('currentMenu');
      if (currentMenu) {
        try {
          savedMenu = JSON.parse(currentMenu);
        } catch (e) {
          // ignore
        }
      }
    }
    
    if (savedMenu) {
      savedMenu.createdAt = new Date(savedMenu.createdAt);
      savedMenu.updatedAt = new Date(savedMenu.updatedAt);
      setMenu(savedMenu);
      setExpandedCategories(savedMenu.categories.map((c: any) => c.id));
      
      // 检查是否首次访问
      const hasSelectedLang = sessionStorage.getItem('customerLangSelected');
      if (!hasSelectedLang) {
        setShowLangPrompt(true);
      } else {
        const savedLang = sessionStorage.getItem('customerLang');
        setCustomerLang(savedLang || savedMenu.storeLanguage || 'en');
      }
    } else {
      const menuData = menuId ? mockMenus[menuId] || mockMenus['demo'] : mockMenus['demo'];
      setMenu(menuData);
      setExpandedCategories(menuData.categories.map(c => c.id));
      setShowLangPrompt(true);
    }
  }, [menuId]);

  const handleSelectLanguage = (langCode: string) => {
    setCustomerLang(langCode);
    sessionStorage.setItem('customerLangSelected', 'true');
    sessionStorage.setItem('customerLang', langCode);
    setShowLangPrompt(false);
  };

  const getCurrencyInfo = (code?: string) => {
    const currency = currencies.find(c => c.code === (code || 'USD'));
    return currency || currencies[0];
  };
  const currency = getCurrencyInfo(menu?.storeCurrency);

  const getLangInfo = (code?: string) => supportedLanguages.find(l => l.code === code) || supportedLanguages[0];
  const merchantLang = menu?.storeLanguage || 'en';
  const storeLang = getLangInfo(merchantLang);
  const currentLang = getLangInfo(customerLang || merchantLang);
  
  // 是否显示双语
  const showBilingual = customerLang && customerLang !== merchantLang;

  const getItemName = (item: MenuItem, lang: string) => {
    if (item.translations[lang]) {
      return item.translations[lang].name;
    }
    return item.translations['en']?.name || item.name;
  };

  const getItemDescription = (item: MenuItem, lang: string) => {
    if (item.translations[lang]) {
      return item.translations[lang].description;
    }
    return item.translations['en']?.description || item.description;
  };

  const getCategoryName = (category: any, lang: string) => {
    if (category.translations[lang]) {
      return category.translations[lang];
    }
    return category.translations['en'] || category.name;
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const addToCart = (item: MenuItem, categoryName: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1, categoryName }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i =>
          i.item.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 15),
      items: cart.map(c => ({
        itemId: c.item.id,
        itemName: getItemName(c.item, customerLang || merchantLang),
        itemNameMerchant: getItemName(c.item, merchantLang),
        quantity: c.quantity,
        price: c.item.price,
        categoryName: c.categoryName,
      })),
      totalAmount: total,
      customerNotes,
      createdAt: new Date(),
    };
    
    setOrder(newOrder);
    setShowCart(false);
    setShowOrderSummary(true);
    setCart([]);
    setCustomerNotes('');
  };

  // Loading state
  if (!menu) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <UtensilsCrossed className="w-16 h-16 mx-auto text-orange-300 mb-4" />
          <p className="text-orange-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 text-gray-900 pb-32">
      {/* Language Selection Prompt Modal */}
      {showLangPrompt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base font-bold text-white">Select Language</h2>
              <p className="text-white/80 text-xs">选择您的语言</p>
            </div>
            
            {/* Language Options */}
            <div className="p-3 space-y-1.5 max-h-[50vh] overflow-y-auto">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm text-gray-900">{lang.nativeName}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-300 rotate-[-90deg]" />
                </button>
              ))}
            </div>
            
            {/* Skip Option */}
            <div className="px-4 pb-4 pt-1">
              <button
                onClick={() => handleSelectLanguage(merchantLang)}
                className="w-full py-2 text-orange-500 font-medium text-xs hover:text-orange-600 transition-colors"
              >
                使用店铺语言 Use store language
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-sm"
                >
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-orange-600">{currentLang.flag}</span>
                </button>
                
                {showLanguageSelector && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCustomerLang(lang.code);
                          sessionStorage.setItem('customerLang', lang.code);
                          setShowLanguageSelector(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors ${
                          customerLang === lang.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="font-medium text-sm">{lang.nativeName}</span>
                        {customerLang === lang.code && <Check className="w-4 h-4 ml-auto text-orange-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info - with Cover Image Background */}
      <div className="relative text-white">
        {/* Background Layer */}
        {menu.coverImage ? (
          <>
            <div className="absolute inset-0">
              <img src={menu.coverImage} alt="Menu cover" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400" />
        )}

        <div className="relative max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-1">{menu.storeName}</h1>
          {menu.storeAddress && (
            <p className="text-white/80 text-sm">{menu.storeAddress}</p>
          )}
          {/* Language Badges */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="px-2.5 py-1 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
              <span>🏪</span> {storeLang.flag} {storeLang.nativeName}
            </span>
            {showBilingual && (
              <span className="px-2.5 py-1 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
                <span>🌐</span> {currentLang.flag} {currentLang.nativeName}
              </span>
            )}
          </div>

          {/* Quick Filters */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-3.5 h-3.5 text-white/70" />
              <span className="text-xs text-white/70 font-medium">
                {getLabel('filterBy', customerLang || merchantLang)}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-white/90 underline hover:text-white ml-auto"
                >
                  {customerLang === 'zh' ? '清除筛选' : 'Clear'}
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
              {/* Allergen exclusions */}
              {quickAllergens.map(aid => {
                const ag = EU_ALLERGENS.find(a => a.id === aid);
                if (!ag) return null;
                const isActive = excludedAllergens.includes(aid);
                return (
                  <button
                    key={aid}
                    onClick={() => toggleExcludedAllergen(aid)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all border ${
                      isActive
                        ? 'bg-red-500 text-white border-red-400 shadow-md'
                        : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                    }`}
                  >
                    <span className="w-3 h-3 opacity-90">{ag.icon}</span>
                    {getAllergenDisplayName(ag, customerLang || merchantLang).split(' ')[0].split('/')[0]}
                  </button>
                );
              })}
              {/* Dietary preferences */}
              {quickDietary.map(tid => {
                const tagDef = TAG_GROUPS.flatMap(g => g.tags).find(t => t.id === tid);
                if (!tagDef) return null;
                const isActive = includedTags.includes(tid);
                return (
                  <button
                    key={tid}
                    onClick={() => toggleIncludedTag(tid)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all border ${
                      isActive
                        ? 'bg-green-500 text-white border-green-400 shadow-md'
                        : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                    }`}
                  >
                    {getTagDisplayLabel(tagDef, customerLang || merchantLang)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Categories */}
        <div className="space-y-3">
          {menu.categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-left">
                    {/* Bilingual Category Names */}
                    {showBilingual ? (
                      <>
                        <h2 className="font-semibold text-base text-gray-900">
                          {getCategoryName(category, customerLang)}
                        </h2>
                        <p className="text-xs text-gray-400">
                          {getCategoryName(category, merchantLang)}
                        </p>
                      </>
                    ) : (
                      <h2 className="font-semibold text-base text-gray-900">
                        {getCategoryName(category, customerLang || merchantLang)}
                      </h2>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {hasActiveFilters
                      ? `${category.items.filter(isItemVisible).length}/${category.items.length}`
                      : category.items.length}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedCategories.includes(category.id) ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Category Items */}
              {expandedCategories.includes(category.id) && (
                <div className="border-t border-gray-100">
                  {(() => {
                    const visibleItems = category.items.filter(isItemVisible);
                    if (visibleItems.length === 0) {
                      return (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-gray-400">
                            {customerLang === 'zh' ? '没有符合筛选条件的菜品' : 'No items match your filters'}
                          </p>
                          <button
                            onClick={clearFilters}
                            className="mt-2 text-xs text-orange-500 font-medium hover:underline"
                          >
                            {customerLang === 'zh' ? '清除筛选' : 'Clear filters'}
                          </button>
                        </div>
                      );
                    }

                    // Double column layout
                    if (menu.layout === 'double') {
                      return (
                        <div className="p-3 grid grid-cols-2 gap-3">
                          {visibleItems.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                            >
                              {/* Item Image */}
                              <div className="relative w-full aspect-[4/3] bg-gray-100">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <UtensilsCrossed className="w-8 h-8 text-gray-300" />
                                  </div>
                                )}
                                {/* Add Button */}
                                <button
                                  onClick={() => addToCart(item, getCategoryName(category, customerLang || merchantLang))}
                                  className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md hover:bg-orange-50 active:scale-95 transition-all flex items-center justify-center"
                                >
                                  <Plus className="w-4 h-4 text-orange-500" />
                                </button>
                              </div>
                              {/* Item Info */}
                              <div className="p-2.5">
                                <div className="flex items-start justify-between gap-1">
                                  <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
                                    {showBilingual
                                      ? getItemName(item, customerLang)
                                      : getItemName(item, customerLang || merchantLang)}
                                  </h3>
                                </div>
                                {showBilingual && (
                                  <p className="text-[10px] text-orange-400 mt-0.5 truncate">
                                    {getItemName(item, merchantLang)}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                  {getItemDescription(item, customerLang || merchantLang)}
                                </p>
                                <span className="block mt-1.5 font-semibold text-orange-500 text-sm">
                                  {currency.symbol}{item.price.toFixed(0)}
                                </span>
                                {/* Allergens */}
                                {item.allergens && item.allergens.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {item.allergens.map(aid => {
                                      const ag = EU_ALLERGENS.find(a => a.id === aid);
                                      if (!ag) return null;
                                      return (
                                        <span
                                          key={aid}
                                          className="inline-flex items-center gap-0.5 px-1 py-0.5 text-[10px] font-medium rounded"
                                          style={{ color: ag.color, backgroundColor: ag.bgColor }}
                                          title={ag.name}
                                        >
                                          <span className="w-2.5 h-2.5">{ag.icon}</span>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                                {/* Tags */}
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.tags.map(tid => {
                                      const tagDef = TAG_GROUPS.flatMap(g => g.tags).find(t => t.id === tid);
                                      if (tagDef) {
                                        return (
                                          <span
                                            key={tid}
                                            className="px-1.5 py-0.5 text-[10px] font-medium rounded border"
                                            style={{ color: tagDef.color, backgroundColor: tagDef.bgColor, borderColor: tagDef.borderColor }}
                                          >
                                            {merchantLang === 'zh' ? tagDef.labelZh : tagDef.label}
                                          </span>
                                        );
                                      }
                                      return null;
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    // Single column layout (default)
                    return visibleItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`px-4 py-3.5 flex items-center gap-3 ${idx !== visibleItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      {/* Item Image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UtensilsCrossed className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Item Info - Bilingual */}
                      <div className="flex-1 min-w-0">
                        {showBilingual ? (
                          <>
                            <h3 className="font-medium text-gray-900 text-sm leading-snug">
                              {getItemName(item, customerLang)}
                            </h3>
                            <p className="text-xs text-orange-400 mt-0.5 truncate">
                              {getItemName(item, merchantLang)}
                            </p>
                          </>
                        ) : (
                          <h3 className="font-medium text-gray-900 text-sm leading-snug">
                            {getItemName(item, customerLang || merchantLang)}
                          </h3>
                        )}
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {getItemDescription(item, customerLang || merchantLang)}
                        </p>
                        {/* Allergens */}
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.allergens.map(aid => {
                              const ag = EU_ALLERGENS.find(a => a.id === aid);
                              if (!ag) return null;
                              return (
                                <span
                                  key={aid}
                                  className="inline-flex items-center gap-0.5 px-1 py-0.5 text-[10px] font-medium rounded"
                                  style={{ color: ag.color, backgroundColor: ag.bgColor }}
                                  title={ag.name}
                                >
                                  <span className="w-2.5 h-2.5">{ag.icon}</span>
                                  <span className="hidden sm:inline">{merchantLang === 'zh' ? ag.nameZh : ag.name}</span>
                                </span>
                              );
                            })}
                          </div>
                        )}
                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.map(tid => {
                              const tagDef = TAG_GROUPS.flatMap(g => g.tags).find(t => t.id === tid);
                              if (tagDef) {
                                return (
                                  <span
                                    key={tid}
                                    className="px-1.5 py-0.5 text-[10px] font-medium rounded border"
                                    style={{ color: tagDef.color, backgroundColor: tagDef.bgColor, borderColor: tagDef.borderColor }}
                                  >
                                    {merchantLang === 'zh' ? tagDef.labelZh : tagDef.label}
                                  </span>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                      </div>

                      {/* Price & Add Button */}
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-semibold text-orange-500 text-sm whitespace-nowrap">
                          {currency.symbol}{item.price.toFixed(0)}
                        </span>
                        <button
                          onClick={() => addToCart(item, getCategoryName(category, customerLang || merchantLang))}
                          className="w-8 h-8 bg-orange-500 rounded-lg hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Cart Bar - Orange Theme */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-lg z-50">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <button
              onClick={() => setShowCart(true)}
              className="w-full flex items-center justify-between py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-orange-500 rounded-full text-xs font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <span className="font-medium">{getLabel('viewCart', customerLang || merchantLang)}</span>
              </div>
              <span className="font-bold text-lg">{currency.symbol}{total.toFixed(0)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty Cart Hint */}
      {cart.length === 0 && (
        <div className="fixed bottom-20 left-0 right-0 text-center">
          <p className="text-xs text-gray-400">{getLabel('addToCartHint', customerLang || merchantLang)}</p>
        </div>
      )}

      {/* Cart Bottom Sheet - Orange Theme */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slideUp">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-orange-200 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-orange-50">
              <h2 className="text-lg font-bold text-gray-900">{getLabel('confirmOrder', customerLang || merchantLang)}</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-orange-50 rounded-full transition-colors">
                <X className="w-5 h-5 text-orange-500" />
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="flex items-center gap-3 py-2">
                  {/* Item Image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {cartItem.item.image ? (
                      <img src={cartItem.item.image} alt={cartItem.item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {getItemName(cartItem.item, customerLang || merchantLang)}
                    </h3>
                    {showBilingual && (
                      <p className="text-xs text-orange-400 truncate">
                        {getItemName(cartItem.item, merchantLang)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {currency.symbol}{cartItem.item.price.toFixed(0)} × {cartItem.quantity}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, -1)}
                      className="w-8 h-8 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-6 text-center font-medium text-sm">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, 1)}
                      className="w-8 h-8 bg-orange-100 rounded-lg hover:bg-orange-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 text-orange-500" />
                    </button>
                  </div>
                  
                  <span className="font-semibold text-orange-500 text-sm w-16 text-right">
                    {currency.symbol}{(cartItem.item.price * cartItem.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
              
              {/* Notes */}
              <div className="pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-gray-600 font-medium">{getLabel('notes', customerLang || merchantLang)}</span>
                </div>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder={getLabel('notesPlaceholder', customerLang || merchantLang)}
                  className="w-full px-4 py-3 bg-orange-50 border border-orange-100 rounded-xl text-gray-700 placeholder-gray-400 resize-none text-sm"
                  rows={2}
                />
              </div>
            </div>
            
            {/* Bottom Confirm Button */}
            <div className="border-t border-orange-50 px-5 py-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">共 {totalItems} {getLabel('totalItems', customerLang || merchantLang)}</span>
                <div className="text-right">
                  <span className="text-sm text-gray-500">{getLabel('total', customerLang || merchantLang)} </span>
                  <span className="text-xl font-bold text-orange-500">{currency.symbol}{total.toFixed(0)}</span>
                </div>
              </div>
              <button
                onClick={placeOrder}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/30"
              >
                {getLabel('placeOrder', customerLang || merchantLang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary - Orange Theme */}
      {showOrderSummary && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowOrderSummary(false)} />
          <div className="relative bg-white rounded-3xl max-w-sm w-full mx-4 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold">{getLabel('orderConfirmed', customerLang || merchantLang)}</h2>
              <p className="text-white/80 text-sm mt-1">{getLabel('orderNumber', customerLang || merchantLang)}{order.id}</p>
            </div>
            
            {/* Order Details */}
            <div className="px-5 py-4 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    {showBilingual ? (
                      <>
                        <p className="font-medium text-sm text-gray-900">{item.itemName}</p>
                        <p className="text-xs text-orange-400">({item.itemNameMerchant})</p>
                      </>
                    ) : (
                      <p className="font-medium text-sm text-gray-900">{item.itemName}</p>
                    )}
                    <p className="text-xs text-gray-500">× {item.quantity}</p>
                  </div>
                  <span className="font-medium text-sm text-gray-900">
                    {currency.symbol}{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{getLabel('total', customerLang || merchantLang)}</span>
                  <span className="font-bold text-lg text-orange-500">{currency.symbol}{order.totalAmount.toFixed(0)}</span>
                </div>
              </div>
              
              {order.customerNotes && (
                <div className="bg-orange-50 rounded-xl p-3 mt-2">
                  <p className="text-xs text-orange-600 font-medium mb-1">{getLabel('notes', customerLang || merchantLang)}</p>
                  <p className="text-sm text-orange-800">{order.customerNotes}</p>
                </div>
              )}
            </div>
            
            {/* Done Button */}
            <div className="px-5 pb-5 pt-2">
              <button
                onClick={() => setShowOrderSummary(false)}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:-to-amber-600 transition-all"
              >
                {getLabel('done', customerLang || merchantLang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDisplayPage;
