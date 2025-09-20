# xova Platform Transformation Plan

## Executive Summary

Transform the existing static smoothie generator application into a comprehensive marketplace platform with three user personas:
- **End Users**: Generate personalized smoothies, pay per generation, find matching shops
- **Shop Owners**: Join marketplace, receive orders, manage inventory, suggest modifications
- **Administrators**: Manage platform, monitor transactions, handle disputes, analytics

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (existing)
- **UI Components**: Shadcn/ui (Radix UI + Tailwind CSS)
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand for client state
- **Styling**: Tailwind CSS (existing) + Shadcn themes

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Migrations**: Drizzle Kit (automated)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime for order updates
- **Storage**: Supabase Storage for images

### Payments
- **Primary**: Stripe (international cards, Apple Pay, Google Pay)
- **Local**: Twint (Swiss mobile payments)
- **Billing**: Subscription management via Stripe Billing

### Infrastructure
- **Hosting**: Vercel (existing)
- **Email**: Resend for transactional emails
- **Monitoring**: Vercel Analytics + Sentry
- **CDN**: Vercel Edge Network

## Project Phases

### Phase 1: Foundation & Authentication (3-4 days)
- Supabase setup and configuration
- Database schema design and migrations
- Authentication implementation
- User role management system
- Shadcn/ui integration

### Phase 2: Payment Integration (2-3 days)
- Stripe setup and configuration
- Twint integration
- Payment per generation flow
- Subscription plans for shops
- Payment webhook handling

### Phase 3: User Experience Enhancement (4-5 days)
- User dashboard and profile
- Generation history
- Favorite recipes management
- User preferences and settings
- Mobile-responsive design

### Phase 4: Shop Owner Portal (5-6 days)
- Shop registration and onboarding
- Shop dashboard and analytics
- Inventory management
- Order management system
- Recipe modification suggestions
- Pricing and availability settings

### Phase 5: Marketplace Features (3-4 days)
- Advanced shop matching algorithm
- Recipe-to-shop recommendation
- Distance and similarity scoring
- Shop reviews and ratings
- Real-time availability

### Phase 6: Admin Dashboard (3-4 days)
- Platform analytics and metrics
- User and shop management
- Content moderation tools
- Financial reporting
- Support ticket system

### Phase 7: Advanced Features (4-5 days)
- AI-powered recipe optimization
- Nutritional tracking
- Loyalty programs
- Referral system
- Multi-language support
- API for third-party integrations

### Phase 8: Launch Preparation (1 week)
- Security audit
- Performance optimization
- Documentation
- Marketing website updates
- Beta testing
- Production deployment

## Database Architecture

### Core Entities
- **Users**: Authentication, profiles, preferences
- **Shops**: Business info, capabilities, inventory
- **Recipes**: Generated smoothies, layers, ingredients
- **Orders**: Transactions, status, fulfillment
- **Payments**: Stripe/Twint records, subscriptions
- **Reviews**: Shop and recipe ratings

### Relationships
- Users → Many Orders, Recipes, Reviews
- Shops → Many Orders, Shop Items, Reviews
- Recipes → Many Orders, Ingredients
- Orders → One User, Shop, Recipe, Payment

## Security Considerations

### Authentication
- Multi-factor authentication
- OAuth providers (Google, Apple)
- Session management
- Role-based access control (RBAC)

### Payment Security
- PCI compliance via Stripe
- Secure webhook endpoints
- Payment tokenization
- Fraud detection

### Data Protection
- GDPR compliance
- Data encryption at rest
- Secure API endpoints
- Rate limiting
- Input validation

## Monetization Strategy

### Revenue Streams
1. **Per-Generation Fees**: CHF 0.50-2.00 per smoothie generation
2. **Shop Subscriptions**: CHF 49-299/month based on tier
3. **Premium Features**: Advanced analytics, priority support
4. **Commission**: 5-10% on completed orders
5. **Sponsored Listings**: Featured shop placements

### Pricing Tiers

#### For Users
- **Free**: Browse, view recipes (no generation)
- **Pay-per-use**: CHF 1.50 per generation
- **Monthly Pass**: CHF 9.90 unlimited generations

#### For Shops
- **Starter**: CHF 49/month - Basic listing, 50 orders
- **Professional**: CHF 149/month - Analytics, unlimited orders
- **Enterprise**: CHF 299/month - API access, priority support

## Success Metrics

### Platform KPIs
- Monthly Active Users (MAU)
- Generation-to-order conversion rate
- Average order value
- Shop retention rate
- User lifetime value (LTV)

### Technical Metrics
- Page load time < 2s
- API response time < 200ms
- 99.9% uptime SLA
- Database query performance
- Error rate < 0.1%

## Risk Management

### Technical Risks
- Supabase rate limits → Implement caching
- Payment provider downtime → Multiple providers
- Data migration issues → Staged rollout

### Business Risks
- Low shop adoption → Incentive program
- User churn → Engagement features
- Competition → Unique value proposition

## Timeline Summary

**Total Duration**: 4-6 weeks (AI-Assisted Development)

- Week 1: Foundation, Authentication & Payments (Days 1-7)
- Week 2: User Experience & Shop Portal (Days 8-14)
- Week 3: Marketplace Features & Admin Dashboard (Days 15-21)
- Week 4: Advanced Features & Launch Preparation (Days 22-28)

## Budget Estimation

### Development Costs
- Development: 580 hours × CHF 150 = CHF 87,000
- Design: 120 hours × CHF 120 = CHF 14,400
- Testing: 80 hours × CHF 100 = CHF 8,000
- **Total Development**: CHF 109,400

### Infrastructure (Monthly)
- Supabase: CHF 25-250
- Vercel Pro: CHF 20
- Stripe fees: 2.9% + CHF 0.30 per transaction
- Twint fees: 1.3% per transaction
- Domain & SSL: CHF 50/year
- **Total Monthly**: CHF 200-500 + transaction fees

## Next Steps

1. Review and approve plan
2. Set up development environment
3. Create Supabase project
4. Initialize Drizzle ORM
5. Begin Phase 1 implementation

## Documentation

Each phase has a detailed document:
- [Phase 1: Foundation & Authentication](./phase1.md)
- [Phase 2: Payment Integration](./phase2.md)
- [Phase 3: User Experience](./phase3.md)
- [Phase 4: Shop Owner Portal](./phase4.md)
- [Phase 5: Marketplace Features](./phase5.md)
- [Phase 6: Admin Dashboard](./phase6.md)
- [Phase 7: Advanced Features](./phase7.md)
- [Phase 8: Launch Preparation](./phase8.md)