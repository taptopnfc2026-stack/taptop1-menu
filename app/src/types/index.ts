export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  avatar?: string;
}

export interface CustomPlatformRedirect {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  category: string;
  address: string;
  products?: string[];
  features?: string[];
  websiteUrl?: string;
  googleUrl?: string;
  facebookUrl?: string;
  yelpUrl?: string;
  trustpilotUrl?: string;
  customRedirects?: CustomPlatformRedirect[];
  qrCode?: string;
  createdAt: Date;
}

export interface ReviewTemplate {
  id: string;
  storeId: string;
  content: string;
  status: 'unused' | 'used';
  createdAt: Date;
}

export type Category = 'Restaurant' | 'Retail' | 'Beauty' | 'Services' | 'Healthcare' | 'Other';

export type Platform = 'google' | 'facebook' | 'yelp' | 'trustpilot';

export interface GeneratedReview {
  id: string;
  content: string;
  wordCount: number;
  createdAt: Date;
}

// Category-based product suggestions
export const categoryProducts: Record<Category, string[]> = {
  Restaurant: [
    'Signature Pasta',
    'Grilled Steak',
    'Fresh Seafood',
    'Homemade Desserts',
    'Craft Cocktails',
    'Artisan Coffee',
    'Wood-fired Pizza',
    'Farm-to-Table Vegetables',
  ],
  Retail: [
    'Designer Clothing',
    'Handcrafted Jewelry',
    'Organic Skincare',
    'Vintage Antiques',
    'Home Decor',
    'Electronics',
    'Sports Equipment',
    'Books & Magazines',
  ],
  Beauty: [
    'Facial Treatments',
    'Hair Styling',
    'Nail Art',
    'Massage Therapy',
    'Makeup Services',
    'Skincare Products',
    'Body Spa',
    'Bridal Makeup',
  ],
  Services: [
    'Consultation',
    'Repair Services',
    'Delivery',
    'Installation',
    'Cleaning Service',
    'Photography',
    'Event Planning',
    'Personal Training',
  ],
  Healthcare: [
    'General Checkup',
    'Dental Care',
    'Eye Examination',
    'Physical Therapy',
    'Laboratory Tests',
    'Vaccination',
    'Mental Health',
    'Specialist Consultation',
  ],
  Other: [
    'Premium Service',
    'Custom Solution',
    'Expert Consultation',
    'Quality Assurance',
    '24/7 Support',
    'Fast Delivery',
    'Satisfaction Guarantee',
    'Professional Advice',
  ],
};

// Category-based feature suggestions
export const categoryFeatures: Record<Category, string[]> = {
  Restaurant: [
    'Cozy Ambiance',
    'Friendly Staff',
    'Fast Service',
    'Outdoor Seating',
    'Live Music',
    'Kids Menu',
    'Vegan Options',
    'Romantic Setting',
  ],
  Retail: [
    'Wide Selection',
    'Affordable Prices',
    'Knowledgeable Staff',
    'Easy Returns',
    'Loyalty Program',
    'Personal Shopping',
    'Gift Wrapping',
    'Custom Orders',
  ],
  Beauty: [
    'Relaxing Environment',
    'Experienced Stylists',
    'Premium Products',
    'Hygienic Standards',
    'Personalized Care',
    'Comfortable Chairs',
    'Private Rooms',
    'Latest Trends',
  ],
  Services: [
    'Professional Team',
    'On-time Delivery',
    'Transparent Pricing',
    'Quality Guarantee',
    'Customer Support',
    'Flexible Hours',
    'Free Estimates',
    'Satisfaction Assured',
  ],
  Healthcare: [
    'Modern Equipment',
    'Caring Staff',
    'Short Wait Times',
    'Insurance Accepted',
    'Comfortable Facilities',
    'Expert Doctors',
    'Comprehensive Care',
    'Emergency Services',
  ],
  Other: [
    'Excellent Quality',
    'Professional Service',
    'Competitive Pricing',
    'Customer Satisfaction',
    'Reliable Team',
    'Fast Response',
    'Industry Expert',
    'Trusted Brand',
  ],
};
