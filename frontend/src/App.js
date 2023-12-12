import { useState,useEffect, useContext } from 'react'
import './App.scss';
import Header from './Header';
import Categories from './Categories';
import ProductList from './ProductList';
import Footer from './Footer';
import CreateButtom from './CreateButton';
import { Outlet } from "react-router-dom";
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { UserContext } from '.';

function App({children}) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const cont = useContext(UserContext)
  console.log(cont);
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
      {/* list your sessions */}
      {/* create button */}
        <CreateButtom/>
      {/* join via code */}
      <Outlet />
    </div>
  );
}

export default App;
