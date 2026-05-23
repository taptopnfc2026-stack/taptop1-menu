import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  QrCode, 
  Star, 
  Utensils,
  ShoppingBag,
  Sparkle,
  Wrench,
  Heart,
  Zap,
  UtensilsCrossed,
  Globe,
  MessageSquare,
  Users,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Fingerprint,
  Scan,
  Tablet,
  Menu,
  Award,
  Shield,
  Rocket,
  Layers,
  Target,
  Gem
} from 'lucide-react';

const industryTemplates = [
  { icon: Utensils, name: 'Restaurant', gradient: 'bg-gradient-to-br from-orange-500 to-red-500' },
  { icon: ShoppingBag, name: 'Retail', gradient: 'bg-gradient-to-br from-blue-500 to-indigo-500' },
  { icon: Sparkle, name: 'Beauty', gradient: 'bg-gradient-to-br from-pink-500 to-rose-500' },
  { icon: Wrench, name: 'Services', gradient: 'bg-gradient-to-br from-emerald-500 to-green-500' },
  { icon: Heart, name: 'Healthcare', gradient: 'bg-gradient-to-br from-red-500 to-pink-500' },
  { icon: Zap, name: 'Tech', gradient: 'bg-gradient-to-br from-violet-500 to-purple-500' },
];

