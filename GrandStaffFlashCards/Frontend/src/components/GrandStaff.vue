<template>
  <div class="grand-staff">
    <canvas ref="staffCanvas" width="600" height="300"></canvas>
    <!-- Debug info to verify note changes -->
    <div class="debug-info" v-if="showDebug">
      <div>Note: {{ props.note.letter }}{{ props.note.accidental || '♮' }}{{ props.note.octave }}</div>
      <div>Position: {{ notePosition }}</div>
      <div>Staff: {{ isOnTrebleStaff ? 'Treble' : 'Bass' }}</div>
      <div>Y-coordinate: {{ notePosition }}</div>
      <div>Card ID: {{ props.cardId }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'

const props = defineProps({
  note: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.letter && 
             typeof value.accidental !== 'undefined' && 
             typeof value.octave !== 'undefined' &&
             value.keySignature &&
             value.timeSignature;
    }
  },
  cardId: {
    type: Number,
    default: 0
  }
})

const staffCanvas = ref(null)
const ctx = ref(null)
const staffLineSpacing = 10
const staffX = 50
const staffWidth = 500
const trebleStaffY = 80
const bassStaffY = 200
const noteRadius = 8
const showDebug = ref(true) // Enable debug by default to help troubleshoot

// Define the range of notes (restricted to 2 ledger lines)
const MIN_TREBLE_NOTE_Y = trebleStaffY - 2 * staffLineSpacing // 2 ledger lines above treble staff
const MAX_TREBLE_NOTE_Y = trebleStaffY + 5 * staffLineSpacing + 2 * staffLineSpacing // 2 ledger lines below treble staff
const MIN_BASS_NOTE_Y = bassStaffY - 2 * staffLineSpacing // 2 ledger lines above bass staff
const MAX_BASS_NOTE_Y = bassStaffY + 5 * staffLineSpacing + 2 * staffLineSpacing // 2 ledger lines below bass staff

// Define standard positions for notes on the staff
// Each position is the Y-coordinate where the note should be drawn
const NOTE_POSITIONS = {
  // Treble clef notes (bottom to top)
  'C4': trebleStaffY + 5 * staffLineSpacing,     // Middle C - 1st ledger line below treble staff
  'D4': trebleStaffY + 4.5 * staffLineSpacing,   // Space below bottom line
  'E4': trebleStaffY + 4 * staffLineSpacing,     // Bottom line
  'F4': trebleStaffY + 3.5 * staffLineSpacing,   // Space above bottom line
  'G4': trebleStaffY + 3 * staffLineSpacing,     // 2nd line from bottom
  'A4': trebleStaffY + 2.5 * staffLineSpacing,   // Space above 2nd line
  'B4': trebleStaffY + 2 * staffLineSpacing,     // Middle line
  'C5': trebleStaffY + 1.5 * staffLineSpacing,   // Space above middle line
  'D5': trebleStaffY + 1 * staffLineSpacing,     // 4th line
  'E5': trebleStaffY + 0.5 * staffLineSpacing,   // Space above 4th line
  'F5': trebleStaffY + 0 * staffLineSpacing,     // Top line
  'G5': trebleStaffY - 0.5 * staffLineSpacing,   // Space above top line
  'A5': trebleStaffY - 1 * staffLineSpacing,     // 1st ledger line above
  'B5': trebleStaffY - 1.5 * staffLineSpacing,   // Space above 1st ledger line
  'C6': trebleStaffY - 2 * staffLineSpacing,     // 2nd ledger line above
  
  // Bass clef notes (bottom to top) - CORRECTED POSITIONS
  // The bass clef is positioned a third higher than the treble clef
  // G2 is on the bottom line of the bass staff
  'G2': bassStaffY + 4 * staffLineSpacing,       // Bottom line
  'A2': bassStaffY + 3.5 * staffLineSpacing,     // Space above bottom line
  'B2': bassStaffY + 3 * staffLineSpacing,       // 2nd line from bottom
  'C3': bassStaffY + 2.5 * staffLineSpacing,     // Space above 2nd line
  'D3': bassStaffY + 2 * staffLineSpacing,       // Middle line
  'E3': bassStaffY + 1.5 * staffLineSpacing,     // Space above middle line
  'F3': bassStaffY + 1 * staffLineSpacing,       // 4th line
  'G3': bassStaffY + 0.5 * staffLineSpacing,     // Space above 4th line
  'A3': bassStaffY + 0 * staffLineSpacing,       // Top line
  'B3': bassStaffY - 0.5 * staffLineSpacing,     // Space above top line
  'C4': bassStaffY - 1 * staffLineSpacing,       // 1st ledger line above
  'D4': bassStaffY - 1.5 * staffLineSpacing,     // Space above 1st ledger line
  'E4': bassStaffY - 2 * staffLineSpacing,       // 2nd ledger line above
  'F4': bassStaffY - 2.5 * staffLineSpacing,     // Space above 2nd ledger line
  'G4': bassStaffY - 3 * staffLineSpacing,       // 3rd ledger line above (if needed)
  
  // Ledger lines below bass staff
  'F2': bassStaffY + 4.5 * staffLineSpacing,     // Space below bottom line
  'E2': bassStaffY + 5 * staffLineSpacing,       // 1st ledger line below
  'D2': bassStaffY + 5.5 * staffLineSpacing,     // Space below 1st ledger line
  'C2': bassStaffY + 6 * staffLineSpacing,       // 2nd ledger line below
}

