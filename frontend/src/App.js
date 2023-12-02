import { useState,useEffect } from 'react'
import './App.css';
import Header from './Header';
import Categories from './Categories';
import ProductList from './ProductList';
import Footer from './Footer';
import { Outlet } from "react-router-dom";

function App({children}) {
  return (
    <>
    <Header/>
    <div className="App  container mx-auto">
        <Outlet />
    </div>
    <Footer/>
    </>
  );
}

export default App;
