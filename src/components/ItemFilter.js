import { useState, useEffect } from "react";

function ItemFilter({ onFilterChange, filters }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inStock, setInStock] = useState(false);

  // Hämta kategorier från backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/items");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Synkronisera lokalt tillstånd med props
  useEffect(() => {
    if (filters) {
      const category = typeof filters.category === 'string' ? filters.category : "";
      const stock = typeof filters.inStock === 'boolean' ? filters.inStock : false;
      setSelectedCategory(category);
      setInStock(stock);
    }
  }, [filters]);

  // Hantera kategoribyte och uppdatera state
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    onFilterChange({ category: selectedCategory, inStock });
  };

  // Hantera lagerstatusändring och uppdatera state
  const handleInStockChange = (e) => {
    const isInStock = e.target.checked;
    setInStock(isInStock);
    onFilterChange({ category: selectedCategory, inStock: isInStock });
  };

  return (
    <div className="filterContainer">
      <h3>Filter:</h3>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">All categories</option>
        {categories.map((category, index) => (
          <option key={`category-${category}-${index}`} value={category}>
            {category}
          </option>
        ))}
      </select>

      <div>
        <label className="checkbox-label">
          In stock only 
          <input
            type="checkbox"
            checked={inStock}
            onChange={handleInStockChange}
            className="form-checkbox h-3 w-3 text-blue-600"
          />
        </label>
      </div>
    </div>
  );
}

export default ItemFilter;