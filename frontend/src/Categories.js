/*
 * Implementation of categories bar.
 *
 * Fetches list of categories from backend and displays them in grid.
 *
 * */
import './Categories.css';
import { useState,useEffect  } from 'react'


function Categories() {


  const [categories, setCategories] = useState([]);

  // Modify the current state by setting the new data to
  // the response from the backend
  useEffect(()=>{
    fetch('http://localhost:5000/categories',{
      'methods':'GET'
    })
      .then(response => response.json())
    .then(response => setCategories(response))
    .catch(error => console.log(error))
  },[])

  return (
    <>
    <h2>Kategorie</h2>
    <div className="categories">

      {categories.map(function(cat){
        return <a className="category" href="/">
                 {cat}
               </a>
      })

      }
    </div>
    </>
  );
}

export default Categories;