// Computed properties for debugging
const notePosition = computed(() => {
  return getNotePosition(props.note.letter, props.note.octave);
});

const isOnTrebleStaff = computed(() => {
  return props.note.octave >= 4;
});

onMounted(() => {
  if (staffCanvas.value) {
    ctx.value = staffCanvas.value.getContext('2d')
    redraw()
  }
})

// Watch for changes to the note prop with immediate effect
watch(() => props.note, (newNote, oldNote) => {
  console.log('Note changed in GrandStaff component:', 
    `Letter: ${newNote.letter}`, 
    `Octave: ${newNote.octave}`, 
    `Accidental: ${newNote.accidental || 'natural'}`,
    `Card ID: ${props.cardId}`
  )
  
  // Use nextTick to ensure the DOM has updated
  nextTick(() => {
    redraw()
  })
}, { deep: true, immediate: true })

function redraw() {
  if (!ctx.value || !staffCanvas.value) return
  
  // Clear the entire canvas
  ctx.value.clearRect(0, 0, staffCanvas.value.width, staffCanvas.value.height)
  
  // Draw the staff and note
  drawGrandStaff()
  drawNote()
  
  // Log the note being drawn for debugging
  console.log('Drawing note:', 
    `${props.note.letter}${props.note.accidental || '♮'}${props.note.octave}`,
    'at position:', getNotePosition(props.note.letter, props.note.octave),
    'on staff:', isOnTrebleStaff.value ? 'Treble' : 'Bass',
    'Card ID:', props.cardId
  )
}

// Helper function to get the Y position for a note
function getNotePosition(letter, octave) {
  // Create a unique key for the note
  const noteKey = `${letter}${octave}`;
  
  // Look up the position in our predefined positions
  if (NOTE_POSITIONS[noteKey] !== undefined) {
    return NOTE_POSITIONS[noteKey];
  }
  
  // If the note is not in our predefined positions, calculate a fallback position
  // This should not happen with our restricted note range, but just in case
  console.warn(`Note position not found for ${noteKey}, using fallback calculation`);
  
  // Determine if the note should be on the treble or bass staff based on octave
  const isOnTrebleClef = octave >= 4;
  
  // Default to middle of the appropriate staff
  return isOnTrebleClef ? trebleStaffY + 2 * staffLineSpacing : bassStaffY + 2 * staffLineSpacing;
}

