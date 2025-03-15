<template>
  <div class="practice">
    <h1 class="mb-4">Practice Grand Staff Notes</h1>
    
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading flash cards...</p>
    </div>
    
    <div v-else-if="hasError" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    
    <div v-else-if="!currentCard" class="text-center my-5">
      <p>No cards available. Please try again later.</p>
      <button @click="startPractice" class="btn btn-primary">Retry</button>
    </div>
    
    <div v-else class="card-container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <!-- Debug info at the top -->
          <div v-if="showDebug" class="alert alert-info mb-3">
            <h5>Debug Information:</h5>
            <div><strong>Card ID:</strong> {{ currentCard.id }}</div>
            <div><strong>Note:</strong> {{ currentCard.note.letter }}{{ currentCard.note.accidental || '♮' }}{{ currentCard.note.octave }}</div>
            <div><strong>Key Signature:</strong> {{ currentCard.note.keySignature }}</div>
            <div><strong>Time Signature:</strong> {{ currentCard.note.timeSignature }}</div>
            <div><strong>Component Key:</strong> {{ cardKey }}</div>
          </div>
          
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span>Grand Staff Note</span>
              <div>
                <span class="badge bg-primary me-2">Key: {{ currentCard.note.keySignature }}</span>
                <span class="badge bg-secondary">Time: {{ currentCard.note.timeSignature }}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="grand-staff-display">
                <!-- Use the GrandStaff component with a key to force re-render -->
                <GrandStaff 
                  :note="currentCard.note" 
                  :key="currentCard.id + '-' + currentCard.note.letter + currentCard.note.octave + currentCard.note.accidental"
                  :card-id="currentCard.id"
                />
                
                <div class="answer-section">
                  <h5 class="mb-3">Select the correct note:</h5>
                  
                  <div class="note-buttons mb-4">
                    <div class="btn-group w-100" role="group" aria-label="Note letters">
                      <button 
                        v-for="letter in noteLetters" 
                        :key="letter"
                        type="button" 
                        class="btn btn-outline-primary"
                        :class="{ active: selectedLetter === letter }"
                        @click="selectLetter(letter)">
                        {{ letter }}
                      </button>
                    </div>
                  </div>
                  
                  <div class="accidental-buttons mb-4">
                    <div class="btn-group w-100" role="group" aria-label="Accidentals">
                      <button 
                        type="button" 
                        class="btn btn-outline-secondary"
                        :class="{ active: selectedAccidental === '' }"
                        @click="selectAccidental('')">
                        Natural (♮)
                      </button>
                      <button 
                        type="button" 
                        class="btn btn-outline-secondary"
                        :class="{ active: selectedAccidental === '#' }"
                        @click="selectAccidental('#')">
                        Sharp (♯)
                      </button>
                      <button 
                        type="button" 
                        class="btn btn-outline-secondary"
                        :class="{ active: selectedAccidental === 'b' }"
                        @click="selectAccidental('b')">
                        Flat (♭)
                      </button>
                    </div>
                  </div>
                  
                  <div class="submit-answer">
                    <button 
                      @click="submitAnswer" 
                      class="btn btn-success btn-lg w-100"
                      :disabled="!isAnswerSelected">
                      Submit Answer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="lastAnswerResult !== null" class="alert" :class="lastAnswerResult ? 'alert-success' : 'alert-danger'">
            <strong>{{ lastAnswerResult ? 'Correct!' : 'Incorrect!' }}</strong>
            <span v-if="!lastAnswerResult">
              The correct answer was {{ lastCorrectAnswer }}.
            </span>
          </div>
          
          <div class="progress-stats d-flex justify-content-between">
            <div>
              <strong>Cards Viewed:</strong> {{ cardHistory.length }}
            </div>
            <div>
              <strong>Correct:</strong> {{ correctAnswers }}
            </div>
            <div>
              <strong>Incorrect:</strong> {{ incorrectAnswers }}
            </div>
            <div>
              <strong>Accuracy:</strong> {{ accuracy }}%
            </div>
          </div>
          
          <div class="mt-4">
            <button @click="getNextCard" class="btn btn-primary btn-lg w-100">
              Next Card
            </button>
          </div>
          
          <!-- Toggle debug info button -->
          <div class="mt-3 text-center">
            <button @click="toggleDebug" class="btn btn-sm btn-outline-secondary">
              {{ showDebug ? 'Hide' : 'Show' }} Debug Info
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useFlashCardStore } from '../stores/flashCardStore'
import GrandStaff from '../components/GrandStaff.vue'

const store = useFlashCardStore()

// Local state
const noteLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const selectedLetter = ref(null)
const selectedAccidental = ref(null)
const lastAnswerResult = ref(null)
const lastCorrectAnswer = ref('')
const correctAnswers = ref(0)
const incorrectAnswers = ref(0)
const showDebug = ref(true) // Enable debug by default to help troubleshoot

