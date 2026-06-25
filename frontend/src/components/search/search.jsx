import React, { useContext } from 'react'
import './search.css'
import { StoreContext } from '../../context/storecontext'
import { assets } from '../../assets/assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchPage = ({ searchQuery, setSearchQuery }) => {
  const { food_list, cartItems, addToCart, removeFromCart } = useContext(StoreContext)
  const navigate = useNavigate()

  const results = food_list.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="search-page">

      <div className="search-header">
        <button onClick={() => navigate(-1)}>← Back</button>
        <input
          type="text"
          placeholder="Search food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
      </div>

      {!searchQuery.trim() && <p className="search-hint">Type to search food...</p>}

      {searchQuery.trim() && results.length === 0 && (
        <p className="search-hint">No results found for "{searchQuery}"</p>
      )}

      <div className="search-grid">
        {searchQuery.trim() && results.map((item) => (
          <div className="search-card" key={item._id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="price">${item.price.toFixed(2)}</p>
            {!cartItems[item._id]
              ? <img className="add-btn" onClick={() => addToCart(item._id)} src={assets.add_icon_white} alt="Add" />
              : <div className="counter">
                  <img onClick={() => removeFromCart(item._id)} src={assets.remove_icon_red} alt="-" />
                  <p>{cartItems[item._id]}</p>
                  <img onClick={() => addToCart(item._id)} src={assets.add_icon_green} alt="+" />
                </div>
            }
          </div>
        ))}
      </div>

    </div>
  )
}

export default SearchPage
