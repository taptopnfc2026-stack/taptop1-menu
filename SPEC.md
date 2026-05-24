# Taptop Menu - Technical Specification

## 1. Concept & Vision

Taptop Menu is the world's most intelligent multi-language menu platform for the global restaurant industry. It empowers every customer to browse, understand, and order with confidence—regardless of their native language. The interface communicates trust and professionalism through clean glassmorphism aesthetics with vibrant pink and cyan accents, creating an experience that feels both innovative and welcoming to business owners of all technical levels.

## 2. Design Language

### Aesthetic Direction
- **Style**: Glassmorphism with vibrant gradient backgrounds
- **Personality**: Modern SaaS, professional yet creative, trustworthy, innovative
- **Mood**: Clean, layered, with depth and multi-dimensional feel

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#EC4899` (Pink-500) | Main CTAs, highlights, active states |
| Secondary | `#F472B6` (Pink-400) | Hover states, gradients |
| Accent/CTA | `#06B6D4` (Cyan-500) | Secondary actions, links |
| Background | `#FDF2F8` (Pink-50) | Page backgrounds |
| Surface | `#FFFFFF` with 80% opacity | Cards, panels |
| Text Primary | `#831843` (Pink-900) | Headings |
| Text Secondary | `#6B7280` (Gray-500) | Body text |
| Border | `rgba(255,255,255,0.2)` | Glass effects |

### Typography
- **Headings**: Poppins (600, 700) - Modern, professional
- **Body**: Open Sans (400, 500, 600) - Clean, readable
- **Scale**: 14px base, 1.5 line-height, modular scale 1.25

### Spatial System
- Base unit: 4px
- Component padding: 16px (sm), 24px (md), 32px (lg)
- Section spacing: 48px-64px
- Max content width: 1280px
- Border radius: 8px (sm), 12px (md), 16px (lg), 24px (xl)

### Motion Philosophy
- **Transitions**: 200ms ease-out for micro-interactions
- **Page transitions**: 300ms fade with slight translate
- **Loading states**: Subtle pulse animations
- **Hover feedback**: Scale 1.02 with shadow elevation
- **Respect prefers-reduced-motion**

### Visual Assets
- **Icons**: Lucide React (24x24 default, consistent stroke width)
- **Illustrations**: Abstract gradient blobs, geometric shapes
- **QR Codes**: High contrast, centered, with brand accent
- **Images**: AI-generated placeholder visuals with gradient overlays

## 3. Layout & Structure

### Navigation Architecture
```
├── Bottom Navigation (Mobile-first)
│   ├── Home
│   ├── Marketing
│   └── Profile
├── Header (Desktop)
│   ├── Logo
│   ├── Navigation Links
│   └── User Menu
└── Mobile Drawer (for additional pages)
```

### Page Templates
1. **Landing Pages**: Hero + Content sections + CTAs
2. **Generator Pages**: Input form + Output display
3. **List Pages**: Filter bar + Card grid/list
4. **Form Pages**: Single column + Progressive disclosure

### Responsive Breakpoints
- Mobile: 375px-767px (single column, bottom nav)
- Tablet: 768px-1023px (sidebar nav option)
- Desktop: 1024px+ (header nav, multi-column layouts)

## 4. Features & Interactions

### 4.1 Authentication
- Email/Password login
- Google OAuth
- Session persistence with localStorage
- Protected route middleware

### 4.2 Home Page
**Elements:**
- Hero section with animated gradient background
- Stats banner: "Trusted by 10,000+ businesses worldwide"
- Primary CTAs: "Generate Review" / "Create Store QR"
- Quick access to recent QR codes
- Industry templates carousel
- Bottom navigation bar

**Interactions:**
- Tap CTA → Navigate to respective page
- Swipe carousel for industry templates
- Pull-to-refresh on mobile (simulated)

### 4.3 Generate Review Page
**Elements:**
- QR shortcut button (top-right)
- Experience description textarea
- Length slider (50-300 words)
- Generate button (primary)
- AI output card with copy button
- Disclaimer text

**Interactions:**
- Type experience → Real-time character count
- Drag slider → Live word count preview
- Click Generate → Loading spinner → AI response
- Copy button → Clipboard + Toast confirmation
- Error → Retry button + error message

### 4.4 Create Store QR Page
**Elements:**
- Store name input
- Category dropdown (Restaurant, Retail, Beauty, Services, Healthcare, Other)
- Address textarea
- Platform redirects:
  - Google Reviews toggle + URL input
  - Facebook Reviews toggle + URL input
  - Yelp toggle + URL input
  - Trustpilot toggle + URL input
- Generate QR button
- QR preview card
- Download QR button

**Interactions:**
- Form validation on blur
- Toggle platform → Reveal URL input
- Invalid URL → Inline error
- Generate QR → Loading → Preview
- Download → Save PNG file

### 4.5 Store Landing Page (QR Target)
**Elements:**
- Store branding header (name, category, address)
- Hero image/gradient
- Generate Review button
- Use Template Library button
- Platform post buttons (Google, Facebook, Yelp, Trustpilot)
- Footer: "Manage Store" / "Create QR" links

**Interactions:**
- Scan QR → Load store data
- Generate → Open review generator
- Templates → Open template library
- Post buttons → External redirect to platform

