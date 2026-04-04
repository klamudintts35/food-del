import { createContext, useEffect, useState, } from "react";
import axios from "axios";
// import { food_list } from "../assets/frontend_assets/assets";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    /// ye card me + jo icone hai use karne ke liye incrige and decrige
    const [cartItems, setCartItems]= useState({});
    const bestURL = "https://food-del-backend-58xj.onrender.com"; //edit localhost:4000
    const [token, setToken] = useState("");
    const [food_list, setFood_list] = useState([]);
    const addToCart = async(itemId)=> {
        if(!cartItems[itemId]) {
            // setCartItems((prev)=> ({ ...prev,[itemId]:1}));
            setCartItems(prev => ({ ...prev, [itemId]: 1 }));
        }else {
            // setCartItems((prev) => ({...prev,[itemId]:prev[prev]+1}));
            setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if(token) {/// ye line db me item id add kare ke liye 
            await axios.post(bestURL+"/api/cart/add", {itemId}, {headers: {token}});
        }
    }

    const removeFromCart = async(itemId)=> {
         setCartItems(prev => ({ ...prev, [itemId]: prev[itemId] - 1 }));
         if(token) {
            await axios.post(bestURL+"/api/cart/remove", {itemId}, {headers: {token}})
         }  
    }

    const loadCardDate = async(token) => {
        const response = await axios.post(bestURL+"/api/cart/get", {},{headers: {token}});
        setCartItems(response.data.cartData);
    }

    const getTotalCartAmount = ()=> {
        let totalAmount = 0;
        for (let item in cartItems) {
            if(cartItems[item] > 0) {
                let itemInfo = food_list.find((product)=> product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
            
        }
        return totalAmount;
    }
    const fetchFoodList = async()=> {
       const response = await axios.get(bestURL+"/api/food/list");
       setFood_list(response.data.data);
    }
    
    useEffect(()=> {
        
        async function loadData() {
            try {
                await fetchFoodList();
                const saveToken = localStorage.getItem("token");
                if(saveToken) {
                    // console.log(saveToken);
                    setToken(saveToken);
                    await loadCardDate(saveToken);
                }
            } catch(err) {
                console.log(err);
            }
            
        }
        loadData();
       
    },[] );


//     useEffect(() => {
//   let isMounted = true; // cleanup ke liye flag

//   async function loadData() {
//     await fetchFoodList();

//     const saveToken = localStorage.getItem("token");
//     if (saveToken) {
//       // token verify API call
//     //   const response = await fetch(`${bestURL}/api/user/verify`, {
//     //     headers: { token: saveToken },
//     //   });
//     //   const data = await response.json();

//       if (isMounted && data.success) {
//         setToken(saveToken);
//         await loadCardDate(saveToken);
//       } else {
//         localStorage.removeItem("token"); // invalid token hata do
//       }
//     }
//   }

//   loadData();

//   return () => {
//     isMounted = false; // cleanup jab component unmount ho
//   };
// }, [fetchFoodList, loadCardDate]);



    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        bestURL,
        token,
        setToken,
     }

    return (
        <StoreContext.Provider value= {contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
