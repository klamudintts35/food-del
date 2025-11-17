import React, { useEffect, useState } from "react";
// import "./Add.css"; // same styling use kar sakte ho
import './Edit.css'
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const Edit = ({ bestURL }) => {
  const { id } = useParams(); // url se id milti hai
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(false);
  const navigate = useNavigate();

  // ✅ Step 1: Existing data fetch karna
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${bestURL}/api/food/${id}`);
      setData(res.data.data); // assuming response me { success, data } hai
    };
    fetchData();
  }, [id]);

  // ✅ Step 2: Form change handle karna
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // ✅ Step 3: Update submit karna
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    if (image) formData.append("image", image);

    const res = await axios.put(`${bestURL}/api/food/${id}`, formData);
    if (res.data.success) {
      toast.success("Item updated successfully!");
      navigate("/list");
    } else {
      toast.error("Update failed!");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload New Image (optional)</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : `${bestURL}/images/${data.image}`}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input type="text" name="name" value={data.name} onChange={onChangeHandler} />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea name="description" rows="6" value={data.description} onChange={onChangeHandler}></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select name="category" value={data.category} onChange={onChangeHandler}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input type="number" name="price" value={data.price} onChange={onChangeHandler} />
          </div>
        </div>

        <button type="submit" className="add-btn">Update</button>
      </form>
    </div>
  );
};

export default Edit;
