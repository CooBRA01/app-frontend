import React, { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Wrapper from "./Wrapper";
import { Product } from "../interfaces/product";

const ProductsEdit = () => {
  const { id } = useParams<{ id: string }>(); // ✅ Get product ID from URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data.");
        }
        const product: Product = await response.json();
        setTitle(product.title);
        setImage(product.image);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    })();
  }, [id]); // ✅ Ensure re-fetching if ID changes

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product.");
      }

      navigate("/admin/products"); // ✅ Redirect after successful update
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Wrapper>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title} // ✅ Use `value` instead of `defaultValue`
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Image URL</label>
          <input
            type="text"
            className="form-control"
            value={image} // ✅ Handle `image` as a string (URL)
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-outline-secondary">Save</button>
      </form>
    </Wrapper>
  );
};

export default ProductsEdit;
