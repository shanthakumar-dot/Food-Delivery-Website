import { useContext } from "react";
import "./cart.css";
import { StoreContext } from "../../context/storecontext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, addToCart, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const cartList = food_list.filter((item) => cartItems[item._id] > 0);

  const subtotal = cartList.reduce(
    (sum, item) => sum + item.price * cartItems[item._id],
    0,
  );
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  if (cartList.length === 0) {
    return (
      <div className="cart-empty">
        <p>🛒 Your cart is empty</p>
        <button onClick={() => navigate("/")}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      <div className="cart-table-wrapper">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartList.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={url + "/images/" + item.image}
                    alt={item.name}
                    className="cart-img"
                  />
                </td>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <div className="qty-control">
                    <button onClick={() => removeFromCart(item._id)}>−</button>
                    <span>{cartItems[item._id]}</span>
                    <button onClick={() => addToCart(item._id)}>+</button>
                  </div>
                </td>
                <td>${(item.price * cartItems[item._id]).toFixed(2)}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => {
                      for (let i = 0; i < cartItems[item._id]; i++)
                        removeFromCart(item._id);
                    }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cart-summary">
        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="checkout-btn"
            onClick={() =>
              navigate("/order", {
                state: { cartList, cartItems, subtotal, deliveryFee, total },
              })
            }
          >
            Proceed to Order →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