function drawGrandStaff() {
  if (!ctx.value) return
  
  // Draw staff lines
  ctx.value.lineWidth = 1
  ctx.value.strokeStyle = '#000'
  
  // Draw treble staff (5 lines)
  for (let i = 0; i < 5; i++) {
    const y = trebleStaffY + i * staffLineSpacing
    ctx.value.beginPath()
    ctx.value.moveTo(staffX, y)
    ctx.value.lineTo(staffX + staffWidth, y)
    ctx.value.stroke()
  }
  
  // Draw bass staff (5 lines)
  for (let i = 0; i < 5; i++) {
    const y = bassStaffY + i * staffLineSpacing
    ctx.value.beginPath()
    ctx.value.moveTo(staffX, y)
    ctx.value.lineTo(staffX + staffWidth, y)
    ctx.value.stroke()
  }
  
  // Draw treble clef (simplified)
  ctx.value.font = '60px serif'
  ctx.value.fillText('𝄞', staffX + 10, trebleStaffY + 40)
  
  // Draw bass clef (simplified)
  ctx.value.font = '40px serif'
  ctx.value.fillText('𝄢', staffX + 10, bassStaffY + 25)
  
  // Draw key signature
  drawKeySignature()
  
  // Draw time signature
  drawTimeSignature()
}

function drawKeySignature() {
  if (!ctx.value) return
  
  const keyX = staffX + 60
  
  ctx.value.font = '24px serif'
  ctx.value.fillStyle = '#000'
  
  if (props.note.keySignature === 'G Major') {
    // G Major has F# (1 sharp)
    
    // Draw F# on treble clef (F# is on the fifth line of the treble staff)
    // The F is on the top line (5th line) of the treble staff
    ctx.value.fillText('♯', keyX, trebleStaffY + 0 * staffLineSpacing + 6)
    
    // Draw F# on bass clef (F# is on the fourth line of the bass staff)
    // The F is on the 4th line of the bass staff
    ctx.value.fillText('♯', keyX, bassStaffY + 1 * staffLineSpacing + 6)
  } 
  else if (props.note.keySignature === 'F Major') {
    // F Major has Bb (1 flat)
    
    // Draw Bb on treble clef (Bb is on the third line of the treble staff)
    // The B is on the middle line of the treble staff
    ctx.value.fillText('♭', keyX, trebleStaffY + 2 * staffLineSpacing + 6)
    
    // Draw Bb on bass clef (Bb is on the second line from bottom of the bass staff)
    // The B is on the 2nd line from bottom of the bass staff
    ctx.value.fillText('♭', keyX, bassStaffY + 3 * staffLineSpacing + 6)
  }
  // C Major has no sharps or flats
}

function drawTimeSignature() {
  if (!ctx.value) return
  
  const timeX = staffX + 100
  
  ctx.value.font = '20px serif'
  ctx.value.fillStyle = '#000'
  
  const [numerator, denominator] = props.note.timeSignature.split('/')
  
  // Draw time signature on both staves
  ctx.value.fillText(numerator, timeX, trebleStaffY + 15)
  ctx.value.fillText(denominator, timeX, trebleStaffY + 35)
  
  ctx.value.fillText(numerator, timeX, bassStaffY + 15)
  ctx.value.fillText(denominator, timeX, bassStaffY + 35)
}

function drawNote() {
  if (!ctx.value) return
  
  // Calculate note position based on letter and octave
  const noteX = staffX + 250
  
  // Get the Y position for the note
  let noteY = getNotePosition(props.note.letter, props.note.octave)
  
  // Draw the note
  ctx.value.beginPath()
  ctx.value.ellipse(noteX, noteY, noteRadius, noteRadius * 0.8, Math.PI / 4, 0, 2 * Math.PI)
  ctx.value.fill()
  
  // Draw stem
  ctx.value.beginPath()
  ctx.value.moveTo(noteX + noteRadius, noteY)
  ctx.value.lineTo(noteX + noteRadius, noteY - 30)
  ctx.value.stroke()
  
  // Determine if we need to show an accidental
  let shouldShowAccidental = true;
  
  // Check if the accidental is already implied by the key signature
  if (props.note.keySignature === 'F Major' && props.note.letter === 'B' && props.note.accidental === 'b') {
    // In F Major, B is flat by default, so we don't need to show the flat symbol
    shouldShowAccidental = false;
  } else if (props.note.keySignature === 'G Major' && props.note.letter === 'F' && props.note.accidental === '#') {
    // In G Major, F is sharp by default, so we don't need to show the sharp symbol
    shouldShowAccidental = false;
  }
  
  // If the note has an explicit natural that cancels out a key signature accidental,
  // we need to show the natural sign
  const needsNaturalSign = 
    (props.note.keySignature === 'F Major' && props.note.letter === 'B' && props.note.accidental === '') ||
    (props.note.keySignature === 'G Major' && props.note.letter === 'F' && props.note.accidental === '') ||
    props.note.accidental === 'natural';
  
  // Draw accidental if needed
  if (shouldShowAccidental && props.note.accidental === '#') {
    ctx.value.font = '24px serif'
    // Position the sharp symbol to align with the note
    ctx.value.fillText('♯', noteX - 25, noteY + 8)
  } else if (shouldShowAccidental && props.note.accidental === 'b') {
    ctx.value.font = '24px serif'
    // Position the flat symbol to align with the note
    ctx.value.fillText('♭', noteX - 25, noteY + 5)
  } else if (needsNaturalSign || props.note.accidental === 'natural') {
    ctx.value.font = '24px serif'
    // Position the natural symbol to align with the note
    ctx.value.fillText('♮', noteX - 25, noteY + 5)
  }
  
  // Draw ledger lines if needed
  drawLedgerLines(noteX, noteY)
}

