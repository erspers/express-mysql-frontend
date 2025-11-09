// src/pages/ProductList.jsx
import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products (Read All)
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err); // log error to console
      setError("Failed to load products. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Create operation
  const handleCreate = async (productData) => {
    try {
      await createProduct(productData);
      fetchProducts(); // Re-fetch list to show new product
      alert("Product created successfully!");
    } catch (err) {
      console.error("Error creating product:", err); // log error to console
      setError(err.message || "Error creating product.");
    }
  };

  // Handle Update operation
  const handleUpdate = async (productData) => {
    try {
      await updateProduct(productData.id, productData);
      setEditingProduct(null); // Exit edit mode
      fetchProducts(); // Re-fetch list to show updated product
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err); // log error to console
      setError(err.message || "Error updating product.");
    }
  };

  // Handle Delete operation
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete product ${id}?`)) {
      return;
    }

    try {
      await deleteProduct(id);
      fetchProducts(); // Re-fetch list
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err); // log error to console
      setError(err.message || "Error deleting product.");
    }
  };

  // Render logic for loading and errors
  if (isLoading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="product-page">
      <h1>Simple Products CRUD Application</h1>

      <section className="form-section">
        <ProductForm
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          initialData={editingProduct || {}}
          isUpdate={!!editingProduct}
        />

        {editingProduct && (
          <button
            className="btn-cancel"
            onClick={() => setEditingProduct(null)}
          >
            Cancel Edit
          </button>
        )}
      </section>

      <section className="list-section">
        <h2>Available Products</h2>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                onEdit={setEditingProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductList;
