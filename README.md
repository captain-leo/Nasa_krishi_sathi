
```markdown
# KrishiSathi - AI-Powered Agricultural Advisory Platform

![KrishiSathi Banner](https://via.placeholder.com/1200x400/4ADE80/FFFFFF?text=KrishiSathi+-+Smart+Farming+with+NASA+Data)

## 🌱 Overview

KrishiSathi is an innovative agricultural advisory platform that leverages NASA satellite data, weather information, and AI-powered insights to help farmers make data-driven decisions. The platform provides personalized crop recommendations, growth monitoring, and market intelligence to enhance agricultural productivity.

## 🚀 Features

### Core Functionalities
- **🌤️ Real-time Weather Integration** - Get accurate weather forecasts for your location
- **🛰️ NASA Satellite Data** - Access vegetation indices and land surface temperature data
- **🤖 AI Crop Recommendations** - Receive personalized crop suggestions based on soil and climate
- **📊 Growth Monitoring** - Track crop health and growth stages
- **💼 Market Intelligence** - Access MRV (Measurement, Reporting, Verification) data and market insights
- **🔐 Secure Authentication** - Supabase-powered user management

### Technical Features
- **Responsive Design** - Mobile-first approach for farmers in rural areas
- **Real-time Dashboard** - Live data updates and interactive charts
- **Secure Payments** - Stripe integration for premium features
- **API-First Architecture** - Modular and extensible design

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations

### Backend & APIs
- **Supabase** - PostgreSQL database with real-time capabilities
- **NASA APIs** - Satellite imagery and earth observation data
- **Weather API** - Real-time weather data integration
- **Stripe** - Payment processing

### Deployment & DevOps
- **Vercel** - Platform for frontend deployment
- **Supabase** - Backend-as-a-Service

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- NASA API key
- Weather API key
- Stripe account (for payment features)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/krishisathi2.git
cd krishisathi2
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NASA API
NASA_API_KEY=your_nasa_api_key

# Weather API
WEATHER_API_KEY=your_weather_api_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

#### Option A: Using Supabase Dashboard
1. Create a new project in Supabase
2. Run the SQL scripts from `/supabase/migrations/` in order:

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
krishisathi2/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── nasa/          # NASA data integration
│   │   ├── weather/       # Weather data endpoints
│   │   └── mrv/           # MRV data endpoints
│   ├── dashboard/         # User dashboard
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase client configuration
│   └── utils/             # Helper functions
├── middleware.ts          # Next.js middleware
├── supabase/
│   └── migrations/        # Database migrations
└── public/                # Static assets
```

## 🔧 Configuration

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Enable Email authentication in Authentication > Settings
4. Set up Row Level Security (RLS) policies

### NASA API
1. Register at [api.nasa.gov](https://api.nasa.gov/)
2. Generate an API key
3. Enable relevant APIs (Landsat, MODIS, etc.)

### Weather API
1. Sign up for a weather service (OpenWeatherMap, WeatherAPI, etc.)
2. Obtain your API key

### Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. Set up webhooks for payment events

## 🗄️ Database Schema

Key tables include:
- `profiles` - User profiles and preferences
- `farms` - Farm location and details
- `crops` - Crop information and recommendations
- `weather_data` - Historical and forecast weather data
- `satellite_data` - NASA satellite imagery and indices
- `subscriptions` - User subscription plans

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Data Integration
- `GET /api/nasa/vegetation` - Get vegetation index data
- `GET /api/nasa/temperature` - Get land surface temperature
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast
- `GET /api/mrv/data` - Get MRV and market data

## 🎨 Customization

### Styling
The project uses Tailwind CSS with custom design tokens. Modify the color scheme in `app/globals.css`:

```css
:root {
  --primary: #4ADE80;
  --secondary: #0EA5E9;
  --accent: #F59E0B;
}
```

### Adding New Features
1. Create new API routes in `app/api/`
2. Add database migrations in `supabase/migrations/`
3. Update frontend components in `app/` and `components/`

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NASA for providing satellite data and APIs
- Supabase for the excellent backend platform
- The agricultural research community
- All our contributors and testers

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@krishisathi.com
- Documentation: [docs.krishisathi.com](https://docs.krishisathi.com)

## 🌍 Impact

KrishiSathi aims to empower farmers with technology, helping them make informed decisions that increase yield, reduce costs, and promote sustainable farming practices.

---

<div align="center">

**Built with ❤️ for the farming community**

</div>
```

This README provides:

1. **Comprehensive overview** of the project's purpose and features
2. **Clear setup instructions** with environment variables and dependencies
3. **Technical architecture** explanation for developers
4. **API documentation** for integration
5. **Deployment guidelines** for production
6. **Contribution guidelines** for open-source collaboration
7. **Professional structure** suitable for GitHub and developer onboarding