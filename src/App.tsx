import React from 'react';
import './App.css'; // Fixed the import statement
import Nav from './admin/components/Nav'; // Fixed the import statement
import Menu from './admin/components/Menu'; // Fixed the import statement
import Products from './admin/Products'; // Fixed the import statement
import {BrowserRouter, Route, Routes } from "react-router-dom";
import Main from './main/Main';
import ProductsCreate from './admin/ProductsCreate';
import ProductsEdit from './admin/ProductsEdit';
function App() {
  return (
    <div className="App">
     
          <BrowserRouter>
               <Routes>
               <Route path='/admin/products' Component={Products} />
                <Route path='/'  Component={Main} />
                <Route path='/admin/products/create' Component={ProductsCreate} />
                <Route path='/admin/products/:id/edit' Component={ProductsEdit} />
               </Routes>
              
                
            </BrowserRouter>

      
    </div>
  );
}

export default App;