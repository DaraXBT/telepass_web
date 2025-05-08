# 🎫 TelePass Web

> Modern Event Management Platform with Multi-language Support

TelePass Web is a comprehensive event management platform built with Next.js that allows organizers to create, manage, and track events while providing a seamless experience for attendees. The platform features a responsive UI design, multi-language support (English and Khmer), and robust analytics for event performance tracking.

![TelePass Web](public/assets/images/telepass-banner.png)

## ✨ Key Features

### 📅 Event Management

- Create, edit, and delete events
- QR code generation for event check-ins
- Track attendance and registrations
- Categorize events and manage capacities

### 👥 User & Audience Management

- Manage user accounts with different permission levels
- Track audience/attendee profiles
- Select users for specific events or groups
- Analytics on user engagement

### 📊 Dashboard & Analytics

- Visual event analytics with charts and graphs
- Real-time statistics on event performance
- Attendee tracking and check-in status
- Export reports to Excel

### 🌐 Multi-language Support

- Complete internationalization with English and Khmer languages
- Easy language toggling throughout the application
- Comprehensive translation system

## 🛠️ Technology Stack

- **Frontend:** React 19.0, Next.js 15.1
- **Styling:** TailwindCSS 3.4, Radix UI components
- **State Management:** React Context API
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with bcrypt
- **Charts & Visualization:** Recharts
- **Build Tools:** TypeScript, PostCSS
- **Data Export:** XLSX

## 🚀 Getting Started

### Prerequisites

```bash
- Node.js 18+
- PostgreSQL 12+
- npm or yarn
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/telepass_web.git

# Navigate to project directory
cd telepass_web

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your database configuration and other settings

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
# or
yarn dev
```

### Environment Configuration

Create a `.env` file with the following variables:

```properties
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/tb

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentication
JWT_SECRET=your-secret-key
```

## 📋 Project Structure

```
src/
├── app/               # Next.js app router pages
│   ├── api/           # API routes
│   ├── dashboard/     # Dashboard pages
│   ├── events/        # Event management pages
│   ├── user/          # User management pages
│   └── audience/      # Audience management pages
├── components/        # Reusable React components
│   ├── audience/      # Audience-related components
│   ├── charts/        # Visualization components
│   ├── dashboard/     # Dashboard components
│   ├── events/        # Event management components
│   ├── providers/     # Context providers (Language, Theme)
│   ├── report/        # Reporting components
│   ├── ui/            # UI component library
│   └── user/          # User management components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
└── utils/             # Helper functions
```

## 🌐 Language Support

The application supports two languages:

- English (en)
- Khmer (km)

Language can be changed using the language toggler component in the UI. All UI text is managed through the `LanguageProvider` context which stores translations in a centralized location.

## 🔐 Authentication and Authorization

TelePass Web uses JWT token-based authentication with secure password hashing using bcrypt. The application has role-based access control with different permissions for administrators and event organizers.

## 📱 Responsive Design

The application is fully responsive and works on desktop and mobile devices. The interface adapts intelligently to different screen sizes using TailwindCSS breakpoints.

## 📊 Reports and Exports

Event data and registrations can be exported to Excel format for further analysis or record-keeping. The reporting interface provides filtering options to get precisely the data required.

## 🔄 Deployment

The application can be deployed to any platform supporting Next.js applications, such as Vercel, Netlify, or custom servers.

```bash
# Build for production
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Sokhen** - Frontend Developer
- **Dara** - Backend Developer

## 📞 Contact

- **Project Link:** [GitHub Repository](https://github.com/yourusername/telepass_web)

---

<div align="center">
  <sub>Built with ❤️ for better event management</sub>
</div>
