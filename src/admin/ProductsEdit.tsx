import React, { SyntheticEvent, useState, useEffect } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import Wrapper from './Wrapper';
import { Product } from "../interfaces/product";

const ProductsEdit: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate: NavigateFunction = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product details!');
        const data: Product = await response.json();
        setTitle(data.title);
        setCurrentImage(data.image);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Couldn’t load this gem!');
      }
    };
    fetchProduct();
  }, [id]);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!title) {
      setError('Yo, we need a title to roll with! 😜');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    if (image) formData.append('image', image); // Only append if new image selected

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Tweak failed: ${errorData.detail || 'Something’s off!'}`);
      }

      const data = await response.json();
      setSuccess(`Tweak nailed! "${data.title}" is looking fresh! ⚡`);
      setTimeout(() => navigate('/admin/products'), 2000);
    } catch (err) {
      console.error('Failed to update product:', err);
      setError(err instanceof Error ? err.message : 'Update crashed—yikes!');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  return (
    <Wrapper>
      <h2>Tweak This Bad Boy! 🛠️</h2>
      {success && <div className="alert alert-success fade-in">{success}</div>}
      {error && <div className="alert alert-danger fade-in">{error}</div>}
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Give it a killer name!"
            required
          />
        </div>
        <div className="form-group">
          <label>Current Image</label>
          {currentImage && (
            <img src={`${currentImage}`} height={180} alt="Current" className="mb-2 d-block" />
          )}
          <label>Swap Image (optional)</label>
          <input
            type="file"
            className="form-control"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-outline-secondary mt-3">
          Lock It In! 🔧
        </button>
      </form>
    </Wrapper>
  );
};

export default ProductsEdit;