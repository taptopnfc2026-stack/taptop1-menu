import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  Check,
  Download,
  ArrowLeft,
  Store,
  UtensilsCrossed,
  Wand2,
  Eye,
  Globe,
  Copy,
  Link as LinkIcon,
  History,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '@/context/AuthContext';
import type { MenuItem, MenuCategory, Menu } from '../../types/menu';
import { currencies } from '../../types/menu';
import { AllergenSelector, detectAllergens, EU_ALLERGENS } from '@/components/menu/AllergenSelector';
import { TagSelector, TAG_GROUPS } from '@/components/menu/TagSelector';

// Supported languages with native names
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
];

// Page translations
const pageTranslations: Record<string, Record<string, string>> = {
  en: {
    'Create Digital Menu': 'Create Digital Menu',
    'Store Language': 'Store Language',
    'Currency': 'Currency',
    'Store Name': 'Store Name',
    'Enter store name': 'Enter store name',
    'Store Address': 'Store Address',
    'Enter store address': 'Enter store address (optional)',
    'Menu Categories': 'Menu Categories',
    'Add Category': 'Add Category',
    'Enter category name': 'Enter category name',
    'Add': 'Add',
    'Cancel': 'Cancel',
    'Generate with AI': 'Generate with AI',
    'Upload menu image': 'Upload menu image',
    'Analyzing...': 'Analyzing...',
    'Add Item': 'Add Item',
    'Item Name': 'Item Name',
    'Enter item name': 'Enter item name',
    'Description': 'Description',
    'Enter description': 'Enter description (optional)',
    'Price': 'Price',
    'Enter price': 'Enter price',
    'Save Menu': 'Save Menu',
    'Preview': 'Preview',
    'Success!': 'Success!',
    'Delete': 'Delete',
    'Close': 'Close',
    'Items': 'Items',
    'Create Menu': 'Create Menu',
    'Hero Title': 'Create Digital Menu',
    'Hero Subtitle': 'Build a beautiful menu for your restaurant',
    'AI Title': 'AI Menu Generation',
    'AI Desc': 'Upload your existing menu and let AI do the work',
    'Customize Title': 'Customize Freely',
    'Customize Desc': 'Edit anytime with our intuitive interface',
    'No categories': 'No categories yet',
    'Add first': 'Add your first category to get started',
    'Your menu is ready!': 'Your menu is ready!',
    'Menu Link': 'Menu Link',
    'Copy Link': 'Copy Link',
    'Link Copied!': 'Link Copied!',
    'QR Code': 'QR Code',
    'Download QR': 'Download QR',
    'View Menu': 'View Menu',
    'Menu History': 'Menu History',
    'No history': 'No menus created yet',
    'Created': 'Created',
    'Delete Menu': 'Delete Menu',
    'Edit Menu': 'Edit Menu',
    'Upload Image': 'Upload Image',
    'Item Image': 'Item Image',
  },
  zh: {
    'Create Digital Menu': '创建电子菜单',
    'Store Language': '店铺语言',
    'Currency': '货币',
    'Store Name': '店铺名称',
    'Enter store name': '输入店铺名称',
    'Store Address': '店铺地址',
    'Enter store address': '输入店铺地址（可选）',
    'Menu Categories': '菜单分类',
    'Add Category': '添加分类',
    'Enter category name': '输入分类名称',
    'Add': '添加',
    'Cancel': '取消',
    'Generate with AI': 'AI 生成',
    'Upload menu image': '上传菜单图片',
    'Analyzing...': '分析中...',
    'Add Item': '添加菜品',
    'Item Name': '菜品名称',
    'Enter item name': '输入菜品名称',
    'Description': '描述',
    'Enter description': '输入描述（可选）',
    'Price': '价格',
    'Enter price': '输入价格',
    'Save Menu': '保存菜单',
    'Preview': '预览',
    'Success!': '成功！',
    'Delete': '删除',
    'Close': '关闭',
    'Items': '菜品',
    'Create Menu': '创建菜单',
    'Hero Title': '创建电子菜单',
    'Hero Subtitle': '为您的餐厅打造精美菜单',
    'AI Title': 'AI 菜单生成',
    'AI Desc': '上传现有菜单，AI 自动完成',
    'Customize Title': '自由编辑',
    'Customize Desc': '直观的界面随时修改',
    'No categories': '暂无分类',
    'Add first': '添加第一个分类开始使用',
    'Your menu is ready!': '您的菜单已准备就绪！',
    'Menu Link': '菜单链接',
    'Copy Link': '复制链接',
    'Link Copied!': '链接已复制！',
    'QR Code': '二维码',
    'Download QR': '下载二维码',
    'View Menu': '查看菜单',
    'Menu History': '菜单历史',
    'No history': '暂无创建记录',
    'Created': '创建于',
    'Delete Menu': '删除菜单',
    'Edit Menu': '编辑菜单',
    'Upload Image': '上传图片',
    'Item Image': '菜品图片',
  },
  fr: {
    'Create Digital Menu': 'Créer un menu numérique',
    'Store Language': 'Langue du magasin',
    'Currency': 'Devise',
    'Store Name': 'Nom du magasin',
    'Enter store name': 'Entrez le nom',
    'Store Address': 'Adresse',
    'Enter store address': 'Adresse (optionnel)',
    'Menu Categories': 'Catégories',
    'Add Category': 'Ajouter',
    'Enter category name': 'Nom de catégorie',
    'Add': 'Ajouter',
    'Cancel': 'Annuler',
    'Generate with AI': 'Générer avec IA',
    'Upload menu image': 'Télécharger image',
    'Analyzing...': 'Analyse...',
    'Add Item': 'Ajouter article',
    'Item Name': 'Nom',
    'Enter item name': 'Nom de l\'article',
    'Description': 'Description',
    'Enter description': 'Description (optionnel)',
    'Price': 'Prix',
    'Enter price': 'Prix',
    'Save Menu': 'Enregistrer',
    'Preview': 'Aperçu',
    'Success!': 'Succès!',
    'Delete': 'Supprimer',
    'Close': 'Fermer',
    'Items': 'Articles',
    'Create Menu': 'Créer',
    'Hero Title': 'Créer un menu numérique',
    'Hero Subtitle': 'Créez un magnifique menu pour votre restaurant',
    'AI Title': 'Génération par IA',
    'AI Desc': 'Téléchargez votre menu existant',
    'Customize Title': 'Personnalisez',
    'Customize Desc': 'Modifiez à tout moment',
    'No categories': 'Pas de catégories',
    'Add first': 'Ajoutez votre première catégorie',
    'Your menu is ready!': 'Votre menu est prêt!',
    'Menu Link': 'Lien du menu',
    'Copy Link': 'Copier le lien',
    'Link Copied!': 'Lien copié!',
    'QR Code': 'Code QR',
    'Download QR': 'Télécharger QR',
    'View Menu': 'Voir le menu',
    'Menu History': 'Historique',
    'No history': 'Aucun menu créé',
    'Created': 'Créé',
    'Delete Menu': 'Supprimer',
    'Edit Menu': 'Modifier',
    'Upload Image': 'Télécharger image',
    'Item Image': 'Image de l\'article',
  },
  de: {
    'Create Digital Menu': 'Digitales Menü erstellen',
    'Store Language': 'Geschäftssprache',
    'Currency': 'Währung',
    'Store Name': 'Geschäftsname',
    'Enter store name': 'Geschäftsname eingeben',
    'Store Address': 'Adresse',
    'Enter store address': 'Adresse (optional)',
    'Menu Categories': 'Kategorien',
    'Add Category': 'Kategorie hinzufügen',
    'Enter category name': 'Kategoriename',
    'Add': 'Hinzufügen',
    'Cancel': 'Abbrechen',
    'Generate with AI': 'Mit KI generieren',
    'Upload menu image': 'Bild hochladen',
    'Analyzing...': 'Analysieren...',
    'Add Item': 'Artikel hinzufügen',
    'Item Name': 'Name',
    'Enter item name': 'Artikelname',
    'Description': 'Beschreibung',
    'Enter description': 'Beschreibung (optional)',
    'Price': 'Preis',
    'Enter price': 'Preis eingeben',
    'Save Menu': 'Speichern',
    'Preview': 'Vorschau',
    'Success!': 'Erfolg!',
    'Delete': 'Löschen',
    'Close': 'Schließen',
    'Items': 'Artikel',
    'Create Menu': 'Erstellen',
    'Hero Title': 'Digitales Menü erstellen',
    'Hero Subtitle': 'Erstellen Sie ein schönes Menü für Ihr Restaurant',
    'AI Title': 'KI-Menügenerierung',
    'AI Desc': 'Laden Sie Ihr bestehendes Menü hoch',
    'Customize Title': 'Frei anpassen',
    'Customize Desc': 'Jederzeit bearbeiten',
    'No categories': 'Keine Kategorien',
    'Add first': 'Fügen Sie Ihre erste Kategorie hinzu',
    'Your menu is ready!': 'Ihr Menü ist fertig!',
    'Menu Link': 'Menülink',
    'Copy Link': 'Link kopieren',
    'Link Copied!': 'Link kopiert!',
    'QR Code': 'QR-Code',
    'Download QR': 'QR herunterladen',
    'View Menu': 'Menü ansehen',
    'Menu History': 'Verlauf',
    'No history': 'Keine Menüs erstellt',
    'Created': 'Erstellt',
    'Delete Menu': 'Löschen',
    'Edit Menu': 'Bearbeiten',
    'Upload Image': 'Bild hochladen',
    'Item Image': 'Artikelbild',
  },
  es: {
    'Create Digital Menu': 'Crear menú digital',
    'Store Language': 'Idioma',
    'Currency': 'Moneda',
    'Store Name': 'Nombre',
    'Enter store name': 'Nombre del restaurante',
    'Store Address': 'Dirección',
    'Enter store address': 'Dirección (opcional)',
    'Menu Categories': 'Categorías',
    'Add Category': 'Agregar categoría',
    'Enter category name': 'Nombre de categoría',
    'Add': 'Agregar',
    'Cancel': 'Cancelar',
    'Generate with AI': 'Generar con IA',
    'Upload menu image': 'Subir imagen',
    'Analyzing...': 'Analizando...',
    'Add Item': 'Agregar artículo',
    'Item Name': 'Nombre',
    'Enter item name': 'Nombre del artículo',
    'Description': 'Descripción',
    'Enter description': 'Descripción (opcional)',
    'Price': 'Precio',
    'Enter price': 'Precio',
    'Save Menu': 'Guardar',
    'Preview': 'Vista previa',
    'Success!': '¡Éxito!',
    'Delete': 'Eliminar',
    'Close': 'Cerrar',
    'Items': 'Artículos',
    'Create Menu': 'Crear',
    'Hero Title': 'Crear menú digital',
    'Hero Subtitle': 'Cree un hermoso menú para su restaurante',
    'AI Title': 'Generación con IA',
    'AI Desc': 'Suba su menú existente',
    'Customize Title': 'Personalizar',
    'Customize Desc': 'Edite en cualquier momento',
    'No categories': 'Sin categorías',
    'Add first': 'Agregue su primera categoría',
    'Your menu is ready!': '¡Su menú está listo!',
    'Menu Link': 'Enlace del menú',
    'Copy Link': 'Copiar enlace',
    'Link Copied!': '¡Enlace copiado!',
    'QR Code': 'Código QR',
    'Download QR': 'Descargar QR',
    'View Menu': 'Ver menú',
    'Menu History': 'Historial',
    'No history': 'Sin menús creados',
    'Created': 'Creado',
    'Delete Menu': 'Eliminar',
    'Edit Menu': 'Editar',
    'Upload Image': 'Subir imagen',
    'Item Image': 'Imagen del artículo',
  },
  ja: {
    'Create Digital Menu': 'デジタルメニュー作成',
    'Store Language': '店舗言語',
    'Currency': '通貨',
    'Store Name': '店舗名',
    'Enter store name': '店舗名を入力',
    'Store Address': '住所',
    'Enter store address': '住所（任意）',
    'Menu Categories': 'カテゴリー',
    'Add Category': 'カテゴリー追加',
    'Enter category name': 'カテゴリー名',
    'Add': '追加',
    'Cancel': 'キャンセル',
    'Generate with AI': 'AI生成',
    'Upload menu image': '画像をアップロード',
    'Analyzing...': '分析中...',
    'Add Item': 'アイテム追加',
    'Item Name': '名前',
    'Enter item name': 'アイテム名',
    'Description': '説明',
    'Enter description': '説明（任意）',
    'Price': '価格',
    'Enter price': '価格',
    'Save Menu': '保存',
    'Preview': 'プレビュー',
    'Success!': '成功！',
    'Delete': '削除',
    'Close': '閉じる',
    'Items': 'アイテム',
    'Create Menu': '作成',
    'Hero Title': 'デジタルメニュー作成',
    'Hero Subtitle': '餐厅の美しいメニューを作成',
    'AI Title': 'AIメニュー生成',
    'AI Desc': '既存のメニューをアップロード',
    'Customize Title': 'カスタマイズ',
    'Customize Desc': 'いつでも編集可能',
    'No categories': 'カテゴリーなし',
    'Add first': '最初のカテゴリーを追加',
    'Your menu is ready!': 'メニューが完成！',
    'Menu Link': 'メニューリンク',
    'Copy Link': 'リンクをコピー',
    'Link Copied!': 'コピーしました！',
    'QR Code': 'QRコード',
    'Download QR': 'QRダウンロード',
    'View Menu': 'メニューを見る',
    'Menu History': '履歴',
    'No history': 'メニューなし',
    'Created': '作成日',
    'Delete Menu': '削除',
    'Edit Menu': '編集',
    'Upload Image': '画像をアップロード',
    'Item Image': 'アイテム画像',
  },
  ko: {
    'Create Digital Menu': '디지털 메뉴 만들기',
    'Store Language': '매장 언어',
    'Currency': '통화',
    'Store Name': '매장명',
    'Enter store name': '매장명 입력',
    'Store Address': '주소',
    'Enter store address': '주소 (선택)',
    'Menu Categories': '카테고리',
    'Add Category': '카테고리 추가',
    'Enter category name': '카테고리명',
    'Add': '추가',
    'Cancel': '취소',
    'Generate with AI': 'AI 생성',
    'Upload menu image': '이미지 업로드',
    'Analyzing...': '분석 중...',
    'Add Item': '아이템 추가',
    'Item Name': '이름',
    'Enter item name': '아이템명',
    'Description': '설명',
    'Enter description': '설명 (선택)',
    'Price': '가격',
    'Enter price': '가격',
    'Save Menu': '저장',
    'Preview': '미리보기',
    'Success!': '성공!',
    'Delete': '삭제',
    'Close': '닫기',
    'Items': '아이템',
    'Create Menu': '만들기',
    'Hero Title': '디지털 메뉴 만들기',
    'Hero Subtitle': '레스토랑을 위한 아름다운 메뉴를 만드세요',
    'AI Title': 'AI 메뉴 생성',
    'AI Desc': '기존 메뉴를 업로드하세요',
    'Customize Title': '자유롭게 편집',
    'Customize Desc': '언제든지 수정 가능',
    'No categories': '카테고리 없음',
    'Add first': '첫 번째 카테고리를 추가하세요',
    'Your menu is ready!': '메뉴가 준비되었습니다!',
    'Menu Link': '메뉴 링크',
    'Copy Link': '링크 복사',
    'Link Copied!': '링크가 복사되었습니다!',
    'QR Code': 'QR 코드',
    'Download QR': 'QR 다운로드',
    'View Menu': '메뉴 보기',
    'Menu History': '기록',
    'No history': '생성된 메뉴 없음',
    'Created': '생성일',
    'Delete Menu': '삭제',
    'Edit Menu': '편집',
    'Upload Image': '이미지 업로드',
    'Item Image': '아이템 이미지',
  },
};

