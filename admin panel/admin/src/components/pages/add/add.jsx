import React from "react";
import "./add.css";
import { assets } from "../../../assets/assets";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const url = "http://localhost:3000";
  const [image, setimage] = useState(false);
  const [data, setdata] = useState({
    name: "",
    description: "",
    price: "",
    category: "salad",
  });

  const onchange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setdata((prevData) => ({ ...prevData, [name]: value }));
  };

  const onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setdata({
          name: "",
          description: "",
          price: "",
          category: "salad",
        });
        setimage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong with the server connection.");
    }
  }; 

  return (
    <div className="add">
      <form onSubmit={onsubmit} className="flex-col">
        <div className="add-img-upload flex col">
          <p>upload image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setimage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="add-product-name flex-col">
          <p>product name</p>
          <input
            onChange={onchange}
            value={data.name}
            type="text"
            name="name"
            placeholder="type here..."
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>product description</p>
          <textarea
            onChange={onchange}
            value={data.description}
            name="description"
            rows="6"
            placeholder="write description"
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>product category</p>
            <select onChange={onchange} value={data.category} name="category">
              <option value="salad">salad</option>
              <option value="rolls">rolls</option>
              <option value="desert">desert</option>
              <option value="sandwich">sandwich</option>
              <option value="cake">cake</option>
              <option value="pure veg">pure veg</option>
              <option value="pasta">pasta</option>
              <option value="noodles">noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>product price</p>
            <input
              onChange={onchange}
              value={data.price}
              type="number"
              name="price"
              placeholder="$20"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;
