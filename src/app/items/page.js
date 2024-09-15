"use client";

import { useState, useEffect } from "react";
import ItemCard from "@/components/ItemCard";
import ItemForm from "@/components/ItemForm";
import ItemFilter from "@/components/ItemFilter";
import { useAuth } from "@/context/auth";
import { deleteItem } from "@/utils/apiHelpers";

export default function ItemsPage() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({});
    const auth = useAuth();

    useEffect(() => {
        async function fetchItems() {
            const { category, inStock } = filters;
            try {
                const query = new URLSearchParams();
                if (category) query.append("category", category);
                if (inStock) query.append("inStock", inStock);

                const response = await fetch(`/api/items?${query.toString()}`);
                if (response.ok) {
                    const data = await response.json();
                    setItems(data);
                } else {
                    throw new Error("Failed to fetch items");
                }
            } catch (error) {
                console.error("Failed to get items", error);
                setError("Failed to get items");
            }
        }

        fetchItems();
    }, [filters]);

    function handleFilterChange(newFilters) {
        setFilters(newFilters);
    }

    function handleDelete(id) {
        if (!auth.token) {
            console.error("No token available");
            return;
        }

        deleteItem(id, auth.token)
            .then(() => {
                setItems(prevItems => prevItems.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error("Failed to delete item", error);
                setError("Failed to delete item");
            });
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between w-full">
            <ItemForm 
                editingItem={selectedItem} 
                onItemCreated={newItem => setItems([...items, newItem])} 
                onItemUpdated={updatedItem => {
                    if (updatedItem) {
                        setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
                    }
                    setSelectedItem(null);
                }}
            />
            <ItemFilter onFilterChange={handleFilterChange} />
            <section className="flex flex-col items-center justify-center gap-2 w-full">
                {error && <p className="text-red-500">{error}</p>}
                {items.length > 0 ? (
                    items.map((item) => (
                        <ItemCard 
                            key={item.id}
                            item={item}
                            onEdit={setSelectedItem}
                            onDelete={handleDelete} 
                            isLoggedIn={!!auth.token}
                        />
                    ))
                ) : (
                    <p className="message text-white">No items available</p>
                )}
            </section>
        </main>
    );
}