// Translation helper
const t = (key: string, lang: string): string => {
  return pageTranslations[lang]?.[key] || pageTranslations['en'][key] || key;
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Translation mock data
const translations: Record<string, Record<string, { name: string; description: string }>> = {
  'Spring Rolls': { zh: { name: '春卷', description: '酥脆蔬菜卷' }, fr: { name: 'Rouleaux de Printemps', description: 'Rouleaux de légumes croustillants' }, de: { name: 'Frühlingsrollen', description: 'Knusprige Gemüserollen' }, ja: { name: '春巻き', description: 'サクサク野菜巻き' }, ko: { name: '춘권', description: '바삭한 야채말이' }, es: { name: 'Rollitos Primavera', description: 'Rollitos de verduras' } },
  'Chicken Wings': { zh: { name: '鸡翅', description: '水牛城风格' }, fr: { name: 'Ailes de Poulet', description: 'Style Buffalo' }, de: { name: 'Hähnchenflügel', description: 'Buffalo Style' }, ja: { name: 'チキンバー', description: 'バッファロー風' }, ko: { name: '닭날개', description: '버팔로 스타일' }, es: { name: 'Alitas de Pollo', description: 'Estilo Buffalo' } },
  'Grilled Steak': { zh: { name: '烤牛排', description: '优质牛肉配时蔬' }, fr: { name: 'Steak Grillé', description: 'Bœuf premium' }, de: { name: 'Gegrilltes Steak', description: 'Premium-Rindfleisch' }, ja: { name: 'グリルステーキ', description: 'プレミアムビーフ' }, ko: { name: '그릴 스테이크', description: '프리미엄 소고기' }, es: { name: 'Filete a la Parrilla', description: 'Carne premium' } },
  'Signature Pasta': { zh: { name: '招牌意面', description: '新鲜意面配特制酱汁' }, fr: { name: 'Pâtes Signature', description: 'Pâtes fraîches' }, de: { name: 'Signatur-Pasta', description: 'Frische Pasta' }, ja: { name: 'シグネチャーパスタ', description: '新鮮パスタ' }, ko: { name: '시그니처 파스타', description: '신선한 파스타' }, es: { name: 'Pasta Especial', description: 'Pasta fresca' } },
  'Chocolate Cake': { zh: { name: '巧克力蛋糕', description: '浓郁巧克力' }, fr: { name: 'Gâteau au Chocolat', description: 'Chocolat riche' }, de: { name: 'Schokoladenkuchen', description: 'Reichhaltige Schokolade' }, ja: { name: 'チョコレートケーキ', description: '濃厚な巧克力' }, ko: { name: '초콜릿 케이크', description: '진한 초콜릿' }, es: { name: 'Pastel de Chocolate', description: 'Chocolate intenso' } },
  'Fresh Juice': { zh: { name: '鲜榨果汁', description: '橙汁或苹果汁' }, fr: { name: 'Jus Frais', description: 'Orange ou pomme' }, de: { name: 'Frischer Saft', description: 'Orange oder Apfel' }, ja: { name: '新鮮なジュース', description: 'オレンジまたはりんご' }, ko: { name: '생과일주스', description: '오렌지 또는 사과' }, es: { name: 'Jugo Fresco', description: 'Naranja o manzana' } },
  'Coffee': { zh: { name: '咖啡', description: '浓缩或卡布奇诺' }, fr: { name: 'Café', description: 'Espresso' }, de: { name: 'Kaffee', description: 'Espresso' }, ja: { name: 'コーヒー', description: 'エスプレッソ' }, ko: { name: '커피', description: '에스프레소' }, es: { name: 'Café', description: 'Espresso' } },
  'French Fries': { zh: { name: '薯条', description: '酥脆金黄' }, fr: { name: 'Frites', description: 'Croustillantes' }, de: { name: 'Pommes Frites', description: 'Knusprig' }, ja: { name: 'フレンチフライ', description: 'サクサク' }, ko: { name: '프렌치 프라이', description: '바삭한' }, es: { name: 'Papas Fritas', description: 'Crujientes' } },
  'Salad': { zh: { name: '沙拉', description: '新鲜田园沙拉' }, fr: { name: 'Salade', description: 'Salade frais' }, de: { name: 'Salat', description: 'Frischer Salat' }, ja: { name: 'サラダ', description: '新鮮なサラダ' }, ko: { name: '샐러드', description: '신선한 샐러드' }, es: { name: 'Ensalada', description: 'Ensalada fresca' } },
};

// Menu history type
interface MenuHistoryItem {
  id: string;
  storeName: string;
  storeLanguage: string;
  menuLink: string;
  qrLink: string;
  createdAt: string;
}

const CreateMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuth();

  // Check authentication on page load - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Store info
  const [storeLanguage, setStoreLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeCurrency, setStoreCurrency] = useState('USD');
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);

  // Menu data
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Edit state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Generated menu state
  const [generatedMenu, setGeneratedMenu] = useState<Menu | null>(null);
  const [showQRPreview, setShowQRPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [menuHistory, setMenuHistory] = useState<MenuHistoryItem[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  // Add item state
  const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState<string | null>(null);
  const [newItemAllergens, setNewItemAllergens] = useState<string[]>([]);
  const [newItemTags, setNewItemTags] = useState<string[]>([]);
  const [suggestedAllergens, setSuggestedAllergens] = useState<string[]>([]);
  const [isDetectingAllergens, setIsDetectingAllergens] = useState(false);
  const itemImageInputRef = useRef<HTMLInputElement>(null);

  // Load menu history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('menuHistory');
    if (savedHistory) {
      try {
        setMenuHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load menu history');
      }
    }
  }, []);

  // Get language info
  const getLanguageInfo = (code: string) => supportedLanguages.find(l => l.code === code);
  const getCurrencyInfo = (code: string) => currencies.find(c => c.code === code);
  const currentLang = getLanguageInfo(storeLanguage);

  // Simulate AI menu analysis
  const analyzeMenuImage = async () => {
    setIsAnalyzing(true);
    setAnalyzeProgress(0);

    const progressInterval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const defaultCats = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides'];
    const mockGeneratedCategories: MenuCategory[] = defaultCats.map((cat) => {
      let items: MenuItem[] = [];
      
      if (cat === 'Appetizers') {
        items = [
          { id: generateId(), name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 8.99, category: cat, translations: { en: { name: 'Spring Rolls', description: 'Crispy vegetable rolls' }, ...translations['Spring Rolls'] } },
          { id: generateId(), name: 'Chicken Wings', description: 'Buffalo style wings', price: 10.99, category: cat, translations: { en: { name: 'Chicken Wings', description: 'Buffalo style wings' }, ...translations['Chicken Wings'] } },
        ];
      } else if (cat === 'Main Course') {
        items = [
          { id: generateId(), name: 'Grilled Steak', description: 'Premium beef with vegetables', price: 24.99, category: cat, translations: { en: { name: 'Grilled Steak', description: 'Premium beef with vegetables' }, ...translations['Grilled Steak'] } },
          { id: generateId(), name: 'Signature Pasta', description: 'Fresh pasta with special sauce', price: 18.99, category: cat, translations: { en: { name: 'Signature Pasta', description: 'Fresh pasta with special sauce' }, ...translations['Signature Pasta'] } },
        ];
      } else if (cat === 'Desserts') {
        items = [
          { id: generateId(), name: 'Chocolate Cake', description: 'Rich chocolate cake', price: 8.99, category: cat, translations: { en: { name: 'Chocolate Cake', description: 'Rich chocolate cake' }, ...translations['Chocolate Cake'] } },
        ];
      } else if (cat === 'Beverages') {
        items = [
          { id: generateId(), name: 'Fresh Juice', description: 'Orange or apple', price: 5.99, category: cat, translations: { en: { name: 'Fresh Juice', description: 'Orange or apple' }, ...translations['Fresh Juice'] } },
          { id: generateId(), name: 'Coffee', description: 'Espresso or cappuccino', price: 4.99, category: cat, translations: { en: { name: 'Coffee', description: 'Espresso or cappuccino' }, ...translations['Coffee'] } },
        ];
      } else {
        items = [
          { id: generateId(), name: 'French Fries', description: 'Crispy golden fries', price: 4.99, category: cat, translations: { en: { name: 'French Fries', description: 'Crispy golden fries' }, ...translations['French Fries'] } },
          { id: generateId(), name: 'Salad', description: 'Fresh garden salad', price: 7.99, category: cat, translations: { en: { name: 'Salad', description: 'Fresh garden salad' }, ...translations['Salad'] } },
        ];
      }
      
      return {
        id: generateId(),
        name: cat,
        translations: { en: cat },
        items,
      };
    });

    setCategories(mockGeneratedCategories);
    setExpandedCategories(mockGeneratedCategories.map(c => c.id));
    setAnalyzeProgress(100);
    setIsAnalyzing(false);
    clearInterval(progressInterval);
  };

  // Add new category
  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: MenuCategory = {
      id: generateId(),
      name: newCategoryName,
      translations: { en: newCategoryName, [storeLanguage]: newCategoryName },
      items: [],
    };
    
    setCategories([...categories, newCategory]);
    setExpandedCategories([...expandedCategories, newCategory.id]);
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  // Delete category
  const deleteCategory = (catId: string) => {
    setCategories(categories.filter(c => c.id !== catId));
    setExpandedCategories(expandedCategories.filter(id => id !== catId));
  };

  // Handle image upload for item
  const handleItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // AI allergen detection
  const handleDetectAllergens = () => {
    setIsDetectingAllergens(true);
    setTimeout(() => {
      const detected = detectAllergens(newItemName, newItemDesc);
      setSuggestedAllergens(detected);
      setIsDetectingAllergens(false);
    }, 600);
  };

  // Add item to category
  const addItem = (categoryId: string) => {
    if (!newItemName.trim() || !newItemPrice) return;

    const newItem: MenuItem = {
      id: generateId(),
      name: newItemName,
      description: newItemDesc,
      price: parseFloat(newItemPrice),
      category: categories.find(c => c.id === categoryId)?.name || '',
      image: newItemImage || undefined,
      translations: {
        en: { name: newItemName, description: newItemDesc },
        [storeLanguage]: { name: newItemName, description: newItemDesc }
      },
      allergens: newItemAllergens.length > 0 ? newItemAllergens : undefined,
      tags: newItemTags.length > 0 ? newItemTags : undefined,
    };

    setCategories(categories.map(c =>
      c.id === categoryId ? { ...c, items: [...c.items, newItem] } : c
    ));

    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
    setNewItemImage(null);
    setNewItemAllergens([]);
    setNewItemTags([]);
    setSuggestedAllergens([]);
    setAddingItemTo(null);
  };

  // Delete item
  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c
    ));
  };

  // Toggle category
  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  // Save menu to history
  const saveMenuToHistory = (menu: Menu) => {
    const menuLink = `${window.location.origin}/menu/${menu.id}`;
    const historyItem: MenuHistoryItem = {
      id: menu.id,
      storeName: menu.storeName,
      storeLanguage: menu.storeLanguage || 'en',
      menuLink,
      qrLink: menuLink,
      createdAt: new Date().toISOString(),
    };

    const updatedHistory = [historyItem, ...menuHistory];
    setMenuHistory(updatedHistory);
    localStorage.setItem('menuHistory', JSON.stringify(updatedHistory));
  };

  // Delete menu from history
  const deleteMenuFromHistory = (menuId: string) => {
    const updatedHistory = menuHistory.filter(m => m.id !== menuId);
    setMenuHistory(updatedHistory);
    localStorage.setItem('menuHistory', JSON.stringify(updatedHistory));
  };

  // Load menu from history for editing
  const loadMenuFromHistory = (menuId: string) => {
    const menu = menuHistory.find(m => m.id === menuId);
    if (menu) {
      const savedMenu = localStorage.getItem(`menu_${menuId}`);
      if (savedMenu) {
        try {
          const parsed = JSON.parse(savedMenu);
          setStoreName(parsed.storeName);
          setStoreAddress(parsed.storeAddress || '');
          setStoreLanguage(parsed.storeLanguage || 'en');
          setStoreCurrency(parsed.storeCurrency || 'USD');
          setCategories(parsed.categories || []);
          setExpandedCategories((parsed.categories || []).map((c: any) => c.id));
          setGeneratedMenu(parsed);
          setShowHistory(false);
        } catch (e) {
          console.error('Failed to load menu');
        }
      }
    }
  };

  // Save menu
  const saveMenu = () => {
    if (!storeName.trim()) {
      alert('Please enter store name');
      return;
    }
    
    const menuId = generateId();
    const menu: Menu = {
      id: menuId,
      storeName,
      storeAddress,
      storeLanguage,
      storeCurrency,
      categories,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    localStorage.setItem('currentMenu', JSON.stringify(menu));
    localStorage.setItem(`menu_${menuId}`, JSON.stringify(menu));
    setGeneratedMenu(menu);
    saveMenuToHistory(menu);
    setShowQRPreview(true);
  };

  // Copy link
  const copyMenuLink = () => {
    if (generatedMenu) {
      const link = `${window.location.origin}/menu/${generatedMenu.id}`;
      navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  // Preview menu
  const previewMenu = () => {
    if (!storeName.trim()) {
      alert('Please enter store name');
      return;
    }
    
    const menu: Menu = {
      id: 'preview',
      storeName,
      storeAddress,
      storeLanguage,
      storeCurrency,
      categories,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    localStorage.setItem('currentMenu', JSON.stringify(menu));
    window.open('/menu/demo', '_blank');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 ${storeLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('Create Menu', storeLanguage)}</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-gray-600 hover:text-orange-500 transition-colors relative"
                title={t('Menu History', storeLanguage)}
              >
                <History className="w-5 h-5" />
                {menuHistory.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center">
                    {menuHistory.length}
                  </span>
                )}
              </button>
              <button
                onClick={previewMenu}
                className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
                title={t('Preview', storeLanguage)}
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu History Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowHistory(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('Menu History', storeLanguage)}</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {menuHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">{t('No history', storeLanguage)}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {menuHistory.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.storeName}</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {t('Created', storeLanguage)}: {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            localStorage.setItem('currentMenu', localStorage.getItem(`menu_${item.id}`) || '');
                            window.open(item.menuLink, '_blank');
                          }}
                          className="flex-1 px-3 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          {t('View Menu', storeLanguage)}
                        </button>
                        <button
                          onClick={() => loadMenuFromHistory(item.id)}
                          className="px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMenuFromHistory(item.id)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section - Language & Currency at TOP */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{t('Hero Title', storeLanguage)}</h1>
          <p className="text-white/80 mb-6">{t('Hero Subtitle', storeLanguage)}</p>
          
          {/* Language & Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Store Language Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                {t('Store Language', storeLanguage)}
              </label>
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{currentLang?.flag}</span>
                  <span>{currentLang?.nativeName}</span>
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showLanguageSelector ? 'rotate-180' : ''}`} />
              </button>
              
              {showLanguageSelector && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setStoreLanguage(lang.code);
                        setShowLanguageSelector(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors ${
                        storeLanguage === lang.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-sm text-gray-400 ml-auto">{lang.name}</span>
                      {storeLanguage === lang.code && <Check className="w-5 h-5 text-orange-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-white/80 mb-2">
                <UtensilsCrossed className="w-4 h-4 inline mr-1" />
                {t('Currency', storeLanguage)}
              </label>
              <button
                onClick={() => setShowCurrencySelector(!showCurrencySelector)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{getCurrencyInfo(storeCurrency)?.symbol}</span>
                  <span>{getCurrencyInfo(storeCurrency)?.code}</span>
                  <span className="text-white/70">- {getCurrencyInfo(storeCurrency)?.name}</span>
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showCurrencySelector ? 'rotate-180' : ''}`} />
              </button>
              
              {showCurrencySelector && (
                <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setStoreCurrency(curr.code);
                        setShowCurrencySelector(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors ${
                        storeCurrency === curr.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="font-semibold w-8">{curr.symbol}</span>
                      <span className="font-medium">{curr.code}</span>
                      <span className="text-sm text-gray-400 ml-auto">{curr.name}</span>
                      {storeCurrency === curr.code && <Check className="w-5 h-5 text-orange-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Store Name', storeLanguage)}
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder={t('Enter store name', storeLanguage)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Store Address', storeLanguage)}
              </label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                placeholder={t('Enter store address', storeLanguage)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* AI Generation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('AI Title', storeLanguage)}</h3>
                <p className="text-sm text-gray-500">{t('AI Desc', storeLanguage)}</p>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">{t('Upload menu image', storeLanguage)}</p>
          </div>

          <button
            onClick={analyzeMenuImage}
            disabled={isAnalyzing}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            {isAnalyzing ? t('Analyzing...', storeLanguage) : t('Generate with AI', storeLanguage)}
          </button>

          {isAnalyzing && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${analyzeProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Menu Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-32">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t('Menu Categories', storeLanguage)}</h3>
            <button
              onClick={() => setShowAddCategory(true)}
              className="px-4 py-2 bg-orange-100 text-orange-600 font-medium rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('Add Category', storeLanguage)}
            </button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={t('Enter category name', storeLanguage)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-3"
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              />
              <div className="flex gap-2">
                <button
                  onClick={addCategory}
                  className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  {t('Add', storeLanguage)}
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('Cancel', storeLanguage)}
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">{t('No categories', storeLanguage)}</p>
              <p className="text-gray-400 text-sm">{t('Add first', storeLanguage)}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat, index) => (
                <div key={cat.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                  {/* Category Header */}
                  <div
                    className="flex items-center justify-between px-5 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {cat.translations[storeLanguage] || cat.name}
                        </h4>
                        <p className="text-sm text-gray-500">{cat.items.length} {t('Items', storeLanguage)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCategory(cat.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {expandedCategories.includes(cat.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Category Items */}
                  {expandedCategories.includes(cat.id) && (
                    <div className="p-4 space-y-3">
                      {cat.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          {/* Item Image */}
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900">
                              {item.translations[storeLanguage]?.name || item.translations['en']?.name || item.name}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {item.translations[storeLanguage]?.description || item.translations['en']?.description || item.description}
                            </p>
                            {/* Allergens */}
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {item.allergens.map(aid => {
                                  const ag = EU_ALLERGENS.find(a => a.id === aid);
                                  if (!ag) return null;
                                  return (
                                    <span
                                      key={aid}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-md"
                                      style={{ color: ag.color, backgroundColor: ag.bgColor }}
                                      title={ag.name}
                                    >
                                      <span className="w-3 h-3">{ag.icon}</span>
                                      <span className="hidden sm:inline">{storeLanguage === 'zh' ? ag.nameZh : ag.name}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {item.tags.map(tid => {
                                  const tagDef = TAG_GROUPS.flatMap(g => g.tags).find(t => t.id === tid);
                                  if (tagDef) {
                                    return (
                                      <span
                                        key={tid}
                                        className="px-1.5 py-0.5 text-[10px] font-medium rounded-md border"
                                        style={{ color: tagDef.color, backgroundColor: tagDef.bgColor, borderColor: tagDef.borderColor }}
                                      >
                                        {storeLanguage === 'zh' ? tagDef.labelZh : tagDef.label}
                                      </span>
                                    );
                                  }
                                  return (
                                    <span key={tid} className="px-1.5 py-0.5 text-[10px] font-medium text-gray-600 bg-gray-100 rounded-md">
                                      {tid.startsWith('custom-') ? tid.replace('custom-', '') : tid}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-semibold text-orange-600">
                              {getCurrencyInfo(storeCurrency)?.symbol}{item.price.toFixed(2)}
                            </span>
                            <button
                              onClick={() => deleteItem(cat.id, item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Item Form */}
                      {addingItemTo === cat.id ? (
                        <div className="p-4 border-2 border-dashed border-orange-200 rounded-xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            {/* Image Upload */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('Item Image', storeLanguage)}
                              </label>
                              <div 
                                className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-orange-300 transition-colors"
                                onClick={() => itemImageInputRef.current?.click()}
                              >
                                {newItemImage ? (
                                  <img src={newItemImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <div className="text-center text-gray-400">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                                    <span className="text-xs">{t('Upload Image', storeLanguage)}</span>
                                  </div>
                                )}
                              </div>
                              <input
                                ref={itemImageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleItemImageUpload}
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder={t('Item Name', storeLanguage)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-2"
                              />
                              <input
                                type="text"
                                value={newItemDesc}
                                onChange={(e) => setNewItemDesc(e.target.value)}
                                placeholder={t('Description', storeLanguage)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-2"
                              />
                              <input
                                type="number"
                                value={newItemPrice}
                                onChange={(e) => setNewItemPrice(e.target.value)}
                                placeholder={t('Price', storeLanguage)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                              />
                            </div>
                          </div>

                          {/* Allergens & Tags */}
                          <div className="space-y-4 mt-2 pt-4 border-t border-gray-100">
                            <AllergenSelector
                              selectedAllergens={newItemAllergens}
                              onChange={setNewItemAllergens}
                              suggestedAllergens={suggestedAllergens}
                              onDetect={handleDetectAllergens}
                              isDetecting={isDetectingAllergens}
                              language={storeLanguage}
                            />
                            <div className="border-t border-gray-100 pt-4">
                              <TagSelector
                                selectedTags={newItemTags}
                                onChange={setNewItemTags}
                                language={storeLanguage}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => addItem(cat.id)}
                              className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600"
                            >
                              {t('Add', storeLanguage)}
                            </button>
                            <button
                              onClick={() => {
                                setAddingItemTo(null);
                                setNewItemName('');
                                setNewItemDesc('');
                                setNewItemPrice('');
                                setNewItemImage(null);
                                setNewItemAllergens([]);
                                setNewItemTags([]);
                                setSuggestedAllergens([]);
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              {t('Cancel', storeLanguage)}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingItemTo(cat.id)}
                          className="w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t('Add Item', storeLanguage)}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Bottom Save Button */}
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-[60] pb-safe">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={saveMenu}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-xl shadow-orange-500/30 text-lg"
            >
              {t('Save Menu', storeLanguage)}
            </button>
          </div>
        </div>

        {/* QR Preview Modal */}
        {showQRPreview && generatedMenu && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center">
              <button
                onClick={() => setShowQRPreview(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('Success!', storeLanguage)}
              </h2>
              <p className="text-gray-500 mb-6">
                {t('Your menu is ready!', storeLanguage)}
              </p>
              
              {/* Menu Link */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-2">{t('Menu Link', storeLanguage)}</p>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/menu/${generatedMenu.id}`}
                    className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
                  />
                  <button
                    onClick={copyMenuLink}
                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {linkCopied && <p className="text-xs text-green-500 mt-1">{t('Link Copied!', storeLanguage)}</p>}
              </div>
              
              {/* QR Code */}
              <div className="bg-white p-4 rounded-2xl shadow-lg inline-block mb-6">
                <QRCodeCanvas value={`${window.location.origin}/menu/${generatedMenu.id}`} size={180} />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const canvas = document.querySelector('canvas');
                    if (canvas) {
                      const link = document.createElement('a');
                      link.download = `${generatedMenu.storeName}-qr.png`;
                      link.href = canvas.toDataURL();
                      link.click();
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  {t('Download QR', storeLanguage)}
                </button>
                <button
                  onClick={() => window.open(`/menu/${generatedMenu.id}`, '_blank')}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200"
                >
                  <Eye className="w-5 h-5" />
                  {t('View Menu', storeLanguage)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMenuPage;
