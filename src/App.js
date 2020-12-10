import { useState } from 'react';
import './App.css';

const tacos = [
  {
    tacoId: 0,
    src: '/images/krisztian-tabori-ZQf4jzkpz1k-unsplash.jpg',
    alt: 'NOT Taco Bell tacos',
    isTacoBell: false,
  },
  {
    tacoId: 1,
    src: '/images/cheesy-double-decker.jpg',
    alt: 'Taco Bell cheesy double decker taco',
    isTacoBell: true,
  },
  {
    tacoId: 2,
    src: '/images/cheesy-thing.jpg',
    alt: 'Taco Bell cheesy taco thing',
    isTacoBell: true,
  },
  {
    tacoId: 3,
    src: '/images/doritos-locos.jpg',
    alt: 'Taco Bell Doritos Locos taco',
    isTacoBell: true,
  },
  {
    tacoId: 4,
    src: '/images/taco-bell-tacos.jpg',
    alt: 'Taco Bell tacos',
    isTacoBell: true,
  },
  {
    tacoId: 5,
    src: '/images/fidel-fernando-OKJlJn5smek-unsplash.jpg',
    alt: 'NOT Taco Bell tacos',
    isTacoBell: false,
  },
  {
    tacoId: 6,
    src: '/images/jeswin-thomas-z_PfaGzeN9E-unsplash.jpg',
    alt: 'NOT Taco Bell tacos',
    isTacoBell: false,
  },
  {
    tacoId: 7,
    src: '/images/jordan-nix-61wG5-SAF_Y-unsplash.jpg',
    alt: 'NOT Taco Bell tacos',
    isTacoBell: false,
  },
];

function App() {
  const [responses, setResponses] = useState([]);
  const [activeTaco, setActiveTaco] = useState(0);
  const [tastiness, setTastiness] = useState(3);

  function handleSubmit(event) {
    event.preventDefault();

    const taco = tacos[activeTaco];
    const newResponses = [
      ...responses,
      { tacoId: taco.tacoId, tastiness, isTacoBell: taco.isTacoBell },
    ];

    setResponses(newResponses);

    if (activeTaco === tacos.length - 1) {
      // TODO implement submission
      console.log(
        'saving your responses... FOR SCIENCE (and bragging rights)!',
      );
      console.log(newResponses);

      return;
    }

    setActiveTaco(activeTaco + 1);
    setTastiness(3);
  }

  const taco = tacos[activeTaco];

  return (
    <div className="App">
      <header className="App-header">
        <h1>We Need to Taco 'Bout Your Choices</h1>
      </header>
      <main>
        <div className="current-vote">
          {/* 
          1. image
          2. form
            - question heading
            - yes
            - no
           */}
          <img src={taco.src} alt={taco.alt} />
          <form onSubmit={handleSubmit}>
            <h2>How delicious is this taco?</h2>
            <label htmlFor="amount">
              Choose 1 for "garbage" and 5 for "I would die for this taco"
            </label>
            <input
              id="amount"
              type="range"
              min={1}
              max={5}
              onChange={(event) => setTastiness(parseInt(event.target.value))}
              value={tastiness}
              list="tickmarks"
            />
            <datalist id="tickmarks">
              <option value={1} label="1"></option>
              <option value={2}></option>
              <option value={3} label="3"></option>
              <option value={4}></option>
              <option value={5} label="5"></option>
            </datalist>

            <button>Save and Rate the Next Taco</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