// Computed properties
const currentCard = computed(() => store.currentCard)
const cardHistory = computed(() => store.cardHistory)
const isLoading = computed(() => store.isLoading)
const hasError = computed(() => store.hasError)
const errorMessage = computed(() => store.error)
const isAnswerSelected = computed(() => selectedLetter.value !== null && selectedAccidental.value !== null)
const accuracy = computed(() => {
  const total = correctAnswers.value + incorrectAnswers.value
  if (total === 0) return 0
  return Math.round((correctAnswers.value / total) * 100)
})

// Create a unique key for the GrandStaff component to force re-render
const cardKey = computed(() => {
  if (!currentCard.value) return 'no-card'
  const note = currentCard.value.note
  // Include a timestamp to ensure uniqueness even if the same card appears
  return `${currentCard.value.id}-${note.letter}${note.accidental}${note.octave}-${Date.now()}`
})

// Debug watcher to log when the current card changes
watch(() => store.currentCard, (newCard, oldCard) => {
  if (newCard) {
    console.log('Current card changed in PracticeView:', 
      `ID: ${newCard.id}`,
      `Letter: ${newCard.note.letter}`, 
      `Octave: ${newCard.note.octave}`, 
      `Accidental: ${newCard.note.accidental || 'natural'}`
    )
  }
}, { deep: true, immediate: true })

// Methods
async function startPractice() {
  await store.fetchDeck(1) // Fetch the Basic Notes deck
}

function selectLetter(letter) {
  selectedLetter.value = letter
}

function selectAccidental(accidental) {
  selectedAccidental.value = accidental
}

function getNextCard() {
  store.getNextCard()
  // Reset selection for next card
  selectedLetter.value = null
  selectedAccidental.value = null
  // Clear the result
  lastAnswerResult.value = null
}

function submitAnswer() {
  if (!isAnswerSelected.value) return
  
  const userAnswer = {
    letter: selectedLetter.value,
    accidental: selectedAccidental.value
  }
  
  // Get the correct answer for display, taking key signature into account
  let effectiveAccidental = currentCard.value.note.accidental
  
  // Handle explicit natural accidental
  if (effectiveAccidental === 'natural') {
    effectiveAccidental = ''
  }
  
  // IMPORTANT: If the note has an explicit natural sign, it overrides the key signature
  const hasExplicitNatural = 
    currentCard.value.note.accidental === 'natural' || 
    currentCard.value.note.accidental === '';
  
  // In F Major, B is flat by default, UNLESS there's an explicit natural
  if (currentCard.value.note.keySignature === 'F Major' && 
      currentCard.value.note.letter === 'B') {
    // Only apply the default flat if there's no explicit natural
    if (!hasExplicitNatural) {
      effectiveAccidental = 'b'
    } else {
      // If there's an explicit natural, it should be natural (empty string)
      effectiveAccidental = ''
    }
  }
  
  // In G Major, F is sharp by default, UNLESS there's an explicit natural
  if (currentCard.value.note.keySignature === 'G Major' && 
      currentCard.value.note.letter === 'F') {
    // Only apply the default sharp if there's no explicit natural
    if (!hasExplicitNatural) {
      effectiveAccidental = '#'
    } else {
      // If there's an explicit natural, it should be natural (empty string)
      effectiveAccidental = ''
    }
  }
  
  // Format the correct answer text
  const correctAnswerText = currentCard.value.note.letter + 
    (effectiveAccidental || '♮')
  
  // Log the comparison for debugging
  console.log('Answer comparison:', 
    `User: ${userAnswer.letter}${userAnswer.accidental || '♮'}`, 
    `Card: ${currentCard.value.note.letter}${currentCard.value.note.accidental || '♮'}`,
    `Effective: ${currentCard.value.note.letter}${effectiveAccidental || '♮'}`,
    `Key: ${currentCard.value.note.keySignature}`,
    `Has Explicit Natural: ${hasExplicitNatural}`
  )
  
  // Create a corrected answer object that matches what the store expects
  const correctedAnswer = {
    letter: currentCard.value.note.letter,
    accidental: effectiveAccidental
  }
  
  // Compare user answer with the corrected answer
  const isCorrect = 
    userAnswer.letter === correctedAnswer.letter && 
    userAnswer.accidental === correctedAnswer.accidental;
  
  // Update the store (but don't rely on its answer checking)
  store.submitAnswer(userAnswer)
  
  if (isCorrect) {
    correctAnswers.value++
    lastAnswerResult.value = true
  } else {
    incorrectAnswers.value++
    lastAnswerResult.value = false
    lastCorrectAnswer.value = correctAnswerText
  }
  
  // Don't automatically get next card, let user click the Next Card button
}

function toggleDebug() {
  showDebug.value = !showDebug.value
}

// Lifecycle hooks
onMounted(() => {
  startPractice()
})
</script>

<style scoped>
.card-container {
  max-width: 900px;
  margin: 0 auto;
}

.note-buttons .btn,
.accidental-buttons .btn {
  flex: 1;
  padding: 15px 0;
  font-size: 1.2rem;
}

.progress-stats {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.debug-info {
  margin-top: 10px;
  padding: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style> 