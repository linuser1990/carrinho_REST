

    // Function to update the cart item count and the link text
    function updateCartItemCount() {

      // Set an initial cart item count
       let itemCount = 0;

      const cartItemCount = document.getElementById("cartItemCount");
      const inputItensCount = document.getElementById('inputItensCount')

      // Increment the item count (you can replace this with any logic based on your cart)
      itemCount++;

      // Update the text inside the parentheses
      cartItemCount.textContent = itemCount;

      //SETA O ITEMCOUNT NO INPUT HIDDEN PARA PEGAR o itemCount no Backend
      inputItensCount.value = itemCount;

      $.post('/shopping_cart/updateItensCart',{qtdItens: itemCount},function(res) {

      })
      
    }

    function exibirLista() {
      const listaElement = document.getElementById('lista');
      if (listaElement.style.display === 'none') {
        listaElement.style.display = 'block';
      } else {
        listaElement.style.display = 'none';
      }
    }
    
    
    
    
    
    
    
    


 
