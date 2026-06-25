import React, { useEffect, useState } from "react";
import "./list.css";
import axios from 'axios'
import { toast } from "react-toastify";

const List = () => {
  const url = 'http://localhost:3000'
  const [list, setList] = useState([])

  const fetchlist = async () => {
    
      const response = await axios.get(`${url}/api/food/list`)
      console.log(response.data)
      if (response.data.success) {
        setList(response.data.data)
      } else {
        toast.error("Error fetching list")
      }
 
  }

  useEffect(() => {
    fetchlist()
  }, [])

  const removefood=async(foodid)=>{
      const response= await axios.post(`${url}/api/food/rem`,{id:foodid})
       await fetchlist()

      if(response.data.success){
        toast.success(response.data.message)
      }
      else{
        toast.error("error")
      }
  }

  return (
    <div className="list add flex-col">
      <p>all food list</p>
      <div className="list-table">
        <div className="list-table-format">
          <b>image</b>
          <b>name</b>
          <b>category</b>
          <b>price</b>
          <b>action</b>
        </div>
        {list.map((item,index)=>{
          return(
            <div key={index} className="list-table-format">
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p onClick={()=>removefood(item._id)} className="cursor">X</p>
            </div>
          )
        })}
      </div>
         
    </div>
  )
}

export default List;
