import React from 'react';
import ReactDOM from 'react-dom';
import { Client, defaultExchanges, subscriptionExchange, Provider } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const subscriptionClient = new SubscriptionClient(
  'wss://taco-choices.hasura.app/v1/graphql',
  { reconnect: true },
);

const client = new Client({
  url: 'https://taco-choices.hasura.app/v1/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
