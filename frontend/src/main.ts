import 'bootstrap/dist/css/bootstrap.css'
import './styles/style.css'
import { fetchData } from "./API";
import { IProduct, IOrderInfo, IOrder, ICartItems } from "./interfaces";
import { Modal, Offcanvas } from "bootstrap";

//(E2S1T3) - add when we are doing E3
//import { addToCart } from './btn-click-counter-trolley'
//addToCart() */

const rowEl = document.querySelector('.row')
const URL = 'https://www.bortakvall.se/'

// Empty array to fetch data to
let products: IProduct[] = []

// Get data from API and save it into products-array
const getProducts = async () => {
  const result = await fetchData()
  products = result.data
  renderProducts();
}

getProducts()

// Render products to DOM
const renderProducts = () => {
  rowEl!.innerHTML = products
    .map(product => `<div class="col-6 col-sm-4 col-lg-3">
         <div data-id="${product.id}" class="card mt-5">
          <img data-id="${product.id}" class="card-img img-fluid" src="${URL}${product.images.large}" alt="Image of ***">
           <div data-id="${product.id}" class="card-body">
              <h2 data-id="${product.id}" class="card-title pt-3">${product.name}</h2>
              <p data-id="${product.id}" class="card-text">${product.price} kr</p>
              <button data-id="${product.id}" class="clr-button" data-id="${product.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-basket" viewBox="0 0 16 16">
              <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
              </svg>Lägg till</button>
           </div>
         </div>
       </div>
       `
    ).join('')
}


// create variables to use modal (bootstrap)
const modalEl = document.getElementById('moreInfoModal')!
const modal = new Modal(modalEl)

// should be able to be different depending on what eventListener used 
let clickedItem: any;
let index: any;

// function to find the index of the item clicked
const findIndex = () => {
  // save ID on clicked item to search for index
  const clickedID = clickedItem.dataset.id
  // search for index to get the rest of key values
  index = products.findIndex(product => product.id === Number(clickedID))
}



// empty array to put cartItems in 
let cartItems: ICartItems[] = []

// function to push clicked item to the cartItems array
const addToCart = () => {

  // put a new item in cart with qty 1, if there is no items added already
  if (!cartItems[0]) {
    cartItems.unshift({
      id: products[index].id,
      name: products[index].name,
      image: products[index].images.thumbnail,
      qty: 0,
      item_price: products[index].price,
      item_total: products[index].price
    })
  }

  // look for a product already in cart with the same id as the one being added
  let doubleID = cartItems.find(item => item.id === products[index].id)

  // find the index of the cart item that has the same id as the one being added,
  // instead of adding a new one, only add qty of that item and count item_total
  if (doubleID) {
    const index = cartItems.findIndex(product => product.id === doubleID?.id)
    cartItems[index].qty++
    cartItems[index].item_total = cartItems[index].qty * cartItems[index].item_price
  }
  // if no dublicates was found, put the item in cart with qty 1 
  else {
    cartItems.unshift({
      id: products[index].id,
      name: products[index].name,
      image: products[index].images.thumbnail,
      qty: 1,
      item_price: products[index].price,
      item_total: products[index].price
    })
  }

  // print out added items to cart
  document.querySelector('.offcanvas-body')!.innerHTML = cartItems
    .map(cartItem => `
    <div class="container cart-item">
          <div class="cart-img col-2">
            <img src="${URL}${cartItem.image}" alt="">
          </div>
          <br>
          <div class="cart-info col-10">
            <p class="cart-name">${cartItem.name}</p>
          </div>
        </div>
    `
    ).join('')


  // print out added items to cart
  document.querySelector('.offcanvas-body')!.innerHTML = cartItems
    .map(cartItem => `
    <div class="container cart-item">
          <div class="cart-img col-2">
            <img src="${URL}${cartItem.image}" alt="">
          </div>
          <br>
          <div class="cart-info col-9">
              <div class="product-name">
                <p class="cart-name">${cartItem.name}</p>
                <button title="trash" class="btn-trash" data-id="${cartItem.id}"><img data-id="${cartItem.id}" class="btn-trash" src="/node_modules/bootstrap-icons/icons/trash3.svg" alt="Bootstrap" width="20" height="20"></button>
              </div>
              <div class="qty">
                <button title="btnMinus" class="btn-minus" data-id="${cartItem.id}"><img data-id="${cartItem.id}" class="btn-minus" src="/node_modules/bootstrap-icons/icons/dash-circle.svg" alt="Bootstrap" width="25" height="25"></button>
                <p data-id="${cartItem.id}" class="product-qty">${cartItem.qty}</p>
                <button title="btnPlus" class="btn-plus" data-id="${cartItem.id}"><img data-id="${cartItem.id}" class="btn-plus" src="/node_modules/bootstrap-icons/icons/plus-circle-fill.svg" alt="Bootstrap" width="25" height="25"></button>
                <p class="product-sum">Totalt: ${cartItem.item_total}kr (${cartItem.item_price}kr/st)</p>
              </div>
          </div>
        </div>
    `
    ).join('')

  // print out 'fortsätt handla' and 'betala' buttons to cart
  document.querySelector('.offcanvas-body')!.innerHTML += `
  <div class="button-container">
  <button type="button" class="clr-button" data-bs-dismiss="offcanvas" aria-label="Close">Fortsätt handla</button>
  <button type="button" class="clr-button">Betala</button>
  </div>
  `
}

