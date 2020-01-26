const client = contentful.createClient({
  space: 'gmzs70ifn2hy',
  accessToken: 'c8EOFy8QQxzOQeItSagpGjCXghfHE6Q9ow-_YWbm0ic',
});

const productsDOM = document.querySelector('.products-list');
const productMenu = document.querySelector('.products-menu');
const productMenuBtns = productMenu.getElementsByTagName('button');
const cartTotal = document.querySelector('.cart-count');

let cart = [];

/**
 * @class
 */
class Products {
  /**
   * Get array of products from API.
   *
   * @async
   * @method getData
   * @return {Promise<Array>} The data from the API.
   */
  async getProducts() {
    try {
      const contentful = await client.getEntries({
        content_type: 'vegan',
      });
      let products = contentful.items;
      products = products.map((item) => {
        const {
          title,
          price,
          discount,
          productClass,
        } = item.fields;
        const {
          id,
        } = item.sys;
        const image = item.fields.image.fields.file.url;
        return {
          title,
          price,
          discount,
          productClass,
          id,
          image,
        };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

/**
 * @class
 */
class UI {
  /**
   ** @method
   ** @name getBagButtons
   * @param {Array} products - received products from API
   * Display products in the DOM.
   */
  displayProducts(products) {
    let result = '';
    const productMenuBtnd = productMenu.querySelector('.active');

    products.forEach((product) => {
      /**
       * Check if every product in arrray has discount.
       * If true display discount in DOM.
       */
      const discount = product.discount === 0 ? false :
        `<span class="product-status p-abs bg-green">
          ${product.discount}%
        </span>`;
      const categoryProduct = product.productClass.split(' ');

      for (let i = 0; i < categoryProduct.length; i += 1) {
        /**
         * Сheck whether the products belong to the corresponding category
         * using the attribute data-* of the active button
         */
        if (categoryProduct[i] === productMenuBtnd.dataset.filter) {
          result += `
            <article class="product ${product.productClass}">
              <div class="product-image flex-center">
                <img src=${product.image} alt="product">
              </div>`;
          discount ? result += `${discount}` : '';
          result += `
            <div class="product-content p-rel">
              <h5>${product.title}</h5>
              <p>$${product.price}</p>
              <button class="product-btn btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
                  Add to cart
              </button>
            </div>
          </article>`;
        }
      }
    });
    productsDOM.innerHTML = result;
  }

  /**
   ** @method
   ** @name setProductMenuBtns
   * Identifies the active button of a product category
   * and display corresponding products using inin() function
   */
  setProductMenuBtns() {
    for (let i = 0; i < productMenuBtns.length; i += 1) {
      /**
       * @param {ClickEvent} e
       */
      productMenuBtns[i].addEventListener('click', (e) => {
        const productMenuBtn = productMenu.querySelector('.active');
        productMenuBtn.classList.remove('active');
        const btn = e.target;
        btn.classList.add('active');
        init();
      });
    }
  }

  /**
   ** @method
   ** @name getBagButtons
   * Get buttons of all product cards and clicking on button add product
   * to local storage comparing id of product and attribute data-* of button
   * which should be the same.
   */
  getBagButtons() {
    const buttons = [...document.querySelectorAll('.product-btn')];
    buttons.forEach((button) => {
      const id = button.dataset.id;
      /**
       * If id of product and attribute data-* of button is the same
       * disabled button and change inner text
       */
      const inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      }
      button.addEventListener('click', (event) => {
        event.target.innerText = 'In Cart';
        event.target.disabled = true;
        /**
         * Get clicked product using its id and attribute data-* of button
         */
        const cartItem = {
          ...Storage.getProduct(id),
          amount: 1,
        };
        /**
         * All Clicked products
         */
        cart = [...cart, cartItem];
        /**
         * Save clicked products to local storage
         */
        Storage.saveItem('cart', cart);
        this.setAmountOfProducts();
      });
    });
  }

  /**
   ** @method
   ** @name setAmountOfProducts
   * Increase the number of products in the menu icon
   *  when clicking on a product and save total amount of products
   * at local storage
   */
  setAmountOfProducts() {
    let itemsTotal = 0;
    const cartItems = Storage.getCart();
    cartItems.map((item) => {
      itemsTotal += item.amount;
    });
    cartTotal.innerText = '(' + itemsTotal + ')';
    Storage.saveItem('total', itemsTotal);
  }

  /**
   ** @method
   ** @name setupAPP
   * Add selected products from local storage to array if a page is updating
   */
  setupAPP() {
    cart = Storage.getCart();
  }
}

/**
 * @class
 */
class Storage {
  /**
   * Save items to local storage.
   * @param {string} title The key of local storage
   * @param {Array} items The value of key local storage
   */
  static saveItem(title, items) {
    localStorage.setItem(title, JSON.stringify(items));
  }

  /**
   * Gat product from local storage
   * @param {string} id The attribute data-* of button
   * @return {Array} product which id is identical to attribute data-* of button
   */
  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem('products'));
    return products.find((product) => product.id === id);
  }

  /**
   * @return {Array} Get cart of clicked products
   */
  static getCart() {
    return localStorage.getItem('cart') ?
      JSON.parse(localStorage.getItem('cart')) : [];
  }
}

/**
 ** @function
 ** @name init
 * Get products from API
 * Display products at DOM
 * Save products at local storage
 * Init class methods
 */
function init() {
  const products = new Products();
  const ui = new UI();
  ui.setupAPP();


  products.getProducts()
      .then((products) => {
        ui.displayProducts(products);
        Storage.saveItem('products', products);
        ui.setProductMenuBtns();
      })
      .then(() => {
        ui.getBagButtons();
        ui.setAmountOfProducts();
      });
}

init();
