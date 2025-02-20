import React from 'react'
import boxIcon from "../../icons/box.svg";

const OrderSummary = () => {
    return (
        <div className='orderSummaryContainer'>
            <h2>Order Summary</h2>
            <div className='deliveryOrderDetails'>
                <div><img src={boxIcon} className='boxBorder' height="25px" /></div>
                <div>
                    <span>Option A</span> <br />
                    <div>
                        <span className='greyText'>Arrives in 8 days &#x2022;</span>
                        <span className='carbonText'> Lowest Carbon Emission</span>
                    </div>
                </div>
                <div>$10.00</div>
            </div>

            <div className='orderSubTotal'>
                <p className='greyText'>Subtotal</p>
                <p>$320.00</p>
            </div>

            <div className='orderShipping'>
                <p className='greyText'>Shipping</p>
                <p>$10.00</p>
            </div>

            <div className='promoContainer'>
                <h3>Promo code</h3>
                <input type="text" placeholder='Enter code' className='promoCodeInput' />
                <button className='paymentBtn'>Continue to payment</button>
            </div>
        </div>
    )
}

export default OrderSummary
