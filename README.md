# 🎴 PokeCollect - Pokemon Card Tracker


A super fun Pokemon card collection tracker with an engaging rewards system, avatar customization, and tons of delightful Pokemon-themed features! YA social pokemon collecting app where u can also talk with ur friends and stuff!!!!

![Pokemon Tracker](https://img.shields.io/badge/Pokemon-Tracker-yellow?style=for-the-badge&logo=pokemon)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pokemon-tracker.git
cd pokemon-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Prisma + SQLite
- **State Management**: Zustand
- **Card Data**: Pokemon TCG API
- **Sound**: Web Audio API + Howler.js

## 📁 Project Structure

```
pokemon-tracker/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── collection/      # Card collection view
│   │   ├── search/          # Card search
│   │   ├── shop/            # Avatar shop
│   │   ├── eggs/            # Egg hatching
│   │   └── profile/         # User profile
│   ├── components/
│   │   ├── ui/              # UI components
│   │   ├── cards/           # Card components
│   │   ├── animations/      # Animation components
│   │   └── companion/       # Floating companion
│   └── lib/
│       ├── store.ts         # Zustand stores
│       ├── pokemon-tcg.ts   # API wrapper
│       ├── sounds.ts        # Sound manager
│       └── easter-eggs.ts   # Secret features
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

## 🎨 Customization

### Adding New Avatar Items
Edit `src/lib/store.ts` and add items to `defaultShopItems`:

```typescript
{ 
  id: 'frame-custom', 
  name: 'Custom Frame', 
  description: 'Your description', 
  type: 'frame', 
  price: 500, 
  rarity: 'rare' 
}
```

### Adding New Achievements
Edit `defaultAchievements` in `src/lib/store.ts`.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📜 License

This project is for educational purposes. Pokemon is a trademark of Nintendo/Game Freak.

---

Made with ❤️ and lots of ⚡ by Pokemon fans!
