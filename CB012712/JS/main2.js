document.addEventListener('DOMContentLoaded', function() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    const totalPriceElement = document.querySelector('.total-price');
    const favBtn = document.getElementById('save');
    const loadBtn = document.getElementById('load');
    const customerNameInput = document.querySelector('#customerName');
    const addressInput = document.querySelector('#address');
    const contactInput = document.querySelector('#contact');
    const cardTypeSelect = document.querySelector('#cardType');
    const cardNumberInput = document.querySelector('#cardNumber');
    const cvvInput = document.querySelector('#cvv');
    const cancelBtn = document.getElementById('cancel');
    const payBtn = document.getElementById('pay');
    const quantityInputs = document.querySelectorAll('.quantity input');

    // Populating the Cart table from Local Storage
    function populateCartTable() {
        

        const cartData = JSON.parse(localStorage.getItem('cartData') || '[]');
        cartTableBody.innerHTML = ''; // Clear existing rows

        if (cartData.length === 0) {
            showEmptyCartMessage();
        } else {
            cartData.forEach(item => {
                const newRow = cartTableBody.insertRow();
                newRow.insertCell(0).innerText = item.productName;
                newRow.insertCell(1).innerText = item.productPrice;
                newRow.insertCell(2).innerText = item.productQuantity;
                newRow.insertCell(3).innerText = item.productTotal;
                const removeButton = document.createElement('button');
                removeButton.innerText = 'Remove';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', function() {
                    newRow.remove();
                    saveCartToLocalStorage();
                    updateTotalPrice();
                    if (cartTableBody.rows.length === 0) {
                        showEmptyCartMessage();
                    }
                });
                newRow.insertCell(4).appendChild(removeButton);
            });
        }
        updateTotalPrice();

    }

    // Function to update the total price
    function updateTotalPrice() {
        let totalPrice = 0;
        cartTableBody.querySelectorAll('tr').forEach(row => {
            const itemTotalPrice = parseFloat(row.cells[3].innerText.replace(' LKR', ''));
            totalPrice += itemTotalPrice;
        });
        totalPriceElement.innerText = `Total Price: ${totalPrice.toFixed(2)} LKR`;
    }

    // saving cart table to local storage
    function saveCartToLocalStorage() {
        const cartData = [];
        cartTableBody.querySelectorAll('tr').forEach(row => {
            const productName = row.cells[0].innerText;
            const productPrice = row.cells[2].innerText;
            const productQuantity = row.cells[1].querySelector('input').value;
            const productTotal = row.cells[3].innerText;
            cartData.push({ productName, productPrice, productQuantity, productTotal });
        });
        localStorage.setItem('cartData', JSON.stringify(cartData));
    }

    // function to save order details into local storage
    function saveFormToLocalStorage() {
        const cartData = [];
        cartTableBody.querySelectorAll('tr').forEach(row => {
            const productName = row.cells[0].innerText;
            const productPrice = row.cells[1].innerText;
            const productQuantity = row.cells[2].innerText;
            const productTotal = row.cells[3].innerText;
            cartData.push({ productName, productPrice, productQuantity, productTotal });
        });

        // saving the data into local storage
        const formData = {
            customerName: customerNameInput.value,
            address: addressInput.value,
            contact: contactInput.value,
            cardType: cardTypeSelect.value,
            cardNumber: cardNumberInput.value,
            cvv: cvvInput.value,
            cartData: cartData
        };

        localStorage.setItem('formData', JSON.stringify(formData));
    }

    // function to load saved favourite order from local storage 
    function loadFromLocalStorage() {
        const savedOrder = JSON.parse(localStorage.getItem('formData'));
        if (savedOrder) {
            // populating form fields with details from local storage
            customerNameInput.value = savedOrder.customerName || '';
            addressInput.value = savedOrder.address || '';
            contactInput.value = savedOrder.contact || '';
            cardTypeSelect.value = savedOrder.cardType || '';
            cardNumberInput.value = savedOrder.cardNumber || '';
            cvvInput.value = savedOrder.cvv || '';

            // populating the cart table with details from local storage
            cartTableBody.innerHTML = '';
            savedOrder.cartData.forEach(item => {
                const newRow = cartTableBody.insertRow();
                newRow.insertCell(0).innerText = item.productName;
                newRow.insertCell(1).innerText = item.productPrice;
                newRow.insertCell(2).innerText = item.productQuantity;
                newRow.insertCell(3).innerText = item.productTotal;
                const removeButton = document.createElement('button');
                removeButton.innerText = 'Remove';
                removeButton.classList.add('remove-button');
                removeButton.addEventListener('click', function() {
                    newRow.remove();
                    saveCartToLocalStorage();
                    updateTotalPrice();
                    if (cartTableBody.rows.length === 0) {
                        showEmptyCartMessage();
                    }
                });
                newRow.insertCell(4).appendChild(removeButton);
            });
            updateTotalPrice();
            alert('Favourites loaded successfully!');
        } else {
            alert('No saved favourites found.');
        }
    }


    // function to clear form inlcuding the cart table
    function clearForm() {
        // Clear input fields
        customerNameInput.value = '';
        addressInput.value = '';
        contactInput.value = '';
        cardTypeSelect.value = 'master';
        cardNumberInput.value = '';
        cvvInput.value = '';
        
        // Clear cart table
        cartTableBody.innerHTML = '';
        
        // Reset total price
        updateTotalPrice();
    }

    // function to validate user inputs
    function validateForm() {
        if (customerNameInput.value === '' || addressInput.value === '' || contactInput.value === '') {
            alert('Please provide all personal details.');
            return false;
        }
        if (cardNumberInput.value === '' || cvvInput.value === '') {
            alert('Please provide all card details.');
            return false;
        }
        if (cartTableBody.rows.length === 0 || cartTableBody.querySelector('.empty-cart-message')) {
            alert('Cart is empty. Add items to cart before paying.');
            return false;
        }
        return true;
    }
    
    // function to display a message to user with summary of order when payment is successful
    function displaySuccessMessage() {
        let items = '';
        cartTableBody.querySelectorAll('tr').forEach(row => {
            items += `${row.cells[0].innerText} - ${row.cells[2].innerText} x ${row.cells[1].innerText} (Total: ${row.cells[3].innerText})\n`;
        });
        const totalPrice = totalPriceElement.innerText;
        alert(`Thank you for your order!\n\nItems:\n${items}\n${totalPrice}`);
    }

    populateCartTable();

    // function to display a message when cart table is empty
    function showEmptyCartMessage() {
        const emptyMessageRow = cartTableBody.insertRow();
        const emptyMessageCell = emptyMessageRow.insertCell(0);
        emptyMessageCell.colSpan = 5;
        emptyMessageCell.innerText = 'Your cart is empty';
        emptyMessageCell.classList.add('empty-cart-message');
    }

    // Load favourites button functionality
    loadBtn.addEventListener('click', function(event) {
        event.preventDefault();
        loadFromLocalStorage();
    });

    // add to favourites button functionality
    favBtn.addEventListener('click', function(event) {
        event.preventDefault();
        saveFormToLocalStorage();
        alert('Order details saved to favourites.');
    });

    // cancel button functionality
    cancelBtn.addEventListener('click',function(event){
        event.preventDefault();
        clearForm();
        showEmptyCartMessage();
    })

     // pay button functionality with event listener
     payBtn.addEventListener('click', function(event){
        event.preventDefault();
        if(validateForm()){
            displaySuccessMessage();
            clearForm();
        }
    })
});
