import { useState,useEffect, useContext } from 'react'
import './App.scss';
import './MainPage.scss';
import Header from './Header';
import Categories from './Categories';
import ProductList from './ProductList';
import Footer from './Footer';
import CreateButtom from './CreateButton';
import ConnectionInput from './ConnectionInput';
import { Outlet } from "react-router-dom";
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { UserContext } from '.';
import ProjectList from './ProjectList';

function App({children}) {
  const [isConnected, setIsConnected] = useState(socket.connected);
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
      <div className="main-container">
        <h1 className="main-title">CODE2GETHER</h1>
        <ConnectionState isConnected={ isConnected } />
        {/* list your sessions */}
          <ProjectList/>
        {/* create button */}
          <CreateButtom/>
        {/* join via code */}
        <ConnectionInput/>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