### 4.6 Template Library Page
**Elements:**
- Tabs: Unused / Used
- Template cards grid
- Empty state with CTA
- Copy + Post buttons per card

**Interactions:**
- Tab switch → Filter templates
- Copy → Clipboard + status update to "Used"
- Post → External platform redirect
- Empty state → Create new templates

### 4.7 Create Review Template Page
**Elements:**
- Title: "Create Review Templates"
- Business highlights textarea
- Generate count slider (1-20)
- Generate button
- Generated templates list
- Save to Library button

**Interactions:**
- Input → Real-time validation
- Slider → Live count display
- Generate → Bulk AI generation
- Select templates → Save to library

### 4.8 My QR Codes
**Elements:**
- QR cards grid/list
- Edit button
- Delete button with confirmation

**Interactions:**
- Edit → Open edit modal
- Delete → Confirmation dialog → Remove
- Click card → View details

### 4.9 Profile Page
**Elements:**
- Avatar
- Name, Email fields
- Business info section
- Logout button

### 4.10 Backend Admin Panel
**Store Management:**
- Data table with pagination
- Columns: ID, Name, Category, Created Date, Actions
- Search input
- Edit/Delete actions

**Template Management:**
- Store selector dropdown
- Bulk upload (CSV)
- Template table
- Delete actions
- Pagination


## 5. Component Inventory

> **Note**: Marketing Assistant and its sub-modules (AI Image Generator, Content Generators) have been removed. The product focus is now multi-language digital menus, QR codes, reviews, and analytics.

### Navigation
- **Header**: Logo, nav links, user menu, mobile hamburger
- **BottomNav**: Home, Menu, Analytics, Profile icons with labels
- **MobileDrawer**: Extended navigation for desktop

### Cards
- **FeatureCard**: Icon, title, description, hover shadow
- **QRCodeCard**: Store info, QR preview, action buttons
- **TemplateCard**: Content preview, status badge, actions
- **PlatformCard**: Platform icon, action button

### Forms
- **TextInput**: Label, input, helper text, error state
- **Textarea**: Auto-resize, character count
- **Slider**: Custom styled with value tooltip
- **Toggle**: Animated switch with label
- **Select**: Custom dropdown with search

### Buttons
- **Primary**: Pink gradient, white text, hover scale
- **Secondary**: White/transparent, pink text, hover fill
- **Ghost**: Transparent, icon only, hover background
- **Icon**: 24x24, hover scale + color change

### Feedback
- **Toast**: Success/Error/Info variants, auto-dismiss
- **Modal**: Backdrop blur, centered content
- **Skeleton**: Pulse animation, shape variants
- **Spinner**: Rotating gradient ring

### QR Components
- **QRCodeDisplay**: Generated QR with download option
- **QRScanner**: Camera-based scanner (future)

## 6. Technical Approach

### Stack
- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS 3.4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **State**: React Context + useReducer
- **Routing**: React Router v6
- **QR Generation**: qrcode.react
- **AI Integration**: OpenAI API (simulated for demo)

### Architecture
```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Header, Footer, Nav
│   ├── forms/       # Form components
│   └── features/    # Feature-specific components
├── pages/
│   ├── Home/
│   ├── GenerateReview/
│   ├── CreateQR/
│   ├── StoreLanding/
│   ├── TemplateLibrary/
│   ├── CreateTemplate/
│   ├── MyQRCodes/
│   ├── CreateMenu/
│   ├── MenuDisplay/
│   ├── Profile/
│   ├── Analytics/
│   └── admin/
├── hooks/
├── context/
├── utils/
├── types/
└── lib/
```

### Data Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  avatar?: string;
}

interface Store {
  id: string;
  userId: string;
  name: string;
  category: string;
  address: string;
  googleUrl?: string;
  facebookUrl?: string;
  yelpUrl?: string;
  trustpilotUrl?: string;
  qrCode?: string;
  createdAt: Date;
}

interface ReviewTemplate {
  id: string;
  storeId: string;
  content: string;
  status: 'unused' | 'used';
  createdAt: Date;
}
```

### API Design (Simulated)
All API calls will be simulated with localStorage persistence and mock delays:
- `GET /stores` - List user's stores
- `POST /stores` - Create store
- `PUT /stores/:id` - Update store
- `DELETE /stores/:id` - Delete store
- `GET /templates` - List templates
- `POST /templates` - Create template
- `POST /templates/bulk` - Bulk create
- `DELETE /templates/:id` - Delete template

### Authentication Flow
1. User opens app → Check localStorage for session
2. No session → Show login page
3. Login success → Store user in context + localStorage
4. Protected routes → Check auth context
5. Logout → Clear context + localStorage

## 7. Error Handling

| Scenario | Response |
|----------|----------|
| Empty input | Inline validation message |
| AI generation fail | Toast error + Retry button |
| Invalid URL | Inline error below field |
| Network error | Toast + retry option |
| Unauthorized | Redirect to login |
| QR invalid | "QR expired or invalid" message |

## 8. Accessibility

- All interactive elements keyboard accessible
- Focus visible states on all focusables
- ARIA labels on icons and buttons
- Color contrast 4.5:1 minimum
- Screen reader announcements for dynamic content
- prefers-reduced-motion respected
