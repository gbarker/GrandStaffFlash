<template>
  <div class="decks">
    <h1 class="mb-4">Flash Card Decks</h1>
    
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading decks...</p>
    </div>
    
    <div v-else-if="hasError" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    
    <div v-else>
      <div class="row">
        <div class="col-md-4 mb-4" v-for="deck in decks" :key="deck.id">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ deck.name }}</h5>
              <p class="card-text">{{ deck.description }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-info">{{ deck.cardCount || 0 }} cards</span>
                <router-link :to="'/practice'" class="btn btn-primary">Practice</router-link>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Future Development: Card Builder -->
        <div class="col-md-4 mb-4">
          <div class="card h-100 border-dashed">
            <div class="card-body text-center">
              <h5 class="card-title text-muted">Create Your Own Deck</h5>
              <p class="card-text text-muted">Coming soon! Build custom flash card decks for any subject.</p>
              <button class="btn btn-outline-secondary" disabled>Coming Soon</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-5">
        <h2>Future Development</h2>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Flashcard Builder Interface</h5>
            <p class="card-text">
              In future updates, you'll be able to create your own custom flash cards for:
            </p>
            <ul>
              <li>Music theory concepts</li>
              <li>Multiplication tables</li>
              <li>Vocabulary</li>
              <li>Color theory</li>
              <li>And more!</li>
            </ul>
            <p>
              The application is designed with a generic flashcard module that can be extended
              for various learning purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFlashCardStore } from '../stores/flashCardStore'

const store = useFlashCardStore()

// Computed properties
const decks = computed(() => store.decks)
const isLoading = computed(() => store.isLoading)
const hasError = computed(() => store.error !== null)
const errorMessage = computed(() => store.error)

// Lifecycle hooks
onMounted(() => {
  store.fetchDecks()
})
</script>

<style scoped>
.border-dashed {
  border-style: dashed;
  border-width: 2px;
  background-color: #f8f9fa;
}
</style> 