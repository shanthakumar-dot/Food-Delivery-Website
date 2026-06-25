import React from 'react'
import './menu.css'
import { menu_list } from '../../assets/assets/assets.js'



const Menu = ({ category, setCategory }) => {

  const demo = () =>{
      
    setCategory(prev=> prev === 'Salad' ? 'All' : 'Salad')
  }
  
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1
        onClick={demo}
      >
        Explore our menu
      </h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
      </p>
      <div className='explore-menu-list'>
        {menu_list.map((item) => {
          return (
            <div 
              onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)}
              className={`explore-menu-list-item ${category === item.menu_name ? 'active' : ''}`}
            >
              <img 
                className={`explore-menu-list-item ${category === item.menu_name ? 'active' : ''}`}
                src={item.menu_image} 
                alt={item.menu_name} 
              />
              <p>{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default Menu