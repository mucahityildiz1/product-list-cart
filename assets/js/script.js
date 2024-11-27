let orders = [];
let totalPieces = 0;
let totalPrice = 0;

function render(){
  const productList = document.querySelector('.products-grid-container');
  productList.innerHTML = '';
  for (const product of products) {
    productList.innerHTML += `
    <div data-piece="${product.piece}" class="products-grid-item">
        <div class="product-image">
          <img class="mobile--image" src="assets/images/${product.image}--mobile.svg" alt="${product.category}">
          <img class="tablet--image" src="assets/images/${product.image}--tablet.svg" alt="${product.category}">
          <button data-name="${product.name}" class="add-to-cart-btn">
            <img src="assets/images/cart-icon.svg" alt="Cart Icon">
            <p>Add to Cart</p>
          </button>
          <button class="added-cart-btn"><img data-name="${product.name}" class="minus-icon" src="assets/images/minus-icon.svg">${product.piece}<img data-name="${product.name}" class="plus-icon" src="assets/images/plus-icon.svg"></button>
        </div>
        <p class="category">${product.category}</p>
        <p class="name">${product.name}</p>
        <p class="price">$${(product.price).toFixed(2)}</p>
      </div>
    `
  }
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  for (const addToCartBtn of addToCartBtns) {
    addToCartBtn.addEventListener('click', addToCart);
  }

  const plusIcons = document.querySelectorAll('.plus-icon');
  for (const plusIcon of plusIcons) {
    plusIcon.addEventListener('click', addToCart);
  }

  const minusIcons = document.querySelectorAll('.minus-icon');
  for (const minusIcon of minusIcons) {
    minusIcon.addEventListener('click', deleteProduct);
  }

  const productItems = document.querySelectorAll('.products-grid-item');

  for (const productItem of productItems) {
    if(productItem.dataset.piece > 0){
      productItem.classList.add('added-cart');
    }
  }

  const cart = document.querySelector('.cart');

  if(orders.length > 0){
    cart.innerHTML = `
      <div class="orders">
      <p class="cart-info">Your Cart (<span id="cartLength">${totalPieces}</span>)</p>
        <div class="orders-list">
        </div>
        <div class="total-price">
          <p>Order Total</p>
          <p id="totalPriceTxt">$46.50</p>
        </div>
        <div class="carbon-neutral-info">
          <img src="assets/images/carbon_tree.svg">
          <p>This is a <span>carbon-neutral</span> delivery</p>
        </div>
        <button id="confirmOrderBtn">Confirm Order</button>
      </div>
    `
    const orderList = document.querySelector('.orders-list');
    orderList.innerHTML = '';

    for (const order of orders) {
      orderList.innerHTML += `
        <div class="order">
          <div class="order__wrapper">
            <p class="order-name">${order.name}</p>
            <span class="order-piece">x${order.piece}</span>
            <span class="order-price">@ $${(order.price).toFixed(2)}</span>
            <span class="order-total-price">$${((order.price) * (order.piece)).toFixed(2)}</span>
          </div>
          <i data-name="${order.name}" class="delete-icon fa-regular fa-circle-xmark"></i>
        </div>
      `
    }
    const deleteIcons = document.querySelectorAll('.delete-icon');
    for (const deleteIcon of deleteIcons) {
      deleteIcon.addEventListener('click', deleteAllProduct);
    }
    totalPriceTxt.innerText = `$${totalPrice.toFixed(2)}`;
    confirmOrderBtn.addEventListener('click', confirmOrder);
  } else{
    cart.innerHTML = `
      <p class="cart-info">Your Cart (<span id="cartLength">0</span>)</p>
      <div class="empty-cart__wrapper">
        <img src="assets/images/empty-cart--mobile.svg">
        <p class="empty-cart-txt">Your added items will appear here</p>
      </div>
    `
  }
}

render();

function addToCart(){
  totalPieces = 0;
  totalPrice = 0;
  const selectedProduct = products.find(product => product.name == this.dataset.name);
  if(orders.includes(selectedProduct)){
    selectedProduct.piece++;
  } else{
    orders.push(selectedProduct);
    selectedProduct.piece++;
  }

  for (const order of orders) {
    totalPieces += order.piece;
    totalPrice += (order.piece) * (order.price);
    if(order.piece > order.stock){
      order.piece = order.stock;
      totalPrice = totalPrice - order.price;
      totalPieces = totalPieces - 1;
      alert('This product is out of stock.');
    }
  }

  render();
}

function deleteProduct(){
  const selectedOrder = orders.findIndex(order => order.name == this.dataset.name);
  orders[selectedOrder].piece--;
  totalPrice = totalPrice - orders[selectedOrder].price;
  totalPieces = totalPieces - 1;
  if(orders[selectedOrder].piece == 0){
    orders.splice(selectedOrder, 1);
  }
  render();
}

function deleteAllProduct(){
  if(confirm('Are you sure you want to delete all items of this product?')){
    const selectedOrder = orders.findIndex(order => order.name == this.dataset.name);
    totalPrice = totalPrice - (orders[selectedOrder].price * orders[selectedOrder].piece);
    totalPieces = totalPieces - orders[selectedOrder].piece;
    orders[selectedOrder].piece = 0;
    orders.splice(selectedOrder, 1);
  }
  render();
}

function confirmOrder(){
  confirmOrderDialog.innerHTML = `
      <div class="confirm-order-container">
      <img src="assets/images/checkmark.svg">
      <h2>Order <br> Confirmed</h2>
      <p class="order-confirm-text">We hope you enjoy your food!</p>
      <div class="orders-modal-container">
        <div class="orders-modal-list"></div>
        <div class="order-total-modal">
          <p class="order-total-modal-text">Order Total</p>
          <p class="order-total-modal-price">$${totalPrice.toFixed(2)}</p>
      </div>
    </div>
    <button id="startNewOrderBtn">Start New Order</button>
  </div>
  `
  const ordersModalList = document.querySelector('.orders-modal-list');
  ordersModalList.innerHTML = '';
  for (const order of orders) {
    ordersModalList.innerHTML += `
      <div class="orders-modal-item">
          <div class="orders-modal-item-wrapper">
            <img src="assets/images/${order.image}--tablet.svg">
            <div class="orders-modal-item-info">
              <p class="order-modal-name">${order.name}</p>
              <p class="order-modal-piece">${order.piece}x <span>@ $${order.price.toFixed(2)}</span></p>
            </div>
          </div>
          <p class="order-modal-price">$${(order.price * order.piece).toFixed(2)}</p>
      </div>
    `
  }
  confirmOrderDialog.showModal();

  startNewOrderBtn.addEventListener('click', startNewOrder);
}

function startNewOrder(){
  confirmOrderDialog.close();
  totalPieces = 0;
  totalPrice = 0;
  for (const order of orders) {
    order.piece = 0;
  }
  orders = [];
  render();
}