const quickActions = [
  { icon: Sparkles, label: 'AI Reviews', desc: 'Generate authentic reviews', gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', href: '/generate-review' },
  { icon: QrCode, label: 'QR Codes', desc: 'Custom branded codes', gradient: 'from-cyan-500 via-blue-500 to-indigo-500', href: '/create-qr' },
  { icon: UtensilsCrossed, label: 'Digital Menu', desc: 'Multi-language smart menus', gradient: 'from-emerald-500 via-teal-500 to-cyan-500', href: '/create-menu' },
  { icon: QrCode, label: 'QR Codes', desc: 'Instant menu access', gradient: 'from-cyan-500 via-blue-500 to-indigo-500', href: '/create-qr' },
];

const features = [
  {
    icon: Fingerprint,
    title: 'One-Tap Experience',
    description: 'Customers scan QR codes with a single tap to access menus, reviews, and more. No app download required.',
    gradient: 'from-violet-500 to-fuchsia-500'
  },
  {
    icon: Scan,
    title: 'Smart QR Generation',
    description: 'AI-powered QR codes with analytics tracking. Monitor scans, locations, and customer behavior.',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Tablet,
    title: 'Digital Touch Menus',
    description: 'Stunning bilingual menus that customers can browse in their preferred language instantly.',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: MessageSquare,
    title: 'AI Review Generation',
    description: 'Create authentic, natural-sounding reviews that help build your online reputation.',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and GDPR compliance. Your data is always safe and protected.',
    gradient: 'from-slate-500 to-gray-600'
  },
];

const stats = [
  { label: 'Active Users', value: '50K+', icon: Users, color: 'text-violet-600' },
  { label: 'QR Scans', value: '2M+', icon: Scan, color: 'text-cyan-600' },
  { label: 'Rating Boost', value: '+47%', icon: TrendingUp, color: 'text-emerald-600' },
];

const benefits = [
  { icon: Rocket, title: '5-Minute Setup', description: 'Create your first QR code in minutes' },
  { icon: Globe, title: '50+ Languages', description: 'Reach customers worldwide' },
  { icon: Award, title: 'Premium Quality', description: 'Beautiful design, every time' },
  { icon: Layers, title: 'All-in-One Platform', description: 'Menu, QR, analytics unified' },
];

const testimonials = [
  {
    name: 'Maria Chen',
    business: 'Golden Dragon Restaurant',
    avatar: '👩‍💼',
    content: 'Our customer wait time decreased by 60% after switching to digital menus. The bilingual feature is incredible!',
    rating: 5
  },
  {
    name: 'James Wilson',
    business: 'Urban Outfitters',
    avatar: '👨‍💻',
    content: 'QR code scans increased our review count by 300%. The analytics dashboard helps us understand customers better.',
    rating: 5
  },
  {
    name: 'Sarah Kim',
    business: 'Serenity Spa',
    avatar: '👩‍🎨',
    content: 'Best platform for our business. The AI-generated content looks completely authentic and natural.',
    rating: 5
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/40 via-purple-200/30 to-fuchsia-200/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-200/30 via-blue-200/30 to-indigo-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            {/* Left Content - Mobile Optimized */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
                </span>
                <span className="text-sm font-medium text-violet-700">Powered by Advanced AI</span>
              </div>

              {/* Main Heading - Mobile Sized */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
                One Tap.
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Menu for Everyone.
                </span>
              </h1>

              {/* Subtitle - Mobile Sized */}
              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2">
                打造全球餐饮行业最智能的多语言菜单平台，让每一位顾客都能无障碍、自信地完成点餐。
              </p>

              {/* CTA Buttons - Mobile Friendly */}
              <div className="flex flex-col gap-3 px-4 sm:px-0 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  to="/create-qr"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-purple-500/30 transition-all active:scale-95"
                >
                  <QrCode className="w-5 h-5" />
                  Create Your First QR
                </Link>
                <Link
                  to="/create-menu"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-violet-300 hover:text-violet-600 transition-all active:scale-95"
                >
                  <Menu className="w-5 h-5" />
                  Try Digital Menu
                </Link>
              </div>

              {/* Trust Indicators - Mobile Sized */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
                <div className="flex -space-x-2">
                  {['👩‍💼', '👨‍💻', '👩‍🎨', '👨‍🔬'].map((emoji, i) => (
                    <div 
                      key={i} 
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-white flex items-center justify-center text-sm shadow-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">5.0 Rating</p>
                </div>
              </div>
            </div>

            {/* Right Visual - Desktop Only */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Main Phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[580px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] border-4 border-gray-700 shadow-2xl shadow-purple-500/20 overflow-hidden z-10">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl" />
                  <div className="h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-5 pt-12">
                    {/* Mock Menu UI */}
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-3 shadow-lg">
                          <UtensilsCrossed className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-white font-bold text-lg">Golden Dragon</h3>
                        <p className="text-gray-400 text-xs">Chinese Restaurant</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-medium">Kung Pao Chicken</p>
                              <p className="text-gray-400 text-xs">宫保鸡丁</p>
                            </div>
                            <span className="text-violet-400 font-bold">$18.99</span>
                          </div>
                          <p className="text-gray-500 text-xs">Spicy diced chicken with peanuts</p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-medium">Spring Rolls</p>
                              <p className="text-gray-400 text-xs">春卷</p>
                            </div>
                            <span className="text-violet-400 font-bold">$8.99</span>
                          </div>
                          <p className="text-gray-500 text-xs">Crispy vegetable rolls</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 rounded-xl p-4 text-center">
                          <p className="text-white text-sm font-medium">Scan QR to Order</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -left-8 bg-white rounded-2xl p-4 shadow-2xl z-20 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Order Confirmed</p>
                      <p className="text-sm text-gray-500">Table #5</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/4 -right-12 bg-white rounded-2xl p-4 shadow-2xl z-20 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center shadow-lg">
                      <Scan className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">1,234</p>
                      <p className="text-sm text-gray-500">Total Scans</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 right-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-4 shadow-2xl z-20 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="text-center text-white">
                    <p className="text-2xl font-bold">4.9</p>
                    <div className="flex justify-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-white text-white" />
                      ))}
                    </div>
                    <p className="text-xs text-white/80 mt-1">Rating Boost</p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/50 via-purple-200/30 to-fuchsia-200/50 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile Optimized */}
      <section className="py-12 md:py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-50 mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions - Mobile Optimized Grid */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 text-sm font-semibold rounded-full mb-4">
              Quick Start
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto px-2">
              Powerful AI tools to transform how customers interact with your business
            </p>
          </div>

          {/* Mobile: 2 columns, Desktop: 4 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className={`relative inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.gradient} mb-3 sm:mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                
                <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{action.label}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 hidden sm:block">{action.desc}</p>
                
                <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold">
                  <span className={`bg-gradient-to-r ${action.gradient} bg-clip-text text-transparent`}>
                    Get Started
                  </span>
                  <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 text-violet-500 group-hover:translate-x-1 transition-transform`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Mobile Optimized */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-fuchsia-100 text-fuchsia-700 text-sm font-semibold rounded-full mb-4">
              Features
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Built for Modern Business
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto px-2">
              Powerful features that help you create exceptional customer experiences
            </p>
          </div>

          {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
                
                <div className={`relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 sm:mb-6 shadow-lg`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries - Mobile Optimized */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              Works for Every Industry
            </h2>
            <p className="text-base text-white/80 max-w-2xl mx-auto px-2">
              Tailored solutions for your specific business needs
            </p>
          </div>

          {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 3 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {industryTemplates.map((template, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer active:scale-95"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${template.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <template.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">{template.name}</h3>
                    <p className="text-xs sm:text-sm text-white/70 hidden sm:block">Industry Template</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Mobile Optimized */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-violet-600" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Mobile Optimized */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Loved by Businesses
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto px-2">
              See what our customers have to say about Taptop Menu
            </p>
          </div>

          {/* Mobile: stacked, Desktop: 3 columns */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-lg sm:text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{testimonial.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-violet-950 to-fuchsia-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-violet-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-fuchsia-500/30 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 sm:mb-8">
            <Gem className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">No credit card required</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Your Customer Experience?
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
            Join thousands of businesses using Taptop Menu to create exceptional digital experiences
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/create-qr"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-bold rounded-full hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Rocket className="w-5 h-5" />
              Start Free Trial
            </Link>
            <Link
              to="/create-menu"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all active:scale-95"
            >
              <Target className="w-5 h-5" />
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-gray-900 text-gray-400 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 md:mb-12">
            <div className="col-span-2 sm:col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white">Taptop Menu</span>
              </Link>
              <p className="text-sm leading-relaxed hidden sm:block">
                Transform your business with AI-powered digital menus and smart QR codes.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm">
                <li><Link to="/create-qr" className="hover:text-white transition-colors">QR Codes</Link></li>
                <li><Link to="/create-menu" className="hover:text-white transition-colors">Digital Menu</Link></li>
                <li><Link to="/generate-review" className="hover:text-white transition-colors">AI Reviews</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">Legal / 法律</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy / 隐私政策</Link></li>
                <li><Link to="/imprint" className="hover:text-white transition-colors">Imprint / 公司信息</Link></li>
                <li><Link to="/privacy#cookies" className="hover:text-white transition-colors">Cookie Policy / Cookie 政策</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
            <p>&copy; 2026 Taptop Menu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
