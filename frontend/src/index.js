import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Categories from './Categories';
import Header from './Header';
import Footer from './Footer';
import ProductList from './ProductList';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <App>
      <Categories/>
      <ProductList/>
    </App>
    <Footer/>
  </React.StrictMode>,
  document.getElementById('root')
);
