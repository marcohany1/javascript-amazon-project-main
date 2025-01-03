import { cart } from '../../data/cart.js'
import { getProduct } from '../../data/products.js'
import { getDeliveryOption } from '../../data/deliveryOptions.js'
import { formatCurrency } from '../utils/money.js'

export function renderPaymentSummary() {
  let totalQuantity = 0
  let paymentSummaryHtml = ''
  let ProductPriceCents = 0
  let deliveryPrice = 0

  cart.forEach((cartItem) => {
    const matchingProduct = getProduct(cartItem.productId)
    ProductPriceCents += matchingProduct.priceCents * cartItem.quantity
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId)
    deliveryPrice += deliveryOption.priceCents
    totalQuantity += cartItem.quantity
  })
  const priceInDollars = formatCurrency(ProductPriceCents)
  const PricePlusShipment = (
    Number(formatCurrency(deliveryPrice)) + Number(priceInDollars)
  ).toFixed(2)
  const orderTotal = (
    Number(priceInDollars) +
    Number(formatCurrency(deliveryPrice)) +
    Number(priceInDollars * 0.1)
  ).toFixed(2)
  paymentSummaryHtml += `
          <div class="payment-summary-row">
            <div>Items (${totalQuantity}):</div>
            <div class="payment-summary-money">$${priceInDollars || 0}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
              deliveryPrice
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${PricePlusShipment}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(
              priceInDollars * 0.1
            ).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${orderTotal}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
        `

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHtml
}
// renderPaymentSummary()
