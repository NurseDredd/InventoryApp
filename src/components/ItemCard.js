
function ItemCard({ item, onEdit, onDelete, isLoggedIn }) {
  const handleDelete = () => {
    console.log('Delete clicked for item:', item.id); // Debugging
    onDelete(item.id);
};
    return (
      <div className="item-card">
        <div className="item-card__title">{item.name}</div>
        <p className="item-card__detail">
          <span className="item-card__label">Description:</span> {item.description}
        </p>
        <p className="item-card__detail">
          <span className="item-card__label">Quantity:</span> {item.quantity}
        </p>
        <p className="item-card__detail">
          <span className="item-card__label">Category:</span> {item.category}
        </p>
  
        {/* Knapparna visas endast om användaren är inloggad */}
        {isLoggedIn && (
          <div className="btn-container">
            <button className="editBtn bg-yellow-500" onClick={() => onEdit(item)}>
              Edit
            </button>
            <button className="deleteBtn bg-red-500" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }
  
  export default ItemCard;