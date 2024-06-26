import React, { useState} from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Offers from "./pages/Offer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PaymentPage from "./pages/PaymentPage";
import ShowDetail from "./pages/ShowDetail";  // Import the new component
import Profile from './pages/Profile';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/browse" exact component={Browse} />
          <Route path="/about" exact component={About} />
          <Route path="/offer" exact component={Offers} />
          <Route path="/payment/:type" component={PaymentPage} />
          <Route path="/contact" exact component={Contact} />
          <Route path="/show/:name" component={ShowDetail} /> {/* Add this route */}
          <Route path="/profile" component={Profile} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;