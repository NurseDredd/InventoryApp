
export function getIdFromUrl(url= ""){
    const { pathname } = new URL(url)
    const startIndexOfId = pathname.lastIndexOf("/")+1
    if(startIndexOfId === 0) {
        return ""
    }
    return pathname.substring(startIndexOfId)

}

export function validateItemData(data) {
    let errors = {}
    if(!data.name){
        errors.name = "Name is required";
    }
    if(!data.description || data.description.length < 5) {
        errors.description = "Description has to be 5 chars or longer"
    }
    if (data.quantity === undefined || data.quantity === null || isNaN(data.quantity) || data.quantity < 0) {
      errors.quantity = "A valid quantity number greater than or equal to 0 is required";
  }
    const hasErrors = Object.keys(errors).length > 0;
    return [hasErrors, errors]
} 

// PUT-request för att uppdatera item
export async function updateItem(item, token) {
    const response = await fetch(`/api/items/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Failed to update item");
    return response.json();
  }

  //DELETE-request för att radera item
  
  export async function deleteItem(itemId, token) {
    const response = await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete item");
  }

export async function validateJSONData(req) {
    let body
    try {
        body = await req.json() // Parse incoming data to json
        return [false, body]
    }catch (error) {
        return [true,null]
    }
}

