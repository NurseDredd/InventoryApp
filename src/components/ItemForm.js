
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { validateItemData, updateItem } from "@/utils/apiHelpers"; // Importera dina hjälpfunktioner

function ItemForm({ editingItem, onItemCreated, onItemUpdated }) {
  const router = useRouter();
  const auth = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(""); 
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setDescription(editingItem.description || "");
      setQuantity(editingItem.quantity || "");
      setCategory(editingItem.category || "");
      setIsEditing(true);
    } else {
      setName("");
      setDescription("");
      setQuantity("");
      setCategory("");
      setIsEditing(false);
    }
  }, [editingItem]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); 

    if (!auth.token) {
      setError("You must be logged in to submit the form");
      return;
    }

    const itemData = {
      name,
      description,
      quantity: parseInt(quantity),
      category,
    };

    // Validera itemData
    const [hasErrors, validationErrors] = validateItemData(itemData);
    if (hasErrors) {
      setError(validationErrors[Object.keys(validationErrors)[0]]);
      return;
    }

    try {
      let response;

      if (isEditing) {
        response = await updateItem({ ...itemData, id: editingItem.id }, auth.token);
        onItemUpdated(response); // Anropa callback för uppdatering
        setIsEditing(false);
      } else {
        response = await fetch("/api/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`, 
          },
          body: JSON.stringify(itemData),
        });

        if (response.ok) {
          const newItem = await response.json();
          onItemCreated(newItem); // Anropa callback för att uppdatera item-listan
          setName("");
          setDescription("");
          setQuantity("");
          setCategory("");
          router.push("/items"); 
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to create item");
        }
      }
    } catch (error) {
      console.error("error", error);
      setError("An error occurred while processing the request");
    }
  }


  function handleCancel() {
    setName("");
    setDescription("");
    setQuantity("");
    setCategory("");
    setError("");
    setIsEditing(false);
    onItemUpdated(null);
  }

  return (
    <div>
      <form className="form bg-white" onSubmit={handleSubmit}>
      <h2 className="text-gray-500 text-xl pr-5 py-5">Create or update item</h2>
        <div className="inputContainer">
        <div className="form__group">
          <label className="form__label">Name</label>
          <input
            className="form__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form__group">
          <label className="form__label">Description</label>
          <input
            className="form__input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form__group">
          <label className="form__label">Quantity</label>
          <input
            className="form__input"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="form__group">
          <label className="form__label">Category</label>
          <input
            className="form__input"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="itemForm__btn__container flex gap-2">
        <button className="form__button form__button--primary" type="submit">
          {isEditing ? "Update Item" : "Create Item"}
        </button>
        <button className="cancelBtn form__button--secondary rounded sm pr-2 pl-2" type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ItemForm;


