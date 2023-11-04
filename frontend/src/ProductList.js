import './ProductList.css';
import ProductBox from "./ProductBox.js";
import { useEffect, useState } from 'react';

const ProductList = () => {

  const[products, setProducts] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:5000/products',{
      'methods':'GET'
    })
      .then(response => response.json())
    .then(response => setProducts(response))
    .catch(error => console.log(error))
  },[])

  return (
    <div className="products">
      <div className="prod">
      {products.map((product, index) => (
          <li key={index}>{product}</li>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
