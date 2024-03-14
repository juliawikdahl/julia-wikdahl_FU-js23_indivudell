import React, { useState, useEffect } from 'react';
import './MenuPage.css';
import useStore from '../../components/store'; 


function MenuPage() {
  const [menu, setMenu] = useState([]);
  const addToCart = useStore((state) => state.addToCart);
  const cartItems = useStore((state) => state.cartItems);
  useEffect(() => {
    fetch('https://airbean-api-xjlcn.ondigitalocean.app/api/beans/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setMenu(data.menu);
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
  }, []);

  return (
    <div className="page-content">
      <h1 className='menu-title'>Meny</h1>
      
      {menu.map(item => (
        <div className='menu-item' key={item.id}>
          <button className='add-to-cart' onClick={() => addToCart(item)}>+</button>
          <div className='item-info'>
            <div className='item-title-price'>
              <div>{item.title}</div>
              <div>{item.price}kr</div>
            </div>
            <div>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuPage;
