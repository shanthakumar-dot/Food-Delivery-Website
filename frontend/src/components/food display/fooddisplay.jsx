import { useContext } from "react";
import "./fooddisplay.css";
import { StoreContext } from "../../context/storecontext";
import { assets } from "../../assets/assets/assets"; // Double-check this path!

const FoodDisplay = ({ category }) => {
  const { food_list, cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  if (!food_list) return <p>Loading dishes...</p>;

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list
          .filter((item) => category === "All" || category === item.category)
          .map((item) => (
            <div className="food-item" key={item._id}>
              <div className="food-item-img-container">
                <img
                  className="food-item-image"
                  src={url + "/images/" + item.image}
                  alt={item.name}
                />

                {!cartItems || !cartItems[item._id] ? (
                  <img
                    className="add"
                    onClick={() => addToCart(item._id)}
                    src={assets.add_icon_white}
                    alt="Add to cart"
                  />
                ) : (
                  <div className="food-item-counter">
                    <img
                      onClick={() => removeFromCart(item._id)}
                      src={assets.remove_icon_red}
                      alt="Remove from cart"
                    />
                    <p>{cartItems[item._id]}</p>
                    <img
                      onClick={() => addToCart(item._id)}
                      src={assets.add_icon_green}
                      alt="Add to cart"
                    />
                  </div>
                )}
              </div>

              <div className="food-item-info">
                <div className="food-item-name-rating">
                  <p>{item.name}</p>

                  <img
                    src={assets.rating_stars || assets.rating_starts}
                    alt="Rating stars"
                  />
                </div>
                <p className="food-item-desc">{item.description}</p>
                <p className="food-item-price">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
