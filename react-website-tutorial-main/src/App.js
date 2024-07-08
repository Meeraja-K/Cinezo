import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { UserProvider, useUserContext } from './helpers/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Home1 from './pages/Home1';
import About from './pages/About';
import Browse from './pages/Browse';
import Offers from './pages/Offer';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import PaymentPage from "./pages/PaymentPage";
import ShowDetail from "./pages/ShowDetail";
import PrivateRoute from './helpers/PrivateRoute';
import "./App.css"

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" exact component={HomeWrapper} />
            <Route path="/contact" exact component={Contact} />
            <Route path="/about" exact component={About} />
            <Route path="/home1" exact component={Home1} />
            <Route path="/browse" component={Browse} />
            <Route path="/offer" component={Offers} />
            <Route path="/payment/:type" component={PaymentPage} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/show/:name" component={ShowDetail} />
          </Switch>
          <Footer />
        </Router>
      </UserProvider>
    </div>
  );
}

function HomeWrapper() {
  const { isLoggedIn, isPaid, authStatus } = useUserContext();
  return isLoggedIn && isPaid && authStatus? <Redirect to="/home1" /> : <Home />;
}

export default App;
