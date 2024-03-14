import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import AboutPage from './Pages/AboutPage/AboutPage';
import MenuPage from './Pages/MenuPage/MenuPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import OrderStatusPage from './Pages/OrderStatusPage/OrderStatusPage';
import NavBar from './components/NavigationBar/NavigationBar';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/about"
            element={
              <>
                <NavBar /> 
                <div className="page-content page-beige-background">
                  <AboutPage />
                </div>    
                <Footer />
              </>
            }
          />
          <Route
            path="/menu"
            element={
              <>
                <NavBar /> 
                <div className="page-content page-beige-background">
                  <MenuPage />
                </div>
                <Footer />
              </>
            }
          />
           <Route
            path="/profile"
            element={
              <>
                <NavBar /> 
                <div className="page-content page-black-background">
                  <ProfilePage />
                </div>
            
              </>
            }
          />
  
            <Route path="/" element={<LandingPage />} />
          
          <Route path="/orderstatus" element={<OrderStatusPage />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
