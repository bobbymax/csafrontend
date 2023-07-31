import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AuthProvider } from "./context/AuthProvider";
import { ContextProvider } from './context/ContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ContextProvider>
          <Router>
            <App />
          </Router>
        </ContextProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