rowEl?.addEventListener('click', e => {

  // save e.target to clickedItem
  clickedItem = e.target as HTMLElement

  // if click on picture, card, name or price
  if (clickedItem.className !== "clr-button") {
    // call function to find index of products to print
    findIndex()
    // open modal
    modal.show()

    // print out headline to modal section
    document.querySelector('.heading-container')!.innerHTML = `<h2>${products[index].name}</h2>`

    // print modal to DOM
    document.querySelector('.modal-body')!.innerHTML = `
    <div class="container">
      <div class="row">        
        <div class="col-6">
          <img class="img-fluid modal-img" src="${URL}${products[index].images.large}" alt="">
          <h3 class="modal-title pt-3 text-center">${products[index].name}</h3>
        </div>
        <div class="col-6 modal-body text-center">
          <p class="text-center">Produktinformation<p>
          <p class="text-center">Artikel nr: ${products[index].id}</p>
              ${products[index].description}
          <p class="modal-price text-center">${products[index].price} kr</p>
          <button id="modal-button" class="text-center clr-button modal-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-basket" viewBox="0 0 16 16">
          <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
          </svg>Lägg till</button>
        </div>
      </div>
    </div>
        `
    // add button to cart through modal 'lägg till' button
    document.querySelector('.modal-button')?.addEventListener('click', () => {
      findIndex()
      addToCart()
    })
  }
  // add item to cart through card 'lägg till'-button
  else if (clickedItem.className === "clr-button") {
    findIndex()
    addToCart()
  }
})


// ** Add / subtract / delete items inside of cart ** 
document.querySelector('.offcanvas-body')?.addEventListener('click', e => {
  // change nr of products in cart
  let clickedBtn;
  let clickedID: any;
  clickedBtn = e.target as HTMLButtonElement

  // to be able to print out multiple qty i need to make an array of the elements
  const productQty = document.querySelectorAll('.product-qty')
  const productQtyArr = Array.from(productQty)
  const cartInfo = document.querySelectorAll('.cart-item')
  const cartInfoArr = Array.from(cartInfo)

  // only respond to button/img elements
  if (clickedBtn.tagName === 'BUTTON' || clickedBtn.tagName === 'IMG') {

    // when + is clicked
    if (clickedBtn.classList.contains('btn-plus')) {
      // get the product.id from the clicked product and save as index, add 1 to qty and print out new qty
      clickedID = clickedBtn.dataset.id
      index = cartItems.findIndex(product => product.id === Number(clickedID))
      cartItems[index].qty++;
      productQtyArr[index].innerHTML = `${cartItems[index].qty}`
    } else if (clickedBtn.classList.contains('btn-trash')) {
      // do the same with trashcan, but remove item from cartItems arr and delete el from DOM 
      clickedID = clickedBtn.dataset.id
      index = cartItems.findIndex(product => product.id === Number(clickedID))
      cartItems.splice(index, 1)
      console.log('trashcan clicked', cartInfoArr[index])
      cartInfoArr[index].remove()
    } else if (clickedBtn.classList.contains('btn-minus')) {
      // do the same with -, but instead subtract by 1 and delete el from DOM 
      clickedID = clickedBtn.dataset.id
      index = cartItems.findIndex(product => product.id === Number(clickedID))
      if (cartItems[index].qty > 1) {
        cartItems[index].qty--;
        productQtyArr[index].innerHTML = `${cartItems[index].qty}`
      } else {
        cartItems.splice(index, 1)
        cartInfoArr[index].remove()
      }
    }
  }
})