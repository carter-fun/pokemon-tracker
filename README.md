# 🎴 PokeCollect - Pokemon Card Tracker

A super fun Pokemon card collection tracker with an engaging rewards system, avatar customization, and tons of delightful Pokemon-themed features!

![Pokemon Tracker](https://img.shields.io/badge/Pokemon-Tracker-yellow?style=for-the-badge&logo=pokemon)

## ✨ Features

### 🎴 Card Collection
- Search and browse real Pokemon cards via the Pokemon TCG API
- Add cards to your collection with quantity tracking
- Holographic shimmer effects on rare cards
- Wild encounter animation when catching rare cards!
- Wishlist for cards you want to find

### 🪙 Points Economy
| Action | Points Earned |
|--------|---------------|
| Add a card | +10 pts |
| Add a rare card | +25 pts |
| Daily login | +25 pts |
| 7-day streak bonus | +100 pts |
| 30-day streak bonus | +500 pts |
| Achievement unlock | +50-500 pts |
| Hatch an egg | +25-250 pts |

### 🏪 Meowth's Avatar Shop
Spend your points on:
- 🖼️ **Profile Frames** - Fire, Water, Grass, Electric, Psychic, Dragon, Rainbow
- 🏷️ **Titles** - Pokemon Trainer, Card Collector, Pokemon Master, League Champion
- 🌄 **Backgrounds** - Pokemon Center, Gym, League, Space Station
- 🐾 **Companions** - Pikachu, Eevee, Jigglypuff, Meowth, Mew
- 🎖️ **Gym Badges** - All 8 Kanto badges

### 🥚 Pokemon Eggs
- Earn eggs from the daily spin wheel
- **Common Eggs** (1 hour) - Basic rewards
- **Rare Eggs** (4 hours) - Premium items
- **Legendary Eggs** (24 hours) - Amazing rewards

### 🏆 Achievements
- First Catch - Add your first card
- Budding Collector - Collect 10 cards
- Card Enthusiast - Collect 50 cards
- Gotta Catch 'Em All - Collect 100 cards
- Dedicated Trainer - 7-day login streak
- Pokemon Master - 30-day login streak
- Secret achievements...

### 🎮 Cool Features
- **Pokemon Button Companions** - Each button has an animated Pokemon buddy
- **Floating Companion** - Your starter Pokemon follows your cursor!
- **Day/Night Cycle** - UI changes based on time of day
- **Grass Footer** - Pokemon peek out from the grass
- **Pokeball Loading Spinner** - Shakes and opens
- **Sound Effects** - Pokeball clicks, level-up fanfares, coin sounds

### 🔮 Easter Eggs
- **Konami Code** - ↑↑↓↓←→←→BA for a special surprise
- **MISSINGNO** - Search for it in the card search
- **Pokemon Day** - Visit on February 27 for bonus points!

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
