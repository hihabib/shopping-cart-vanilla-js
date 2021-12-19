import data from './fake.js';

// Create product
const createProduct = (productId, productName, productImage, productPrice) => {
    // single product creation
    const product = document.createElement('div');
    product.classList.add('cart-item');
    product.innerHTML = 
       `<div class="row">
            <div class="col-md-7 center-item mx-auto">
            <img src="${productImage}" alt="${productName}">
            <h5>${productName}</h5>
            </div>
            <div class="col-md-5 center-item product" id="product-${productId}">
            <div class="input-group number-spinner">
                <button class="btn btn-default product-minus"><i class="fas fa-minus"></i></button>
                <input type="number" min="0" class="form-control text-center" value="1">
                <button  class="btn btn-default product-plus"><i class="fas fa-plus"></i></button>
            </div>
            <h5>$<span class="product-price">${productPrice}</span></h5>
            <img src="images/remove.png" alt="" class="remove-item">
            </div>
        </div>`;

        // Append product on #products element in HTML
        document.getElementById('products').appendChild(product);
}

// Get Total price
const totalPrice = () => {
    const tax = parseInt(document.getElementById('tax-amount').innerText);
    const subTotal = parseInt(document.getElementById('sub-total').innerText);

    // Total price  = tax + subtotal price
    document.getElementById('total-price').innerText = tax + subTotal;
}

// Get Subtotal Price
const subTotalPrice = () => {
    let productPrice = [];

    // Get all products price and push it in productPrice array
    document.querySelectorAll('.product-price').forEach(product => {
        productPrice.push(parseInt(product.innerText));
    });

    // subTotal price
    const subTotalAmount = productPrice.reduce((prev, next) => {
        return prev + next;
    });

    // Show subtotal Price
    document.getElementById('sub-total').innerText = subTotalAmount;

    // update total price after changing subtotal price
    totalPrice();
}

// Remove product by clicking on times(X) icon
const removeProduct = () => {
    document.querySelectorAll('.remove-item').forEach( element => {
        element.addEventListener('click', function(){

            // remove product
            this.closest('.cart-item').remove();
            try {

                // update sub total price at the time of removing product
                subTotalPrice();
            } catch(err){

                // Make all the amount zero at last stage of removing product
                document.getElementById('total-price').innerText = 0;
                document.getElementById('sub-total').innerText = 0;
                document.getElementById('tax-amount').innerText = 0;
            }
        });
    });
}

// Change quantity and price when click on plus or minus buttons
const changeQuantityAndPrice = (self, action, price, id) => {
    try {
        const productQuantityElement = self.closest(`#product-${id}`).querySelector('input[type="number"]');
        let productQuantity = parseInt(productQuantityElement.value);
        const productPriceElement = self.closest(`#product-${id}`).querySelector('h5 span');
        
        // check if the action is increment or decrement
        switch(action){
            case 'increment':
                productQuantityElement.value = productQuantity + 1;
                productQuantity = parseInt(productQuantityElement.value);
                break;
            case 'decrement':
                productQuantityElement.value = productQuantity > 1 ? productQuantity - 1 : 1;
                productQuantity = parseInt(productQuantityElement.value);
                break;
        }

        // update price of single product
        productPriceElement.innerText = price * productQuantity;

        // update subtotal price and total price at the time of changing cart quantity
        subTotalPrice();
    } catch(err){
    }
}

// Load at the time of page refreshing
window.onload = () => {
    data.map( datum => {
        datum.products.map(product => {
            createProduct( product.id, product.title, product.image, product.price);
            document.querySelectorAll('.product-plus').forEach(el => {
                el.addEventListener('click', function(){

                    // change quantity and price after clicking on plus button
                    changeQuantityAndPrice(this, 'increment', product.price, product.id)
                });
            })
            
            document.querySelectorAll('.product-minus').forEach(el => {
                el.addEventListener('click', function(){

                    // change quantity and price after clicking on minus button
                    changeQuantityAndPrice(this, 'decrement', product.price, product.id)
                });
            })
        });

        // Show tax
        document.getElementById('tax-amount').innerText = datum.tax;

        // Show subtotal price
        subTotalPrice();
    });

    // load element to remove product at the time of page loading
    removeProduct();
}