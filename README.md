# WhoWho

A digital "Guess Who?" game using emoji characters. Share a 5-digit code with a friend and start guessing!

## How It Works

1. **Generate a game** — get a random 5-digit seed code
2. **Share the code** — send it to a friend so they join the same board
3. **Pick a secret** — one player selects a secret emoji character
4. **Ask & eliminate** — the other player asks yes/no questions and clicks characters to eliminate them
5. **Guess!** — narrow it down and identify the secret character

Each seed deterministically generates the same 24 emoji characters for both players, so no server sync is needed. Game progress is saved locally in your browser.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Twemoji** for consistent cross-platform emoji rendering
- **localStorage** for game state persistence

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.
