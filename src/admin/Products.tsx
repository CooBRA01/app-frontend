import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "./Wrapper";
import { Product } from "../interfaces/product";

const BASE_URL = 'http://localhost:8000';  // Adjust if needed

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const del = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error('Failed to delete product');
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
        setError('Failed to delete product');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                <td><img src={`${BASE_URL}${p.image}`} height={180} alt={p.title} /></td>
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