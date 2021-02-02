import { useEffect, useState } from 'react';
import { useSubscription } from 'urql';
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
  const [isDone, setIsDone] = useState(false);
  const [scores, setScores] = useState({ tacoBell: 0, notTacoBell: 0 });

  const [result] = useSubscription({
    query: `
      subscription MyQuery {
        tacoVotes {
          isTacoBell
          tacoId
          tastinessScore
        }
      }
    `,
  });

  useEffect(() => {
    console.log('new tacos!');

    const votes = result?.data?.tacoVotes || [];

    // TODO figure out who is right about tacos and who is Emma
    /*
    "tacoVotes": [
      {
        "isTacoBell": false,
        "tacoId": 0,
        "tastinessScore": 4
      },
      //...
    ]
    */
    const scores = votes.reduce(
      (acc, val) => {
        // do stuff
        if (val.tastinessScore > 5) {
          return acc;
        }

        if (val.isTacoBell) {
          acc.tacoBell += val.tastinessScore;
        } else {
          acc.notTacoBell += parseInt(val.tastinessScore);
        }

        return acc;
      },
      { tacoBell: 0, notTacoBell: 0 },
    );

    console.log(votes.length);

    setScores(scores);
  }, [result]);

  async function handleSubmit(event) {
    event.preventDefault();

    const taco = tacos[activeTaco];
    const newResponses = [
      ...responses,
      {
        tacoId: taco.tacoId,
        tastinessScore: tastiness,
        isTacoBell: taco.isTacoBell,
      },
    ];

    setResponses(newResponses);

    if (activeTaco === tacos.length - 1) {
      setIsDone(true);

      await fetch('/.netlify/functions/hasura-add-response', {
        method: 'POST',
        body: JSON.stringify({ responses: newResponses }),
      });

      return;
    }

    setActiveTaco(activeTaco + 1);
    setTastiness(3);
  }

  const taco = tacos[activeTaco];
  const isAbsolutelyNotFood = scores.notTacoBell > scores.tacoBell;

  return (
    <div className="App">
      <header className="App-header">
        <h1>We Need to Taco 'Bout Your Choices</h1>
      </header>
      <main>
        {isDone ? (
          <div className="results">
            <h2>
              <marquee>Thank you for voting!</marquee>
            </h2>
            <p>The people have spoken, and they beleive that Taco Bell is...</p>
            <h3>{isAbsolutelyNotFood && 'NOT'} FOOD</h3>
            {isAbsolutelyNotFood ? (
              <p>
                Sorry Emma but your taste is terrible. The entire city of Austin
                has banned you from returning.
              </p>
            ) : (
              <p>
                Jason is a snobby hipster and needs to get off his judgy taco
                high horse. Jason and separately his beard have been banned from
                all craft breweries in Austin.
              </p>
            )}
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}

export default App;
