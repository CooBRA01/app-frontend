import React from 'react';
import './App.css';
import Nav from './admin/components/Nav';
import Menu from './admin/components/Menu';
import Products from './admin/Products';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from './main/Main';
import ProductsCreate from './admin/ProductsCreate';
import ProductsEdit from './admin/ProductsEdit';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/admin/products" element={<Products />} />
          <Route path="/" element={<Main />} />
          <Route path="/admin/products/create" element={<ProductsCreate />} />
          <Route path="/admin/products/:id/edit" element={<ProductsEdit />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;