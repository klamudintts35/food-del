import React, { useContext,useEffect,useState,  } from 'react'
import './PlaceOrder.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { StoreContext } from '../../context/StoreContext';
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const PlaceOrder = () => {
  const navigate = useNavigate()
  const {getTotalCartAmount, token, food_list, cartItems, bestURL } = useContext(StoreContext);
  const [paymentMethod, setPaymentMethod] = useState(""); /////////////

  const [data, setData]= useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phoneNo: ""
  });
 
  const onChangeHandler = (event)=> {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=> ({...data,[name]:value}));
  }

  const PlaceOrder = async(event)=> {
    event.preventDefault();

    if (!paymentMethod) {//////////////
      alert("Please select payment method!");
      return;
    }

    let orderItems = [];
    food_list.map((item)=> {
      if(cartItems[item._id] > 0) {
        let itemInfo = { ...item }; // copy banao
        itemInfo.quantity = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount()+2,
      paymentMethod,/////////////
    }
    // COD
    if(getTotalCartAmount()+2 > 50) {
      if (paymentMethod === "cod") {
        let response = await axios.post(bestURL + "/api/order/place-cod", orderData, { headers: { token } });
        if (response.data.success) {
          // alert("Order Placed (COD)");
          toast.success("Order Placed (COD)!");
          // navigate("/order-success");
          navigate("/myorders");
          
        } else {
          alert("COD order failed");
        }
      }


    // STRIPE
      if (paymentMethod === "stripe") {
        let response = await axios.post(bestURL + "/api/order/place", orderData, { headers: { token } });
        if (response.data.success) {
        const {session_url} = response.data;
          window.location.replace(session_url);
        } else {
          alert("Stripe order failed");
        }
      }

    // let response = await axios.post(bestURL+"/api/order/place", orderData, {headers:{token}});
    // if(response.data.success) {
    //   const {session_url} = response.data;
    //   window.location.replace(session_url);
    // }else {
    //   alert("error");
    // }
    } else {
      alert("more than ₹ 50")
    }
    
  }

  
  useEffect(()=> {
    if(!token) {
      navigate("/cart");
    }
    else if(getTotalCartAmount() === 0) {
      navigate("/cart"); ///// ye kam nhi kar raha hai kl ese solve karna hai 
    }
  },[token])

  return (
      <form onSubmit={PlaceOrder} className='place-order'>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name '/>
            <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
          </div>
          <input required name="email" onChange={onChangeHandler} value ={data.email} type="emailt" placeholder='Enter Email'/>
          <input required name="street" onChange={onChangeHandler} value = {data.street} type="text" placeholder='Street'/>
          <div className="multi-fields">
            <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
            <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
          </div>
          <div className="multi-fields">
            <input required name="pinCode" onChange={onChangeHandler} value={data.pinCode} type="text" placeholder='Pin Code '/>
            <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
          </div>
          <input required name= "phoneNo" onChange={onChangeHandler} value={data.phoneNo} type="text" placeholder='Phone no.'/>
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div >
              <div className="cart-totals-details" >
                <p>Subtotal</p>
                <p><FontAwesomeIcon  icon={faIndianRupeeSign} />{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-totals-details">
                <p>Delivery Free</p> 
                <p><FontAwesomeIcon  icon={faIndianRupeeSign} />{getTotalCartAmount() === 0?0:2}</p>
              </div>
              <hr /> 
              <div className="cart-totals-details">
                <b>Total</b>
                <b><FontAwesomeIcon  icon={faIndianRupeeSign} />{getTotalCartAmount() === 0?0:getTotalCartAmount()+2}</b>
              </div>
              {/* ye line apne se bana rahe hai */}
              <div className="carts-payment-method">
                <h3>Payment Method</h3>
                <div className="cart-payment-methods">
                  <label className="cart-payment-online">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="stripe"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <p>Stripe (Credit/Debit)</p>
                  </label>

                  <label className="cart-payment-offline">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <p>COD (Cash on Delivery)</p>
                  </label>
                </div>
              </div>
            </div>
            <button type="submit">PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </form>
  )
}

export default PlaceOrder
