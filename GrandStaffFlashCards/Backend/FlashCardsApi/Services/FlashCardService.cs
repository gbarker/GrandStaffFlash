using System;
using System.Collections.Generic;
using System.Linq;
using FlashCardsApi.Models;

namespace FlashCardsApi.Services
{
    public class FlashCardService
    {
        private Dictionary<Guid, FlashCardDeck> Decks { get; set; } = new Dictionary<Guid, FlashCardDeck>();
        
        public FlashCardService()
        {
            // Initialize with a Grand Staff deck
            var grandStaffDeck = new GrandStaffFlashCardDeck();
            Decks.Add(grandStaffDeck.Id, grandStaffDeck);
        }
        
        // Get all decks
        public List<FlashCardDeck> GetAllDecks()
        {
            return Decks.Values.ToList();
        }
        
        // Get a specific deck
        public FlashCardDeck GetDeck(Guid deckId)
        {
            if (Decks.TryGetValue(deckId, out var deck))
            {
                return deck;
            }
            return null;
        }
        
        // Create a new deck
        public FlashCardDeck CreateDeck(string name, string description)
        {
            var deck = new FlashCardDeck
            {
                Name = name,
                Description = description
            };
            
            Decks.Add(deck.Id, deck);
            return deck;
        }
        
        // Delete a deck
        public bool DeleteDeck(Guid deckId)
        {
            return Decks.Remove(deckId);
        }
        
        // Add a card to a deck
        public FlashCard AddCardToDeck(Guid deckId, FlashCard card)
        {
            if (Decks.TryGetValue(deckId, out var deck))
            {
                deck.AddCard(card);
                return card;
            }
            return null;
        }
        
        // Remove a card from a deck
        public bool RemoveCardFromDeck(Guid deckId, Guid cardId)
        {
            if (Decks.TryGetValue(deckId, out var deck))
            {
                return deck.RemoveCard(cardId);
            }
            return false;
        }
        
        // Get a random card from a deck
        public FlashCard GetRandomCard(Guid deckId)
        {
            if (Decks.TryGetValue(deckId, out var deck))
            {
                return deck.GetRandomCard();
            }
            return null;
        }
        
        // Handle a correct answer
        public void HandleCorrectAnswer(Guid deckId, Guid cardId)
        {
            if (Decks.TryGetValue(deckId, out var deck))
            {
                deck.HandleCorrectAnswer(cardId);
            }
        }
        
        // Handle a wrong answer
        public void HandleWrongAnswer(Guid deckId, Guid cardId)
        {
            if (Decks.TryGetValue(deckId, out var deck))
            {
                deck.HandleWrongAnswer(cardId);
            }
        }
    }
} 