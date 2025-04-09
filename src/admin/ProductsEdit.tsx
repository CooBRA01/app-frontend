import React, { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "./Wrapper";
import { Product } from "../interfaces/product";

const ProductsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product data.");
        const product: Product = await response.json();
        setTitle(product.title);
        setImage(product.image);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, image }),
      });
      if (!response.ok) throw new Error("Failed to update product.");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      setError('Failed to update product');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Wrapper>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Image URL</label>
          <input
            type="text"
            className="form-control"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-outline-secondary" type="submit">
          Save
        </button>
      </form>
    </Wrapper>
  );
};

export default ProductsEdit;