import React from 'react'
import './List.css'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// ...



const List = ({bestURL}) => {
  // const bestURL = 'http://localhost:4000';
  const [list, setList]= useState([]);

  const navigate = useNavigate();

  const fetchList = async() => {
    const response = await axios.get(`${bestURL}/api/food/list`);
    // console.log(response.data);
    if(response.data.success) {
      setList(response.data.data);
  
    }else {
      toast.error("error");
    }
  }
  useEffect(()=> {
    fetchList();
  },[]);

  const removeFood = async(foodId) => {
    // console.log(foodId);
    const response = await axios.post(`${bestURL}/api/food/remove`,{id:foodId});
    await fetchList();
    if(response.data.success) {
      toast.success(response.data.message);
    }
    else {
      toast.error("error");
    }
  }
 /// itself edit route banana hai
  const editFood = (items)=> {
    console.log(items)
  }

  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className="list-table-format title">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Edit</b>
        <b>Action</b>
        
      </div>
      {list.map((item, index)=> {
        return (
          <div key={index} className="list-table-format">
            <img src={`${bestURL}/images/`+item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹&nbsp;&nbsp;{item.price}</p>
            <button onClick={() => navigate(`/edit/${item._id}`)} className='edit-btn'>Edit</button>
            <p onClick={() => removeFood(item._id)} className='cursor' ><span>X</span></p>
            
          </div>
        )
      })}
    </div>
  )
}

export default List
