<template>
  <div class="home">
    <div class="jumbotron bg-light p-5 rounded">
      <h1 class="display-4">Grand Staff Flash Cards</h1>
      <p class="lead">Improve your ability to recognize notes on the grand staff instantly!</p>
      <hr class="my-4">
      <p>This application helps piano players learn to identify notes on the grand staff through interactive flash cards.</p>
      <router-link to="/practice" class="btn btn-primary btn-lg">Start Practicing</router-link>
    </div>
    
    <div class="row mt-5">
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Learn the Grand Staff</h5>
            <p class="card-text">Practice identifying notes on the grand staff with key signatures and time signatures.</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Track Your Progress</h5>
            <p class="card-text">The app tracks your performance and focuses on notes you find challenging.</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Multiple Choice</h5>
            <p class="card-text">Choose from A-G and toggle between sharp, flat, and natural accidentals.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mt-3">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">How It Works</h5>
            <p class="card-text">
              1. You'll be shown a note on the grand staff<br>
              2. Select the correct letter (A-G) and accidental (natural, sharp, or flat)<br>
              3. If you answer incorrectly, the card will reappear within 3-8 cards<br>
              4. Keep practicing to improve your recognition speed
            </p>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Features</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Notes with key signatures and time signatures</li>
              <li class="list-group-item">Multiple choice interface</li>
              <li class="list-group-item">Spaced repetition for wrong answers</li>
              <li class="list-group-item">Progress tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Using the new script setup syntax for Vue 3 Composition API
</script> 