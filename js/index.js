

let products = [];

let cartProducts;

const load = () => {
  cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
  loadCartAmount();
  axios.get("products.json").then(res => {
    products = res.data;
    if(document.getElementById('all-products')){
      loadProducts();
    }
    if(document.getElementById('cart-container')){
      loadCartProducts();
      totalPriceInCart();
    }
  }).catch(err => console.log(err));
}

const funcion = (err) => {
  console.log(err)
}

const loadCartAmount = () => {
  document.getElementById('amount-cart').innerHTML = cartProducts.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
}

const loadProducts = () => {
  const stringProducts = products.map((product) => stringProduct(product));
  document.getElementById('all-products').innerHTML = stringProducts.join();
}

const totalPriceInCart = () => {
  let totalCart = 0;
  for (const cartProduct of cartProducts) {
    const product = products.find(product => product.id === cartProduct.prodId)
    totalCart += (product.price * cartProduct.amount);
  }
  document.getElementById("total-amount").innerHTML = "Total $" + totalCart;
}

const removeItemFromCart = (productId) => {
  cartProducts = cartProducts.filter(cartProduct => cartProduct.prodId != productId);
  totalPriceInCart();
  localStorage.setItem("cart", JSON.stringify(cartProducts))
  loadCartProducts();
  loadCartAmount();
}

const loadCartProducts = () => {
  const stringCartProducts = cartProducts.map((cartProduct) => stringCartProduct(cartProduct));
  document.getElementById('cart-container').innerHTML = stringCartProducts.length === 0 ? noItemsInCart() : stringCartProducts.join();
}

const noItemsInCart = () => {
  return '<div class="empty-cart">' +
    'No hay items en el carrito.' +
    '</div>'
}



const stringProduct = (product) => {
  return (
    '<div class="product-card">' +
    '<div class="product-card-price">$' +
    product.price +
    '</div>' +
    '<img class="product-image" src="' +
    product.image +
    '" alt="photo" />' +
    '<div class="product-detail">' +
    '<div class="cart-buttons">' +
    '<button class="cart-button" onclick="removeFromCartAmount(' +
    product.id +
    ')">-</button>' +
    '<div id="card-amount-' +
    product.id +
    '" class="amount">1</div>' +
    '<button class="cart-button" onclick="addToCartAmount(' +
    product.id +
    ')">+</button>' +
    '</div>' +
    '<div class="add-button-container">' +
    '<button class="add-button" onclick="addToCart(' +
    product.id +
    ')">Agregar al carrito</button>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
};

const stringCartProduct = (cartProduct) => {
  const productFound = products.find(product => product.id === cartProduct.prodId);
  return (
    '<div class="cart-card">' +
    '<div class="cart-card-img">' +
    '<img class="img-cart" src="' + productFound.image + '" alt="" />' +
    '</div>' +
    '<div class="cart-card-title">' + productFound.name + ' (' + cartProduct.amount + ' u.)' + '</div>' +
    '<div class="cart-card-price"><strong>$' + productFound.price + '</strong></div>' +
    '<div class="cart-card-button">' +
    '<button class="cart-button" onclick="removeItemFromCart(' + cartProduct.prodId + ')">Eliminar</button>' +
    '</div>' +
    '</div>'
  );
}



const addToCartAmount = (productId) => {
  const amountHTML = document.getElementById('card-amount-' + productId);
  const productFound = products.find((product) => product.id == productId);
  const productInCart = cartProducts.find(
    (cartProduct) => cartProduct.prodId == productId
  );
  const amounInCart = productInCart?.amount || 0;
  if (
    productFound &&
    productFound.stock - amounInCart > parseInt(amountHTML.innerHTML)
  ) {
    amountHTML.innerHTML = parseInt(amountHTML.innerHTML) + 1;
  }
};

const removeFromCartAmount = (productId) => {
  const amountHTML = document.getElementById('card-amount-' + productId);
  if (parseInt(amountHTML.innerHTML) > 1) {
    amountHTML.innerHTML = parseInt(amountHTML.innerHTML) - 1;
  }
};

const addToCart = (productId) => {
  const amount = parseInt(
    document.getElementById('card-amount-' + productId).innerHTML
  );
  let productInCart = cartProducts.find(
    (cartProduct) => cartProduct.prodId == productId
  );
  if (productInCart) {
    productInCart.amount += amount;
    cartProducts = cartProducts.map((cartProduct) =>
      cartProduct.prodId === productId ? productInCart : cartProduct
    );
  } else {
    productInCart = {
      prodId: productId,
      amount: amount,
    };
    cartProducts.push(productInCart);
  }

  const product = products.find((product) => product.id === productId);
  document.getElementById('card-amount-' + productId).innerHTML =
    product.stock === productInCart.amount ? 0 : 1;
  document.getElementById('amount-cart').innerHTML = cartProducts.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  localStorage.setItem('cart', JSON.stringify(cartProducts));
};

