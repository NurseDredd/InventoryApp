"use client";

import { useState, useEffect } from "react";
import ItemCard from "@/components/ItemCard";
import ItemFilter from "@/components/ItemFilter";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/auth";

export default function Home() {
  const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({}); // Hantera filtren korrekt
    const [showLogin] = useState(false); // State för att toggla loginformulär
    const auth = useAuth();  

    // Uppdatera när filtren ändras
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

    // Skicka filterändringarna till `ItemFilter`
    function handleFilterChange(newFilters) {
        setFilters(newFilters); // Uppdatera med nya filter
    }


  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      {!showLogin && (
        <ItemFilter filters={filters} onFilterChange={handleFilterChange} />
      )}

      {showLogin ? (
        <AuthForm />
      ) : (
        <section className="flex flex-col items-center justify-center gap-2 w-full">
                {error && <p className="text-red-500">{error}</p>}
                {items.length > 0 ? (
                    items.map((item) => (
                        <ItemCard 
                            key={item.id}
                            item={item}
                            isLoggedIn={!!auth.token}
                        />
                    ))
                ) : (
                    <p className="message text-white">No items available</p>
                )}
            </section>
      )}
    </main>
  );
}
