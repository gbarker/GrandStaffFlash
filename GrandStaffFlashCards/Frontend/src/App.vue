<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">Grand Staff Flash Cards</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/practice">Practice</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/decks">Decks</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <div class="container mt-4">
      <router-view/>
    </div>
    
    <footer class="footer mt-5 py-3 bg-light">
      <div class="container text-center">
        <span class="text-muted">Grand Staff Flash Cards &copy; {{ new Date().getFullYear() }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Using the new script setup syntax for Vue 3 Composition API
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
}

.footer {
  position: relative;
  bottom: 0;
  width: 100%;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}
</style> 