function drawLedgerLines(noteX, noteY) {
  if (!ctx.value) return
  
  ctx.value.lineWidth = 1
  ctx.value.strokeStyle = '#000'
  
  // Determine which staff the note belongs to based on Y position
  const isOnTrebleStaff = noteY < (trebleStaffY + bassStaffY) / 2
  
  if (isOnTrebleStaff) {
    // Ledger lines above treble staff (F5 is the top line)
    if (noteY < trebleStaffY) {
      // For notes above the staff, draw ALL ledger lines from the top of the staff up to the note
      for (let y = trebleStaffY - staffLineSpacing; y >= noteY; y -= staffLineSpacing) {
        // Only draw ledger lines at line positions (not spaces)
        if (Math.abs(y % staffLineSpacing) < 0.1) {
          ctx.value.beginPath()
          ctx.value.moveTo(noteX - 15, y)
          ctx.value.lineTo(noteX + 15, y)
          ctx.value.stroke()
        }
      }
    }
    
    // Ledger lines below treble staff (E4 is the bottom line)
    if (noteY > trebleStaffY + 4 * staffLineSpacing) {
      // For notes below the staff, draw ALL ledger lines from the bottom of the staff down to the note
      for (let y = trebleStaffY + 5 * staffLineSpacing; y <= noteY; y += staffLineSpacing) {
        // Only draw ledger lines at line positions (not spaces)
        if (Math.abs(y % staffLineSpacing) < 0.1) {
          ctx.value.beginPath()
          ctx.value.moveTo(noteX - 15, y)
          ctx.value.lineTo(noteX + 15, y)
          ctx.value.stroke()
        }
      }
    }
  } else {
    // Ledger lines above bass staff (A3 is the top line)
    if (noteY < bassStaffY) {
      // For notes above the staff, draw ALL ledger lines from the top of the staff up to the note
      for (let y = bassStaffY - staffLineSpacing; y >= noteY; y -= staffLineSpacing) {
        // Only draw ledger lines at line positions (not spaces)
        if (Math.abs(y % staffLineSpacing) < 0.1) {
          ctx.value.beginPath()
          ctx.value.moveTo(noteX - 15, y)
          ctx.value.lineTo(noteX + 15, y)
          ctx.value.stroke()
        }
      }
    }
    
    // Ledger lines below bass staff (G2 is the bottom line)
    if (noteY > bassStaffY + 4 * staffLineSpacing) {
      // For notes below the staff, draw ALL ledger lines from the bottom of the staff down to the note
      for (let y = bassStaffY + 5 * staffLineSpacing; y <= noteY; y += staffLineSpacing) {
        // Only draw ledger lines at line positions (not spaces)
        if (Math.abs(y % staffLineSpacing) < 0.1) {
          ctx.value.beginPath()
          ctx.value.moveTo(noteX - 15, y)
          ctx.value.lineTo(noteX + 15, y)
          ctx.value.stroke()
        }
      }
    }
  }
}
</script>

<style scoped>
.grand-staff {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

canvas {
  border: 1px solid #eee;
  background-color: white;
}

.debug-info {
  margin-top: 10px;
  padding: 5px;
  font-size: 12px;
  color: #666;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  text-align: center;
}
</style> 