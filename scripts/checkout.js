import { cart, removeFromCart, updateDeliveryOption } from '../data/cart.js'
import { products } from '../data/products.js'
import { formatCurrency } from './utils/money.js'
import { deliveryOptions } from '../data/deliveryOptions.js'
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
// Function to update the number of items in the checkout header
function updateCheckoutHeader() {
  let totalItems = 0
  cart.forEach((cartItem) => {
    totalItems += cartItem.quantity
  })
  const checkoutHeaderLink = document.querySelector('.js-return-to-home-link')
  checkoutHeaderLink.textContent = `${totalItems} items`
}
function renderOrderSummary() {
  let cartSummaryHtml = ''
  cart.forEach((cartItem) => {
    const productId = cartItem.productId
    const deliveryOptionId = cartItem.deliveryOptionId
    let deliveryOption
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option
      }
    })
    const today = dayjs()
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days')
    const dateString = deliveryDate.format('dddd, MMMM D')
    products.forEach((product) => {
      let matchingProduct
      if (product.id === productId) {
        matchingProduct = product

        cartSummaryHtml += `
     <div class="cart-item-container js-cart-item-container-${
       matchingProduct.id
     }">
            <div class="delivery-date js-delivery-date">Delivery Date: ${dateString} </div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                 ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${
                    cartItem.quantity
                  }</span> </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options js-delivery-options">
               <div class="delivery-options-title">
                  Choose a delivery option:
               </div>
               ${deliveryOptionsHtml(matchingProduct, cartItem)}
              </div>
            </div>
          </div>`
      }
    })
  })

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml

  document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId
      removeFromCart(productId)
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      )
      container.remove()
      updateCheckoutHeader()
    })
  })

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset
      updateDeliveryOption(productId, deliveryOptionId)
      renderOrderSummary()
    })
  })

  updateCheckoutHeader()
}
renderOrderSummary()

function deliveryOptionsHtml(matchingProduct, cartItem) {
  let deliveryHtml = ''
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs()
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days')
    const dateString = deliveryDate.format('dddd, MMMM D')
    const deliveryPrice =
      deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)}`
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId

    deliveryHtml += `
    
  <div class="delivery-option js-delivery-option" data-product-id="${
    matchingProduct.id
  }" data-delivery-option-id="${deliveryOption.id}">  
    <input
      type="radio"
      class="delivery-option-input"
      name="delivery-option-${matchingProduct.id}"
      ${isChecked ? 'checked' : ''}
    />
    <div>
      <div class="delivery-option-date">${dateString}</div>
      <div class="delivery-option-price">${deliveryPrice} - Shipping</div>
    </div>
  </div>`
  })
  return deliveryHtml
}
