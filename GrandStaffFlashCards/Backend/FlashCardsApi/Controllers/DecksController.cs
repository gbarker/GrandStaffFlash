using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using FlashCardsApi.Models;
using FlashCardsApi.Services;

namespace FlashCardsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DecksController : ControllerBase
    {
        private readonly FlashCardService _flashCardService;

        public DecksController(FlashCardService flashCardService)
        {
            _flashCardService = flashCardService;
        }

        // GET: api/decks
        [HttpGet]
        public ActionResult<IEnumerable<FlashCardDeck>> GetDecks()
        {
            return Ok(_flashCardService.GetAllDecks());
        }

        // GET: api/decks/{id}
        [HttpGet("{id}")]
        public ActionResult<FlashCardDeck> GetDeck(Guid id)
        {
            var deck = _flashCardService.GetDeck(id);
            if (deck == null)
            {
                return NotFound();
            }
            return Ok(deck);
        }

        // POST: api/decks
        [HttpPost]
        public ActionResult<FlashCardDeck> CreateDeck([FromBody] DeckCreateModel model)
        {
            if (string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.Description))
            {
                return BadRequest("Name and Description are required");
            }

            var deck = _flashCardService.CreateDeck(model.Name, model.Description);
            return CreatedAtAction(nameof(GetDeck), new { id = deck.Id }, deck);
        }

        // DELETE: api/decks/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteDeck(Guid id)
        {
            var result = _flashCardService.DeleteDeck(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        // GET: api/decks/{deckId}/cards/random
        [HttpGet("{deckId}/cards/random")]
        public ActionResult<FlashCard> GetRandomCard(Guid deckId)
        {
            var card = _flashCardService.GetRandomCard(deckId);
            if (card == null)
            {
                return NotFound();
            }
            return Ok(card);
        }
    }

    public class DeckCreateModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
} 