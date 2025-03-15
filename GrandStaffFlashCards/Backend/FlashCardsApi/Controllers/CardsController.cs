using System;
using Microsoft.AspNetCore.Mvc;
using FlashCardsApi.Models;
using FlashCardsApi.Services;

namespace FlashCardsApi.Controllers
{
    [ApiController]
    [Route("api/decks/{deckId}/[controller]")]
    public class CardsController : ControllerBase
    {
        private readonly FlashCardService _flashCardService;

        public CardsController(FlashCardService flashCardService)
        {
            _flashCardService = flashCardService;
        }

        // POST: api/decks/{deckId}/cards/{cardId}/answer
        [HttpPost("{cardId}/answer")]
        public ActionResult SubmitAnswer(Guid deckId, Guid cardId, [FromBody] AnswerModel model)
        {
            if (model.IsCorrect)
            {
                _flashCardService.HandleCorrectAnswer(deckId, cardId);
            }
            else
            {
                _flashCardService.HandleWrongAnswer(deckId, cardId);
            }

            return Ok();
        }

        // DELETE: api/decks/{deckId}/cards/{cardId}
        [HttpDelete("{cardId}")]
        public ActionResult DeleteCard(Guid deckId, Guid cardId)
        {
            var result = _flashCardService.RemoveCardFromDeck(deckId, cardId);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }

    public class AnswerModel
    {
        public string Answer { get; set; }
        public bool IsCorrect { get; set; }
    }
} 