import { useState,useEffect } from 'react'
import './App.css';
import Header from './Header';
import Categories from './Categories';
import ProductList from './ProductList';
import Footer from './Footer';

function App({children}) {
  return (
    <>
    <Header/>
    <div className="App  container mx-auto">
      <Categories/>
      <ProductList/>
    </div>
    <Footer/>
    </>
  );
}

export default App;
