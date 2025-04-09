import React, { useEffect, useState } from 'react';
import { Product } from "../interfaces/product";

const BASE_URL = 'http://localhost:8000';

const Main: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
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

  const like = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/products/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to like product ${id}:`, errorData);
        throw new Error(`Failed to like: ${errorData.message || 'Unknown error'}`);
      }
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
      );
    } catch (err) {
      console.error(`Failed to like product ${id}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to like product');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main role="main">
      <div className="album py-5 bg-light">
        <div className="container">
          <div className="row">
            {products.map(p => (
              <div className="col-md-4" key={p.id}>
                <div className="card mb-4 shadow-sm">
                  <img src={`${BASE_URL}${p.image}`} height={180} alt={p.title} />
                  <div className="card-body">
                    <p className="card-text">{p.title}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => like(p.id)}
                        aria-label={`Like ${p.title}`}
                      >
                        Like
                      </button>
                      <small className="text-muted">{p.likes} likes</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;