const cartTable = document.querySelector('#cart-table');
const cartTableBody = cartTable.getElementsByTagName('tbody')[0];
const emptyCartItems = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-count');
const orderSection = document.querySelector('.order');
const checkoutCart = document.querySelector('.checkout-cart');

/**
 * @class
 */
class UI {
  /**
   ** @method
   ** @name addCartItem
   * Display cart of clicked products in the DOM.
   */
  addCartItem() {
    /**
     ** 
     * If cart of products is empty return
     */
    if (!this.checkCart()) {
      return;
    }
    const cartItems = Storage.getItem('cart');
    let result = '';
    for (let i = 0; i < cartItems.length; i++) {
      const values = cartItems[i].amount;
      result = `
        <td class="product-close"><span class="ion-ios-close product-delete"
            data-id=${cartItems[i].id}></span></td>
        <td class="product-image">
            <img src=http:${cartItems[i].image} alt="product">
        </td>
        <td data-label="Product Name" class="product-name">
            <h3>${cartItems[i].title}</h3>
        </td>
        <td data-label="Price" class="product-price">$${cartItems[i].price}</td>
        <td data-label="Quantity" class="product-quantity">
            <span class="count count-up" data-id=${cartItems[i].id}>+</span>
            <span class="product-amount" data-id=${cartItems[i].id}>
                ${cartItems[i].amount}
            </span>
            <span class="count count-down" data-id=${cartItems[i].id}>-</span>
        </td>
        <td data-label="Total" class="product-total" 
           data-id=$${cartItems[i].id}>
           $${cartItems[i].price * values}
        </td> `;
      const tr = document.createElement('tr');
      tr.innerHTML = result;
      cartTableBody.appendChild(tr);
    }
    this.setValuesAllProducts();
  }

  /**
   ** @method
   ** @name cartLogic
   */
  cartLogic() {
    cartTableBody.addEventListener('click', (e) => {
      const cartItems = Storage.getItem('cart');
      if (e.target.classList.contains('product-delete')) {
        const removeItem = event.target;
        const id = removeItem.dataset.id;
        cartTableBody.removeChild(removeItem.parentElement.parentElement);
        // remove product
        this.removeItem(id);
      } else if (event.target.classList.contains('count-up')) {
        const addAmount = event.target;
        const id = addAmount.dataset.id;
        const tempItem = cartItems.find((item) => item.id === id);
        // increase the amount of products clicking '+'
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cartItems);
        addAmount.nextElementSibling.innerText = tempItem.amount;
        const totalPrice = this.getProductValue(tempItem);
        const total = addAmount.parentElement.nextElementSibling;
        total.innerHTML = totalPrice.price;
      } else if (event.target.classList.contains('count-down')) {
        const lowerAmount = event.target;
        const id = lowerAmount.dataset.id;
        const tempItem = cartItems.find((item) => item.id === id);
        // reduce the amount of products clicking '-'
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cartItems);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
          const totalPrice = this.getProductValue(tempItem);
          const total = lowerAmount.parentElement.nextElementSibling;
          total.innerHTML = totalPrice.price;
        } else {
          // if one type of product is less than zero, remove it from the table
          cartTableBody.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
      this.checkCart();
      this.setValuesAllProducts();
    });
  }

  /**
   ** @method
   ** @name checkCart
   * Сheck amount of cart items
   */
  checkCart() {
    const cart = Storage.getItem('cart');
    if (cart && cart.length) {
      // display table of clicked products at DOM
      cartTable.classList.remove('table-empty');
      cartTable.classList.add('active');
      this.initOrder();
      return true;
    } else {
      // remove table
      cartTable.classList.remove('active');
      cartTable.classList.add('table-empty');
      emptyCartItems.classList.add('active');
      orderSection.style.display = 'none';
      return false;
    }
  }

  /**
   ** @method
   ** @name initOrder
   * Display order section
   */
  initOrder() {
    const items = Storage.getItem('cart');
    let totalSum = 0;
    for (let i = 0; i < items.length; i++) {
      totalSum += items[i].amount * items[i].price;
    }
    items.length > 0 ? orderSection.style.display = 'block' :
      orderSection.style.display = 'none';
    checkoutCart.innerHTML = `
        <h2>Order Summary</h2>
        <p>
            <span>Subtotal</span>
            <span>$${totalSum}</span>
        </p>
        <p>
            <span>Delivery</span>
            <span>$0.00</span>
        </p>
        <hr>
        <p>
            <span>Total</span>
            <span>$${totalSum}</span>
        </p>`;
  }

  /**
   * Remove products from local storage
   ** @method
   ** @name removeItem
   * @param {string} id The id of remove product
   */
  removeItem(id) {
    let cartItems = Storage.getItem('cart');
    cartItems = cartItems.filter((item) => item.id !== id);
    Storage.saveCart(cartItems);
  }

  /**
   * @method getProductValue
   * @param {Object} product
   * @return {Object} price and amount of product
   */
  getProductValue(product) {
    let tempTotal = 0;
    let itemsTotal = 0;
    let price = '';
    let amount = '';
    tempTotal += product.price * product.amount;
    itemsTotal += product.amount;
    price = parseFloat(tempTotal.toFixed(2));
    amount = itemsTotal;
    return {
      price,
      amount,
    };
  }

  /**
   ** @method
   ** @name setValuesAllProducts
   * Change the number of products in the menu icon clicking on '+', '=' or 'x'
   * and save total amount of products at local storage
   */
  setValuesAllProducts() {
    let itemsTotal = 0;
    const cartItems = Storage.getItem('cart');

    cartItems.map((item) => {
      itemsTotal += item.amount;
    });
    cartTotal.innerText = '(' + itemsTotal + ')';
    Storage.saveTotal(itemsTotal);
  }
}

/**
 * @class
 */
class Storage {
  /**
   * Save products to local storage
   * @param {Array} cart Array of products
   */
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  /**
   * Save total amount of products
   * @param {Array} total Total amount of products
   */
  static saveTotal(total) {
    localStorage.setItem('total', JSON.stringify(total));
  }

  /**
   * Save products to local storage.
   * @param {string} title Array of products
   * @return {Array} Get items
   */
  static getItem(title) {
    return localStorage.getItem(title) !== 'undefined' ?
      JSON.parse(localStorage.getItem(title)) : [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  ui.checkCart();
  ui.addCartItem();
  ui.cartLogic();
});