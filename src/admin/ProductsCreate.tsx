import React, { SyntheticEvent, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Wrapper from './Wrapper';

const ProductsCreate: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate: NavigateFunction = useNavigate();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!title || !image) {
      setError('Please provide a title and an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating product:', errorData);
        throw new Error(`Failed to create product: ${errorData.detail || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Product created successfully:', data);
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product');
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
      <h2>Create Product</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-outline-secondary mt-3">
          Save
        </button>
      </form>
    </Wrapper>
  );
};

export default ProductsCreate;