import React from 'react'
import { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios"

const ItemPage = () => {
  const [item, setItem] = useState(null);
  const { _id } = useParams();

  useEffect(() => {
    const fetchItem = async () => {
      const response = await axios.get(`http://localhost:3001/api/v1/products/${_id}`);
      console.log(response.data);
      setItem(response.data);
    };
    fetchItem();
  }, [_id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div>ItemPage</div>
  )
}

export default ItemPage