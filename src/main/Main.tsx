import React, { useEffect, useState } from 'react';
import { Product } from "../interfaces/product";

const BASE_URL = 'http://34.122.1.199:30000';

const Main: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch the goods!');
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something’s off—hold tight!');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const like = async (id: number) => {
    try {
      const response = await fetch(`http://34.122.1.199:30001/api/products/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(`Like attempt on ${id}:`, data);
        setMessage(prev => ({
          ...prev,
          [id]: data.message === 'You already liked this product' ? 'Whoa, you’re obsessed! 😍' : 'Oops, like failed! 😢',
        }));
        setTimeout(() => setMessage(prev => ({ ...prev, [id]: '' })), 2000);
        return; // Graceful exit, no throw
      }
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
      );
      setMessage(prev => ({ ...prev, [id]: 'Boom! Liked it! 🔥' }));
      setTimeout(() => setMessage(prev => ({ ...prev, [id]: '' })), 2000);
    } catch (err) {
      console.error(`Failed to like product ${id}:`, err);
      setError('Total like meltdown—try again! 😵');
    }
  };

  if (loading) return <div>Loading the Landing page... 🎈</div>;
  if (error) return <div className="alert alert-danger fade-in">Error: {error}</div>;

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
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => like(p.id)}
                        aria-label={`Like ${p.title}`}
                      >
                        Smash Like! 💥
                      </button>
                      <small className="text-muted">{p.likes} likes</small>
                    </div>
                    {message[p.id] && (
                      <div className={`mt-2 alert fade-in ${message[p.id].includes('Liked') ? 'alert-success' : 'alert-warning'}`}>
                        {message[p.id]}
                      </div>
                    )}
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