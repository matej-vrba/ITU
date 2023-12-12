import { useState,useEffect } from 'react'
import './App.scss';
import Header from './Header';
import Categories from './Categories';
import ProductList from './ProductList';
import Footer from './Footer';
import { Outlet } from "react-router-dom";
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';

function App({children}) {

  useEffect(
    () => {
      function onConn(){
        setIsConnected(true);
      }
      function onDis(){
        setIsConnected(false);
      }
      socket.on('connect', onConn);
      socket.on('disconnect', onDis);
    }
  )

  return (
    <div className="App">
      <ConnectionState isConnected={ isConnected } />
      <Outlet />
    </div>
  );
}

export default App;
