# LifeGenix - Personalized Longevity Smoothie App

A Next.js application that generates personalized 3-layer smoothie recipes based on user mood, health goals, and dietary preferences. The app matches users with nearby partner cafés for professional preparation.

## 🚀 Features

- **Personalized Recipe Generation**: AI-powered smoothie recipes based on mood and health goals
- **3-Layer Smoothie System**: Base layer, yogurt gradient, and light foam for optimal nutrition
- **Shop Matching**: Find nearby partner cafés that can prepare your personalized recipe
- **Allergy Management**: Complete allergen avoidance and dietary restriction support
- **Scientific Backing**: Evidence-based ingredients and nutritional optimization
- **Responsive Design**: Beautiful, mobile-first interface with mint/teal design system

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form

## 📁 Project Structure

```
xova-app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   ├── generate/          # Recipe generation flow
│   ├── shoppers/          # Customer-facing pages
│   ├── cafes/             # Partner café pages
│   ├── about/             # About page
│   └── blog/              # Blog and guides
├── components/            # Reusable React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── MoodSelector.tsx   # Mood selection interface
│   ├── RecipeDisplay.tsx  # Recipe visualization
│   ├── ShopMatches.tsx    # Shop matching results
│   └── OnboardingForm.tsx # User profile setup
├── lib/                   # Core business logic
│   ├── types.ts           # TypeScript type definitions
│   ├── recipe-generator.ts # Recipe generation engine
│   └── shop-matcher.ts    # Shop matching algorithm
├── data/                  # Static data and configurations
│   ├── ingredients.ts     # Ingredient database
│   ├── moods.ts          # Mood definitions
│   └── shops.ts          # Partner shop data
└── public/               # Static assets
```

## 🎯 Core Functionality

### Recipe Generation
- **Mood-Based Selection**: Users select their current mood to influence recipe recommendations
- **Goal Optimization**: Recipes optimized for energy boost, calm stomach, or meal replacement
- **Allergy Safety**: Complete allergen avoidance with intelligent substitutions
- **Scientific Precision**: Evidence-based ingredient selection for longevity benefits

### Shop Matching
- **Location-Based**: Find nearby partner cafés using geolocation
- **Capability Matching**: Match recipes to shops based on available ingredients and equipment
- **Substitution Suggestions**: Intelligent ingredient swaps when exact matches aren't available
- **Quality Scoring**: Match percentage based on recipe compatibility

### User Experience
- **Progressive Onboarding**: 4-step profile setup with progress tracking
- **Visual Recipe Display**: Beautiful 3-layer smoothie visualization
- **Interactive Components**: Smooth animations and hover effects
- **Mobile-First Design**: Optimized for all device sizes

## 🎨 Design System

### Colors
- **Primary**: Teal (#14b8a6) and Mint (#22c55e) gradients
- **Neutrals**: Gray scale from #f9fafb to #111827
- **Accents**: Purple gradients for smoothie layers

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear heading and body text scales
- **Accessibility**: High contrast ratios and readable sizes

### Components
- **Buttons**: Primary (teal), Secondary (outline), and accent variants
- **Cards**: Consistent padding, shadows, and border radius
- **Forms**: Accessible inputs with focus states and validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd xova-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages Overview

### Home Page (`/`)
- Hero section with value proposition
- How it works (3-step process)
- Benefits and features
- Sample recipe preview
- Customer testimonials
- Call-to-action sections

### Recipe Generation (`/generate`)
- Progressive onboarding flow
- Mood selection interface
- Recipe generation and display
- Shop matching results
- Order placement flow

### For Shoppers (`/shoppers`)
- Detailed feature explanations
- Sample recipe with measurements
- Pricing information
- Benefits and testimonials

### For Cafés (`/cafes`)
- Partnership benefits
- How it works for businesses
- Essentials kit details
- Commission model
- Partner application form

### About (`/about`)
- Company mission and values
- Team information
- Data privacy and security
- Contact information

### Blog (`/blog`)
- Featured articles
- Category filtering
- Newsletter signup
- Expert insights and guides

## 🔧 Customization

### Adding New Ingredients
Edit `data/ingredients.ts` to add new ingredients with:
- Nutritional information
- Allergen data
- Cost and quality ratings
- Longevity compounds

### Adding New Shops
Edit `data/shops.ts` to add partner locations with:
- Contact information
- Menu items
- Capabilities and equipment
- Geographic coordinates

### Modifying Recipe Logic
Update `lib/recipe-generator.ts` to:
- Add new health goals
- Modify ingredient selection algorithms
- Adjust portion sizes
- Update nutritional calculations

## 🧪 Testing

The app includes comprehensive TypeScript types for:
- User profiles and preferences
- Recipe structures and ingredients
- Shop data and capabilities
- Mood definitions and mappings

## 📈 Performance

- **Next.js 14**: Latest framework with App Router
- **Tailwind CSS**: Utility-first styling for optimal bundle size
- **TypeScript**: Type safety and better developer experience
- **Responsive Images**: Optimized loading and display
- **Code Splitting**: Automatic route-based splitting

## 🔒 Security & Privacy

- **GDPR Compliance**: User data protection and control
- **Allergen Safety**: Comprehensive allergen management
- **Medical Disclaimer**: Clear health information boundaries
- **Data Encryption**: Secure data transmission and storage

## 🚀 Deployment

The app is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting platform**

## 📞 Support

For questions or support:
- Email: hello@xova.ch
- Phone: +41 44 123 45 67
- Documentation: [Link to docs]

## 📄 License

This project is proprietary software. All rights reserved.

---

**LifeGenix** - Personalized longevity smoothies, scientifically optimized for your health goals.
