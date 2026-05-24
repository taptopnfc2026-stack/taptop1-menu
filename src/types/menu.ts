// Menu Types

export interface MenuItemTranslation {
  name: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  translations: Record<string, MenuItemTranslation>;
  allergens?: string[];
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  translations: Record<string, string>;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  storeId?: string;
  storeName: string;
  storeAddress?: string;
  storeLanguage?: string;
  storeCurrency?: string;
  categories: MenuCategory[];
  createdAt: Date;
  updatedAt: Date;
}

// Currency types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to USD
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
  { code: 'KRW', name: 'Korean Won', symbol: '₩', rate: 1320 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.50 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 24500 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.20 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', rate: 31.50 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.72 },
];

export interface MenuOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface MenuOrder {
  id: string;
  items: MenuOrderItem[];
  totalAmount: number;
  createdAt: Date;
  customerNotes?: string;
}

// Supported Languages
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇭🇰' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇦🇩' },
];

// Common menu item templates by category (for AI suggestions)
export const menuItemTemplates: Record<string, { name: string; description: string; price: string }[]> = {
  Appetizers: [
    { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls served with sweet chili sauce', price: '8.99' },
    { name: 'Chicken Wings', description: 'Fried chicken wings with your choice of sauce', price: '10.99' },
    { name: 'Soup of the Day', description: 'Ask your server for today\'s selection', price: '6.99' },
    { name: 'Bruschetta', description: 'Toasted bread with tomatoes, basil and olive oil', price: '7.99' },
  ],
  'Main Course': [
    { name: 'Grilled Steak', description: 'Premium beef steak with seasonal vegetables', price: '24.99' },
    { name: 'Signature Pasta', description: 'Fresh pasta with our special house sauce', price: '18.99' },
    { name: 'Fresh Seafood', description: 'Catch of the day, ask for details', price: '28.99' },
    { name: 'Vegetarian Dish', description: 'Seasonal vegetables with tofu', price: '16.99' },
  ],
  Desserts: [
    { name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: '8.99' },
    { name: 'Ice Cream', description: 'Three scoops of premium ice cream', price: '6.99' },
    { name: 'Fruit Salad', description: 'Fresh seasonal fruits', price: '7.99' },
  ],
  Beverages: [
    { name: 'Soft Drink', description: 'Coke, Sprite, Fanta or similar', price: '3.99' },
    { name: 'Fresh Juice', description: 'Orange, apple or mixed fruit', price: '5.99' },
    { name: 'Coffee', description: 'Espresso, cappuccino or americano', price: '4.99' },
    { name: 'Tea', description: 'Green, black or herbal tea', price: '3.99' },
  ],
  Sides: [
    { name: 'French Fries', description: 'Crispy golden fries', price: '4.99' },
    { name: 'Salad', description: 'Fresh garden salad with house dressing', price: '5.99' },
    { name: 'Rice', description: 'Steamed white or brown rice', price: '3.99' },
    { name: 'Bread Basket', description: 'Assorted fresh bread', price: '4.99' },
  ],
};

export const defaultCategories = [
  'Appetizers',
  'Main Course',
  'Desserts',
  'Beverages',
  'Sides',
];
