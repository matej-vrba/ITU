import React from 'react';
import { useState,useEffect  } from 'react'
import ReactDOM from 'react-dom';
import App from './App';
import Project, {loader as projectLoader} from './Project';
import ProjectDetail, {loader as projectDetailLoader } from './ProjectDetail';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

export var DataContext = React.createContext([null, ()=>{}]);

// Informace o tom, která route odpovídá které komponentě
const router = createBrowserRouter([
  {
    //Pokud dojde požadavek na / klientovy se odešle výsledek komponenty
    // App
    path: "/",
    element: <App/>,
  },
  {
    // Pokud dojde požadavek na /project/1234abcd/ tak se použije komponenta
    // Project a v parametru id bude "1234abcd"
   path: "/project/:id/",
   element: <Project/>,
   loader: projectLoader,
   children:[
     {
       // pokud dojde /project/1234abcd/69 tak se použije komponenta
       // Project a v tom, co Project vrátí, tak se <Outlet/> nahradí
       // výsledkem ProjectDetail
       path: "/project/:id/:snippetId",
       element: <ProjectDetail/>,
       loader: projectDetailLoader,
     }
   ],
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <DataContext.Provider value={[null, null]}>
      <RouterProvider router={router} />
    </DataContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
