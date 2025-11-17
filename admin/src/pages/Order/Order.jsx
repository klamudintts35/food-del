import React from 'react'
import "./Order.css"
import { useState } from 'react'
import axios from "axios";
import {toast} from 'react-toastify';
import { useEffect } from 'react';
import { assets } from '../../../../frontend/src/assets/frontend_assets/assets';
const Order = ({bestURL}) => {
  const [orders, setOrders]= useState([]);
  const fetchAllOrders = async ()=> {
    const response = await axios.get(bestURL+"/api/order/list");
    if(response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    }else {
      toast.error("error");
    }
  }
  // status update 
  const statusHandler =async (event, orderId)=> {
    const response = await axios.post(bestURL+"/api/order/status", {
      orderId,
      status: event.target.value
    });
    if(response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(()=> {
    fetchAllOrders();
  },[])
  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {
          orders.map((order, index)=> {
            return (
              <div key={index} className="order-item">
                <img src={assets.parcel_icon} alt="" />
                <div>
                  <p className='order-list-food'>
                    {order.items.map((item, index)=> {
                      if(index === order.items.length-1) {
                        return item.name + "X" +item.quantity
                      }else{
                        return item.name + "X" +item.quantity+","
                      }
                    })}
                  </p>
                  <p className='order-item-name'>{order.address.firstName+ " "+ order.address.lastName}</p>
                  <div className="order-item-address">
                    <p>{order.address.street}</p>
                    <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.pinCode}</p>
                  </div>
                   <p className='order-item-phone'>{order.address.phoneNo}</p>
                </div>
                <p>Items: {order.items.length}</p>
                <p>₹ {order.amount}</p>
                <p>payment Method: {order.paymentMethod}</p>
                <select onChange={(event)=> statusHandler(event, order._id)} value={order.status}>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out For Deleviry">Out For Deleviry</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            )
          })
        } 
      </div>
    </div>
  )
}

export default Order
