# React Word Scramble

A fun, interactive word scramble game built with React where players unscramble words against the clock.

## 🎮 Features

- Word scrambling with adjustable difficulty
- Score tracking for correct guesses
- Option to skip difficult words
- Game history to track performance
- End-game summary with statistics

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/JavaGalaxy/react-word-scramble.git
   cd react-word-scramble
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
    yarn
   ```

3. Start the development server:

   ```
   npm start
   ```

   or

   ```
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the game in your browser.

## 📖 How to Play

1. Press the "Begin new game" button to start
2. A scrambled word will appear
3. Type your guess in the input field
4. If your guess is correct, you'll get a new word and your score increases
5. If a word is too difficult, click "Skip Word" to move to the next one
6. End the game at any time with the "End Game" button
7. View your performance in the end-game summary

## 🏗️ Project Structure

- `src/App.tsx` - Main application component
- `src/appState.ts` - State management with reducer pattern
- `public/fruits.txt` - Source word list

## 🧪 Running Tests

```bash
npm test
```

or

```bash
yarn test
```

## 🔮 Future Enhancements

- Timer-based gameplay
- Difficulty levels
- Multiplayer mode
- High score leaderboard
- Word categories

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
