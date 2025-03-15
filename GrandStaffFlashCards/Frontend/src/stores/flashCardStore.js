import { defineStore } from 'pinia'
import axios from 'axios'

// For development, we'll use mock data
// In a real application, this would be replaced with API calls
const API_URL = 'http://localhost:5000/api'

// Helper function to generate mock cards
function generateMockCards(count = 20) {
  const cards = []
  const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const accidentals = ['', '#', 'b']
  const keySignatures = ['C Major', 'G Major', 'F Major']
  const timeSignatures = ['4/4', '3/4', '6/8']
  
  // Create a set to track unique note combinations
  const uniqueNotes = new Set()
  
  // Define valid note ranges for each staff
  const trebleNotes = [
    // Format: [letter, octave]
    ['E', 4], ['F', 4], ['G', 4], ['A', 4], ['B', 4], 
    ['C', 5], ['D', 5], ['E', 5], ['F', 5], ['G', 5]
  ];
  
  const bassNotes = [
    // Format: [letter, octave]
    ['G', 2], ['A', 2], ['B', 2], 
    ['C', 3], ['D', 3], ['E', 3], ['F', 3], ['G', 3], ['A', 3]
  ];
  
  // Invalid note combinations (these don't exist in standard music notation)
  const invalidNotes = [
    'E#', 'B#',  // E-sharp and B-sharp are the same as F and C
    'Cb', 'Fb'   // C-flat and F-flat are the same as B and E
  ];
  
  // Create a fixed set of cards for debugging
  const fixedCards = [
    { letter: 'D', accidental: '#', octave: 5, keySignature: 'C Major' }, // Card ID 1 - D#5
    { letter: 'E', accidental: '', octave: 4, keySignature: 'C Major' },  // Card ID 2 - E4
    { letter: 'G', accidental: '#', octave: 4, keySignature: 'C Major' }, // Card ID 3 - G#4
    { letter: 'B', accidental: 'b', octave: 4, keySignature: 'C Major' }, // Card ID 4 - Bb4
    { letter: 'C', accidental: '', octave: 5, keySignature: 'C Major' },  // Card ID 5 - C5
    { letter: 'F', accidental: '#', octave: 3, keySignature: 'C Major' }, // Card ID 6 - F#3
    { letter: 'A', accidental: 'b', octave: 3, keySignature: 'C Major' }, // Card ID 7 - Ab3
    { letter: 'D', accidental: '', octave: 3, keySignature: 'C Major' },  // Card ID 8 - D3
    { letter: 'G', accidental: '', octave: 2, keySignature: 'C Major' },  // Card ID 9 - G2
    { letter: 'B', accidental: '', octave: 2, keySignature: 'F Major' },  // Card ID 10 - B♭2 in F Major (implied by key signature)
    { letter: 'B', accidental: 'natural', octave: 4, keySignature: 'F Major' }, // Card ID 11 - B♮4 in F Major (explicitly natural)
    { letter: 'F', accidental: 'natural', octave: 4, keySignature: 'G Major' }  // Card ID 12 - F♮4 in G Major (explicitly natural)
  ];
  
  // Use fixed cards for the first 10 cards (for debugging)
  for (let i = 0; i < Math.min(10, count); i++) {
    const { letter, accidental, octave, keySignature } = fixedCards[i];
    
    cards.push({
      id: i + 1,
      note: {
        letter,
        accidental,
        octave,
        keySignature,
        timeSignature: timeSignatures[Math.floor(Math.random() * timeSignatures.length)]
      }
    });
    
    // Add to unique notes set
    uniqueNotes.add(`${letter}${accidental}${octave}`);
  }
  
  // Generate remaining random cards
  for (let i = 10; i < count; i++) {
    // Generate a unique note combination
    let letter, accidental, octave, noteId, keySignature
    let isUnique = false
    let isValid = false
    
    // Keep trying until we get a unique and valid combination
    while (!isUnique || !isValid) {
      // Decide whether to use treble or bass clef
      const useTrebleClef = Math.random() < 0.5;
      
      // Select a note from the appropriate range
      const noteRange = useTrebleClef ? trebleNotes : bassNotes;
      const [selectedLetter, selectedOctave] = noteRange[Math.floor(Math.random() * noteRange.length)];
      
      letter = selectedLetter;
      octave = selectedOctave;
      
      // Select a key signature first
      keySignature = keySignatures[Math.floor(Math.random() * keySignatures.length)];
      
      // Select an accidental, but consider the key signature
      accidental = accidentals[Math.floor(Math.random() * accidentals.length)];
      
      // Handle special cases for key signatures
      // In F Major, B is flat by default
      if (keySignature === 'F Major' && letter === 'B') {
        // If we randomly selected a flat, use empty string since it's implied by the key signature
        if (accidental === 'b') {
          accidental = '';
        }
        // If we randomly selected no accidental, it should be interpreted as B-flat
        // but we'll store it as empty string and handle the interpretation in the answer checking
      }
      
      // In G Major, F is sharp by default
      if (keySignature === 'G Major' && letter === 'F') {
        // If we randomly selected a sharp, use empty string since it's implied by the key signature
        if (accidental === '#') {
          accidental = '';
        }
        // If we randomly selected no accidental, it should be interpreted as F-sharp
        // but we'll store it as empty string and handle the interpretation in the answer checking
      }
      
      // Check if this is a valid note combination
      isValid = !invalidNotes.includes(letter + accidental);
      
      // Create a unique identifier for this note
      noteId = `${letter}${accidental}${octave}`;
      
      // Check if we already have this note
      isUnique = !uniqueNotes.has(noteId);
      
      // If we've tried all possible combinations, break to avoid infinite loop
      if (uniqueNotes.size >= notes.length * accidentals.length * 4) {
        isUnique = true;
        isValid = true;
      }
    }
    
    // Add to unique notes set
    uniqueNotes.add(noteId);
    
    cards.push({
      id: i + 1,
      note: {
        letter,
        accidental,
        octave,
        keySignature,
        timeSignature: timeSignatures[Math.floor(Math.random() * timeSignatures.length)]
      }
    });
  }
  
  // Shuffle the cards to ensure random order (except during debugging)
  // return shuffleArray(cards);
  return cards; // Return in fixed order for debugging
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const useFlashCardStore = defineStore('flashCard', {
  state: () => ({
    decks: [],
    currentDeck: null,
    currentCard: null,
    cardHistory: [],
    recentlyShownCards: [], // Track recently shown cards to avoid repetition
    maxRecentCards: 10, // Increased to ensure more variety
    isLoading: false,
    error: null,
    lastCardId: null // Track the last card ID to ensure we don't show the same card twice
  }),
  
  getters: {
    allDecks: (state) => state.decks,
    hasError: (state) => !!state.error
  },
  
  actions: {
    async fetchDecks() {
      this.isLoading = true
      this.error = null
      
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/decks')
        // this.decks = response.data
        
        // For now, we'll use mock data
        setTimeout(() => {
          this.decks = [
            { id: 1, name: 'Basic Notes', description: 'Learn the basic notes on the grand staff', cardCount: 20 },
            { id: 2, name: 'Advanced Notes', description: 'More challenging notes with accidentals', cardCount: 30 }
          ]
          this.isLoading = false
        }, 500)
      } catch (error) {
        console.error('Error fetching decks:', error)
        this.error = 'Failed to fetch decks. Please try again.'
        this.isLoading = false
      }
    },
    
    async fetchDeck(deckId) {
      this.isLoading = true
      this.error = null
      this.currentDeck = null
      this.currentCard = null
      this.cardHistory = []
      this.recentlyShownCards = [] // Reset recently shown cards
      this.lastCardId = null
      
      try {
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/decks/${deckId}`)
        // this.currentDeck = response.data
        
        // For now, we'll use mock data
        setTimeout(() => {
          this.currentDeck = {
            id: deckId,
            name: deckId === 1 ? 'Basic Notes' : 'Advanced Notes',
            description: deckId === 1 
              ? 'Learn the basic notes on the grand staff' 
              : 'More challenging notes with accidentals',
            cards: generateMockCards(deckId === 1 ? 20 : 30)
          }
          this.getNextCard()
          this.isLoading = false
        }, 500)
      } catch (error) {
        console.error(`Error fetching deck ${deckId}:`, error)
        this.error = 'Failed to fetch deck. Please try again.'
        this.isLoading = false
      }
    },
    
    getNextCard() {
      if (!this.currentDeck || !this.currentDeck.cards || this.currentDeck.cards.length === 0) {
        this.error = 'No cards available in this deck.'
        return
      }
      
      // For debugging, get a specific card by ID
      // Uncomment this to test a specific card
      /*
      const debugCardId = 10; // Change this to test different cards
      const debugCard = this.currentDeck.cards.find(card => card.id === debugCardId);
      if (debugCard) {
        this.currentCard = JSON.parse(JSON.stringify(debugCard));
        console.log('Debug card selected:', 
          `ID: ${this.currentCard.id}`,
          `Note: ${this.currentCard.note.letter}${this.currentCard.note.accidental || '♮'}${this.currentCard.note.octave}`,
          `Staff: ${this.currentCard.note.octave >= 4 ? 'Treble' : 'Bass'}`
        );
        return this.currentCard;
      }
      */
      
      // Filter out recently shown cards to avoid repetition
      let availableCards = this.currentDeck.cards.filter(
        card => !this.recentlyShownCards.includes(card.id)
      )
      
      // Also filter out the current card to ensure we don't show it again
      if (this.lastCardId !== null) {
        availableCards = availableCards.filter(card => card.id !== this.lastCardId)
      }
      
      // If we've filtered out all cards, reset the recently shown list but still avoid the current card
      let cardsToChooseFrom = availableCards.length > 0 ? availableCards : this.currentDeck.cards
      if (this.lastCardId !== null && cardsToChooseFrom.length > 1) {
        cardsToChooseFrom = cardsToChooseFrom.filter(card => card.id !== this.lastCardId)
      }
      
      // Get a random card from the available cards
      const randomIndex = Math.floor(Math.random() * cardsToChooseFrom.length)
      const newCard = cardsToChooseFrom[randomIndex]
      
      // If we have a current card, add it to history before changing
      if (this.currentCard) {
        this.cardHistory.push(this.currentCard)
        
        // Add to recently shown cards
        this.recentlyShownCards.push(this.currentCard.id)
        // Keep only the most recent cards
        if (this.recentlyShownCards.length > this.maxRecentCards) {
          this.recentlyShownCards.shift() // Remove oldest card
        }
      }
      
      // Update the last card ID
      this.lastCardId = newCard.id
      
      // Set the new current card - create a new object to ensure reactivity
      this.currentCard = JSON.parse(JSON.stringify(newCard))
      
      console.log('New card selected:', 
        `ID: ${this.currentCard.id}`,
        `Note: ${this.currentCard.note.letter}${this.currentCard.note.accidental || '♮'}${this.currentCard.note.octave}`,
        `Staff: ${this.currentCard.note.octave >= 4 ? 'Treble' : 'Bass'}`
      )
      
      return this.currentCard
    },
    
    submitAnswer(answer) {
      if (!this.currentCard) return false
      
      // Get the current note and key signature
      const { letter, accidental, keySignature } = this.currentCard.note
      
      // Determine the effective accidental based on key signature
      let effectiveAccidental = accidental
      
      // Handle explicit natural accidental
      if (accidental === 'natural') {
        effectiveAccidental = ''
      }
      
      // IMPORTANT: If the note has an explicit natural sign, it overrides the key signature
      const hasExplicitNatural = 
        accidental === 'natural' || 
        (accidental === '' && (
          (keySignature === 'F Major' && letter === 'B') || 
          (keySignature === 'G Major' && letter === 'F')
        ));
      
      // In F Major, B is flat by default, UNLESS there's an explicit natural
      if (keySignature === 'F Major' && letter === 'B') {
        // Only apply the default flat if there's no explicit natural
        if (!hasExplicitNatural) {
          effectiveAccidental = 'b'
        } else {
          // If there's an explicit natural, it should be natural (empty string)
          effectiveAccidental = ''
        }
      }
      
      // In G Major, F is sharp by default, UNLESS there's an explicit natural
      if (keySignature === 'G Major' && letter === 'F') {
        // Only apply the default sharp if there's no explicit natural
        if (!hasExplicitNatural) {
          effectiveAccidental = '#'
        } else {
          // If there's an explicit natural, it should be natural (empty string)
          effectiveAccidental = ''
        }
      }
      
      // Log the comparison for debugging
      console.log('Store comparing answers:', 
        `User: ${answer.letter}${answer.accidental || '♮'}`, 
        `Card: ${letter}${accidental || '♮'}`,
        `Effective: ${letter}${effectiveAccidental || '♮'}`,
        `Key: ${keySignature}`,
        `Has Explicit Natural: ${hasExplicitNatural}`
      )
      
      const isCorrect = 
        answer.letter === letter && 
        answer.accidental === effectiveAccidental
      
      // In a real app, you might want to save this result to track progress
      
      // If the answer was incorrect, we should add this card back into rotation
      // to appear again soon (as per the user story)
      if (!isCorrect) {
        // Remove from recently shown to ensure it appears again soon
        const index = this.recentlyShownCards.indexOf(this.currentCard.id)
        if (index !== -1) {
          this.recentlyShownCards.splice(index, 1)
        }
      }
      
      return isCorrect
    },
    
    clearCardHistory() {
      this.cardHistory = []
      this.recentlyShownCards = []
      this.lastCardId = null
    }
  }
}) 