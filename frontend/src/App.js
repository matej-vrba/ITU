import { useState,useEffect } from 'react'
import './App.scss';
import Header from './Header';
import Categories from './Categories';
import ProductList from './ProductList';
import Footer from './Footer';
import { Outlet } from "react-router-dom";

function App({children}) {
  return (
    <div className="App">
        <Outlet />
    </div>
  );

  return (
    <>
    <Header/>
    <div className="App">
        <Outlet />
    </div>
    <Footer/>
    </>
  );
}

export default App;
