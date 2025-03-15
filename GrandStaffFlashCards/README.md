# Grand Staff Flash Cards

A modern web application to help piano players learn to recognize and identify notes on the grand staff instantly.

## Features

- Interactive flash cards for learning grand staff notes
- Multiple choice interface with A-G note selection and accidental toggling (sharp, flat, natural)
- Notes displayed with key signatures and time signatures
- Spaced repetition for wrong answers (cards reappear within 3-8 iterations)
- Progress tracking
- Modular design with separate generic flashcard module and grand staff specific module
- Beginner-friendly: notes restricted to 2 ledger lines above and below the staff

## Architecture

The application is built with:

- **Backend**: C# ASP.NET Core Web API
  - Generic FlashCard module that can be reused for other types of flash cards
  - Grand Staff specific module for music notation
  - RESTful API endpoints for deck and card management
  
- **Frontend**: Vue.js 3 with Vite and Pinia
  - Interactive grand staff display using HTML5 Canvas
  - Multiple choice interface
  - Progress tracking
  - Composition API with script setup syntax

## Project Structure

```
GrandStaffFlashCards/
├── Backend/
│   └── FlashCardsApi/              # ASP.NET Core Web API project
│       ├── Controllers/            # API controllers
│       │   ├── DecksController.cs  # Endpoints for deck management
│       │   └── CardsController.cs  # Endpoints for card management
│       ├── Models/
│       │   └── FlashCardModels.cs  # Data models for flash cards
│       ├── Services/
│       │   └── FlashCardService.cs # Business logic service
│       ├── Program.cs              # Application entry point and configuration
│       └── run-backend.bat         # Batch file to run the backend
├── Frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── main.css            # Global styles with Bootstrap import
│   │   ├── components/
│   │   │   └── GrandStaff.vue      # Grand staff display component
│   │   ├── stores/
│   │   │   └── flashCardStore.js   # Pinia store for state management
│   │   ├── views/
│   │   │   ├── HomeView.vue        # Home page
│   │   │   ├── PracticeView.vue    # Main practice interface
│   │   │   └── DecksView.vue       # Deck management
│   │   ├── router/
│   │   │   └── index.js            # Vue Router configuration
│   │   ├── App.vue                 # Main app component
│   │   └── main.js                 # Application entry point
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite configuration
│   ├── .eslintrc.cjs               # ESLint configuration for Vue 3
│   ├── package.json                # Frontend dependencies
│   └── run-frontend.bat            # Batch file to run the frontend
└── README.md                       # This file
```

## API Endpoints

The backend provides the following RESTful API endpoints:

- **GET /api/decks** - Get all decks
- **GET /api/decks/{id}** - Get a specific deck
- **POST /api/decks** - Create a new deck
- **DELETE /api/decks/{id}** - Delete a deck
- **GET /api/decks/{deckId}/cards/random** - Get a random card from a deck
- **POST /api/decks/{deckId}/cards/{cardId}/answer** - Submit an answer for a card
- **DELETE /api/decks/{deckId}/cards/{cardId}** - Delete a card from a deck

## Note Range

To make the application more beginner-friendly, notes are restricted to:

- **Treble Clef**: Notes from octaves 4-5 (up to 2 ledger lines above and below the staff)
- **Bass Clef**: Notes from octaves 2-3 (up to 2 ledger lines above and below the staff)

This range covers the most commonly used notes while learning to read music, without overwhelming beginners with extreme ledger lines.

## Future Development

- Flashcard builder interface for users to create their own cards
- Additional flashcard modules for:
  - Multiplication tables
  - Vocabulary
  - Color theory
  - And more!
- Option to expand note range for advanced users

## Getting Started

### Prerequisites

- .NET SDK 8.0 or later for the backend
- Node.js 18+ and npm for the frontend

### Installation

1. Clone the repository

2. Set up the backend:
   ```
   cd GrandStaffFlashCards/Backend/FlashCardsApi
   dotnet build
   ```

3. Set up the frontend:
   ```
   cd GrandStaffFlashCards/Frontend
   npm install
   ```

### Running the Application

#### Using Batch Files (Recommended for Windows)

1. Start the backend by double-clicking on:
   ```
   GrandStaffFlashCards/Backend/FlashCardsApi/run-backend.bat
   ```

2. Start the frontend by double-clicking on:
   ```
   GrandStaffFlashCards/Frontend/run-frontend.bat
   ```

#### Using Command Line

1. Start the backend:
   ```
   cd GrandStaffFlashCards/Backend/FlashCardsApi
   dotnet run
   ```
   The API will be available at http://localhost:5211

2. Start the frontend:
   ```
   cd GrandStaffFlashCards/Frontend
   npm run dev
   ```
   The frontend will be available at http://localhost:8080

3. Open your browser and navigate to http://localhost:8080

## Troubleshooting

If you encounter issues with the frontend build, check the following:

1. **Directory Structure**: Ensure all required directories exist (assets, components, stores, views, router).
2. **ESLint Configuration**: The `.eslintrc.cjs` file should be properly configured for Vue 3.
3. **CSS Imports**: Bootstrap is imported in `src/assets/main.css` and should not be duplicated in `App.vue`.
4. **Store Migration**: The application uses Pinia for state management. The store is located in `src/stores/flashCardStore.js`.
5. **Vue 3 Naming Conventions**: Component files follow the Vue 3 naming convention (e.g., HomeView.vue instead of Home.vue).

## License

This project is licensed under the MIT License. 