import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './NavigationBar.css';
import CartIcon from '../../assets/CartIcon.svg';
import useStore from '../store';
import useAuthStore from '../store';


const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMenuPage = location.pathname === '/menu';
  const isAboutPage = location.pathname === '/about';
  const isProfilePage = location.pathname === '/profile';
  const cartItems = useStore((state) => state.cartItems);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);

    const price = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalPrice(price);
  }, [cartItems]);

  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const increaseQuantity = (itemId) => {
    useStore.setState((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      );
      console.log(updatedCartItems); 
      return { cartItems: updatedCartItems };
    });
  };
  
  const decreaseQuantity = (itemId) => {
    useStore.setState((state) => {
      const updatedCartItems = state.cartItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0); // Ta bort objekt där kvantiteten är noll
        console.log(updatedCartItems); 
      return { cartItems: updatedCartItems };
    });
  };


  const checkout = () => {
    const token = useAuthStore.getState().token;
    const userId = useAuthStore.getState().userId;
  
    const orderDetails = cartItems.map(item => ({
      name: item.title,
      price: item.price,
      quantity: item.quantity
    }));
    console.log('orderdetails', orderDetails)
    const totalPrice = orderDetails.reduce((total, item) => total + (item.price * item.quantity), 0);
  
    fetch('https://airbean-api-xjlcn.ondigitalocean.app/api/beans/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }), // Only include token if it exists
      },
      body: JSON.stringify({
        userId: userId,
        details: {
           order: orderDetails,
        },
      }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Unable to complete order.');
      }
    })
    .then(data => {
      console.log(totalPrice)
      console.log(data); 
      useStore.setState(() => ({ cartItems: [] }));
      navigate(`/orderstatus?orderNr=${data.orderNr}&eta=${data.eta}`);
    })
    .catch(error => {
      console.error('Error completing order:', error);
    });
  };
  
  

  return (
    <nav  className={`navbar ${isProfilePage ? 'page-black-background navbar' : 'page-beige-background navbar'}`}>
      {(isMenuPage || isAboutPage || isProfilePage ) && (
        <>
          {isMenuOpen ? (
            <div className="close-icon" onClick={toggleMenu}>
              &times;
            </div>
          ) : (
            <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
              <div className="menu-line"></div>
              <div className="menu-line"></div>
              <div className="menu-line"></div>
            </div>
          )}
          <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <li>
              <Link to="/menu" onClick={() => setIsMenuOpen(false)}><p>Meny</p></Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}><p>Vårt kaffe</p></Link>
            </li>
            <li>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}><p>Min profil</p></Link>
            </li>
            <li>
              <Link to="/orderstatus" onClick={() => setIsMenuOpen(false)}><p>Orderstatus</p></Link>
            </li>
          </ul>
        </>
      )}
      {isMenuPage && (
        <div className="cart-icon" onClick={toggleCart}>
          <img src={CartIcon} alt="Cart Icon" />
          {cartCount > 0 && (
            <div className="cart-count">{cartCount}</div>
          )}
        </div> 
       
      )}
     
      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-modal-content">
            <h1 className='cart-title'>Din beställning</h1>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  <div className='cart-Products'>
                    <div> {item.title}</div>
                    <div>
                      <button className='button-dec-inc' onClick={() => decreaseQuantity(item.id)}>-</button>{item.quantity && `(${item.quantity})`}
                      <button className='button-dec-inc' onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>    
                  </div>
                  <div>{item.price} kr</div>
                </li>
              ))}
            </ul>
            <div className='total-cart-price'>
              <div>
                <div>Total</div>
                <p>inkl moms + drönarleverans</p>
              </div>
              <div>{totalPrice} kr</div>
            </div>
            <div className='checkout'>
               <button onClick={checkout} className='checkout-btn'>Take my money!</button>
            </div>
           
          </div>
        </div>
      )}
      {isCartOpen && <div className="backdrop" onClick={toggleCart}></div>}
    </nav>
  );
};

export default NavigationBar;
