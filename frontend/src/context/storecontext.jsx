import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const url = "http://localhost:3000";
  const [cartItems, setCartItems] = useState({});
  const [token, settoken] = useState("");
  const [food_list, setfood_list] = useState([]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));
    if (token) {
      await axios.post(
        url + "/api/cart/addcart",
        { itemId },
        { headers: { token } },
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      if (prev[itemId] === 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: prev[itemId] - 1 };
    });
    if (token) {
      await axios.post(
        url + "/api/cart/remcart",
        { itemId },
        { headers: { token } },
      );
    }
  };

  const loadtoken = () => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      settoken(savedToken);
    }
  };
  const loadcartdata = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/getcart",
        {},
        { headers: { token } },
      );

      console.log("Server Response:", response.data); // <-- Temporary debug line

      const data = response.data.cartdata;
      if (data) {
        setCartItems(data);
      }
    } catch (error) {
      console.error("error in loading", error);
    }
  };

  const fetchfoodlist = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setfood_list(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  useEffect(() => {
    loadtoken();
    fetchfoodlist();
    loadcartdata(localStorage.getItem("token"));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        url,
        token,
        settoken,
        loadtoken,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
