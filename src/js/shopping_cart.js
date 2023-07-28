    // Set an initial cart item count
    let itemCount = 0;

    // Function to update the cart item count and the link text
    function updateCartItemCount() {
      const cartItemCount = document.getElementById("cartItemCount");
      // Increment the item count (you can replace this with any logic based on your cart)
      itemCount++;
      // Update the text inside the parentheses
      cartItemCount.textContent = itemCount;
    }


 
