import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { useUserContext } from './helpers/UserContext';
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <useUserContext>
      <App />
    </useUserContext>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
