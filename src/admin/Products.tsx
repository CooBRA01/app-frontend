import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "./Wrapper";
import { Product } from "../interfaces/product";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]); // 🛠 Ensuring type safety

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  const del = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`http://localhost:8000/api/products/${id}`, {
          method: "DELETE",
        });

        setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <Wrapper>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <div className="btn-toolbar mb-2 mb-md-0">
          <Link to="/admin/products/create" className="btn btn-sm btn-outline-secondary">
            Add Product
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Likes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: Product) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img src={p.image} height="180"  />
                </td>
                <td>{p.title}</td>
                <td>{p.likes}</td>
                <td>
                  <Link to={`/admin/products/${p.id}/edit`} className="btn btn-sm btn-outline-secondary">
                    Edit
                  </Link>
                  <a
                    href="#"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      del(p.id);
                    }}
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
};

export default Products;
