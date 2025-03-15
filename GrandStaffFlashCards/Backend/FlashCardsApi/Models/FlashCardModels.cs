using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FlashCardsApi.Models
{
    // Generic Flashcard module
    public class FlashCard
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Question { get; set; }
        public string Answer { get; set; }
        public int CorrectCount { get; set; } = 0;
        public int IncorrectCount { get; set; } = 0;
        public DateTime LastReviewed { get; set; }
    }

    public class FlashCardDeck
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Description { get; set; }
        public List<FlashCard> Cards { get; set; } = new List<FlashCard>();
        
        // Method to add a card to the deck
        public void AddCard(FlashCard card)
        {
            Cards.Add(card);
        }
        
        // Method to remove a card from the deck
        public bool RemoveCard(Guid cardId)
        {
            var card = Cards.FirstOrDefault(c => c.Id == cardId);
            if (card != null)
            {
                return Cards.Remove(card);
            }
            return false;
        }
        
        // Method to get a random card
        public FlashCard GetRandomCard()
        {
            if (Cards.Count == 0)
                return null;
                
            Random random = new Random();
            int index = random.Next(Cards.Count);
            return Cards[index];
        }
        
        // Method to handle wrong answers by scheduling the card to reappear soon
        public void HandleWrongAnswer(Guid cardId)
        {
            var card = Cards.FirstOrDefault(c => c.Id == cardId);
            if (card != null)
            {
                card.IncorrectCount++;
                card.LastReviewed = DateTime.Now;
                
                // Move the card to a position 3-8 cards ahead
                Random random = new Random();
                int position = random.Next(3, 9);
                
                if (position < Cards.Count)
                {
                    Cards.Remove(card);
                    Cards.Insert(position, card);
                }
            }
        }
        
        // Method to handle correct answers
        public void HandleCorrectAnswer(Guid cardId)
        {
            var card = Cards.FirstOrDefault(c => c.Id == cardId);
            if (card != null)
            {
                card.CorrectCount++;
                card.LastReviewed = DateTime.Now;
            }
        }
    }

    // Grand Staff specific module
    public enum NoteAccidental
    {
        Natural,
        Sharp,
        Flat
    }

    public class GrandStaffNote
    {
        public char NoteLetter { get; set; } // A-G
        public NoteAccidental Accidental { get; set; }
        public int Octave { get; set; }
        public string KeySignature { get; set; }
        public string TimeSignature { get; set; }
        
        public override string ToString()
        {
            string accidental = Accidental == NoteAccidental.Natural ? "" :
                               Accidental == NoteAccidental.Sharp ? "#" : "b";
            return $"{NoteLetter}{accidental} (Octave {Octave})";
        }
    }

    public class GrandStaffFlashCard : FlashCard
    {
        [JsonIgnore]
        public GrandStaffNote Note { get; set; }
        
        public GrandStaffFlashCard(GrandStaffNote note)
        {
            Note = note;
            Question = JsonSerializer.Serialize(note);
            Answer = note.NoteLetter.ToString() + GetAccidentalString(note.Accidental);
        }
        
        private string GetAccidentalString(NoteAccidental accidental)
        {
            return accidental == NoteAccidental.Natural ? "" :
                   accidental == NoteAccidental.Sharp ? "#" : "b";
        }
    }

    public class GrandStaffFlashCardDeck : FlashCardDeck
    {
        public GrandStaffFlashCardDeck()
        {
            Name = "Grand Staff Notes";
            Description = "Learn to identify notes on the grand staff";
            GenerateDefaultCards();
        }
        
        private void GenerateDefaultCards()
        {
            // Generate cards for all notes A-G with different accidentals
            char[] notes = { 'A', 'B', 'C', 'D', 'E', 'F', 'G' };
            NoteAccidental[] accidentals = { NoteAccidental.Natural, NoteAccidental.Sharp, NoteAccidental.Flat };
            string[] keySignatures = { "C Major", "G Major", "F Major" };
            string[] timeSignatures = { "4/4", "3/4", "6/8" };
            
            Random random = new Random();
            
            // Generate a set of cards with various combinations
            for (int octave = 3; octave <= 5; octave++)
            {
                foreach (char note in notes)
                {
                    foreach (NoteAccidental accidental in accidentals)
                    {
                        // Skip invalid combinations like B# and Cb
                        if ((note == 'B' && accidental == NoteAccidental.Sharp) ||
                            (note == 'C' && accidental == NoteAccidental.Flat) ||
                            (note == 'E' && accidental == NoteAccidental.Sharp) ||
                            (note == 'F' && accidental == NoteAccidental.Flat))
                        {
                            continue;
                        }
                        
                        string keySignature = keySignatures[random.Next(keySignatures.Length)];
                        string timeSignature = timeSignatures[random.Next(timeSignatures.Length)];
                        
                        var noteObj = new GrandStaffNote
                        {
                            NoteLetter = note,
                            Accidental = accidental,
                            Octave = octave,
                            KeySignature = keySignature,
                            TimeSignature = timeSignature
                        };
                        
                        AddCard(new GrandStaffFlashCard(noteObj));
                    }
                }
            }
        }
    }
} 