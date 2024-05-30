/*==================== SHOW MENU ====================*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)
    
    // Validate that variables exist
    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            // We add the show-menu class to the div tag with the nav__menu class
            nav.classList.toggle('show-menu')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader(){
    const nav = document.getElementById('header')
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 200) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL TOP ====================*/ 
function scrollTop(){
    const scrollTop = document.getElementById('scroll-top');
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 560) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '30px',
    duration: 2000,
    reset: true
});



sr.reveal(`.home__data, .home__img,
            .about__data, .about__img,
            .services__content, .menu__content,
            .app__data, .app__img,
            .contact__data, .contact__button,
            .footer__content`, {
    interval: 200
})

/*==================== for cart function ====================*/
document.addEventListener('DOMContentLoaded', function () {
    function updateCartCounter() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCounter = document.getElementById('cart-counter');
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalQuantity;
        console.log("Cart counter updated:", totalQuantity);
    }

    function addToCart(item) {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cartItems.find(cartItem => cartItem.name === item.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            item.quantity = 1;
            cartItems.push(item);
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartCounter();
        console.log("Item added to cart:", item);
    }

    function removeFromCart(itemName) {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems = cartItems.filter(cartItem => cartItem.name !== itemName);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartCounter();
        populateCartModal();
        console.log("Item removed from cart:", itemName);
    }

    function updateItemQuantity(itemName, change) {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cartItems.find(cartItem => cartItem.name === itemName);

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(itemName);
            } else {
                localStorage.setItem('cart', JSON.stringify(cartItems));
                populateCartModal();
            }
            console.log("Item quantity updated:", item);
        }
    }

    function populateCartModal() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cart-items');
        const totalItemsElement = document.getElementById('total-items');
        const totalPriceElement = document.getElementById('total-price');
        cartItemsContainer.innerHTML = '';

        let totalItems = 0;
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalItems += item.quantity;
            const priceInRupees = parseFloat(item.price.replace('₹', '')) * item.quantity;
            totalPrice += priceInRupees;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-detail">${item.detail}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-increase">+</button>
                </div>
                <p class="cart-item-price">₹${priceInRupees.toFixed(2)}</p>
                <button class="cart-item-remove">Remove</button>
            `;

            cartItemsContainer.appendChild(itemDiv);

            itemDiv.querySelector('.quantity-decrease').addEventListener('click', () => updateItemQuantity(item.name, -1));
            itemDiv.querySelector('.quantity-increase').addEventListener('click', () => updateItemQuantity(item.name, 1));
            itemDiv.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.name));
        });

        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = `₹${totalPrice.toFixed(2)}`;
        console.log("Cart modal populated with items:", cartItems);
    }

    const buttons = document.querySelectorAll('.menu__button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const item = {
                name: this.parentElement.querySelector('.menu__name').textContent,
                detail: this.parentElement.querySelector('.menu__detail').textContent,
                price: this.parentElement.querySelector('.menu__preci').textContent,
                imgSrc: this.parentElement.querySelector('.menu__img').src
            };
            addToCart(item);
        });
    });
    updateCartCounter();

    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');

    cartIcon.addEventListener('click', function () {
        populateCartModal();
        cartModal.style.display = 'block';
    });

    // Handle closing the cart modal
    closeButton.addEventListener('click', function () {
        cartModal.style.display = 'none';
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', function (event) {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    const backToShoppingButton = document.getElementById('back-to-shopping');
    backToShoppingButton.addEventListener('click', function () {
        cartModal.style.display = 'none';
    });

    const proceedToCheckoutButton = document.getElementById('proceed-to-checkout');
    proceedToCheckoutButton.addEventListener('click', function () {
        const address = document.getElementById('address').value.trim();
        const pincode = document.getElementById('pincode').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!address || !pincode || !phone) {
            alert('Please fill in all the required fields.');
            return;
        }

        sendWhatsAppMessage();
    });

    /*==================== sendWhatsAppMessage ====================*/
    function sendWhatsAppMessage() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        let orderDetails = '';
        let totalPrice = 0;
      
        cartItems.forEach(item => {
          const itemTotal = parseFloat(item.price.replace('₹', '')) * item.quantity;
          orderDetails += `${item.name}: ${item.quantity} x ₹${item.price.replace('₹', '')} = ₹${itemTotal.toFixed(2)}\n`;
          totalPrice += itemTotal;
        });
      
        const address = document.getElementById('address').value.trim();
        const pincode = document.getElementById('pincode').value.trim();
        const phone = document.getElementById('phone').value.trim();
      
        const message = `Order Details:\n${orderDetails}\nTotal Items: ${cartItems.length}\nTotal Price: ₹${totalPrice.toFixed(2)}\n\nAddress: ${address}\nPincode: ${pincode}\nPhone: ${phone}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/919616366415?text=${encodedMessage}`;
      
        console.log("Opening WhatsApp with URL:", whatsappURL);
        window.open(whatsappURL, '_blank');
      }
});
