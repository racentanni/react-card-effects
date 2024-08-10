import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const drawIntervalRef = useRef(null);

  useEffect(() => {
    // Fetch a new deck when the component mounts
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
      .then(response => response.json())
      .then(data => {
        setDeckId(data.deck_id);
      })
      .catch(error => console.error('Error fetching deck:', error));
  }, []);

  const drawCard = () => {
    if (deckId) {
      fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(response => response.json())
        .then(data => {
          if (data.success && data.cards.length > 0) {
            const card = data.cards[0];
            setCards(prevCards => [...prevCards, card]);
          } else {
            alert('Error: no cards remaining!');
            stopDrawing();
          }
        })
        .catch(error => console.error('Error drawing card:', error));
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    drawIntervalRef.current = setInterval(drawCard, 1000);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    clearInterval(drawIntervalRef.current);
  };

  const toggleDrawing = () => {
    if (isDrawing) {
      stopDrawing();
    } else {
      startDrawing();
    }
  };

  const shuffleDeck = () => {
    if (deckId) {
      setIsShuffling(true);
      fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setCards([]);
            stopDrawing();
          }
          setIsShuffling(false);
        })
        .catch(error => {
          console.error('Error shuffling deck:', error);
          setIsShuffling(false);
        });
    }
  };

  return (
    <div className="App">
      <div id="card-container">
        {cards.map((card, index) => (
          <img
            key={card.code}
            src={card.image}
            alt="Card"
            className={index % 2 === 0 ? 'rotate-left' : 'rotate-right'}
          />
        ))}
      </div>
      <button onClick={toggleDrawing}>
        {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
      </button>
      <button onClick={shuffleDeck} disabled={isShuffling}>
        {isShuffling ? 'Shuffling...' : 'Shuffle Deck'}
      </button>
    </div>
  );
}

export default App;
