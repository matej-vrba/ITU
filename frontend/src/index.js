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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path: "/project/:id/",
        element: <Project/>,
        loader: projectLoader,
        children:[
          {
            path: "/project/:id/:snippetId",
            element: <ProjectDetail/>,
            loader: projectDetailLoader,
          }
        ],
      },
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
