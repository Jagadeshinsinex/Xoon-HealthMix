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
// const sr = ScrollReveal({
//     origin: 'top',
//     distance: '30px',
//     duration: 1000,
//     reset: true
// });



// sr.reveal(`.home__data, .home__img,
//             .about__data, .about__img,
//             .services__content, .menu__content,
//             .app__data, .app__img,
//             .contact__data, .contact__button,
//             .footer__content`, {
//     interval: 200
// })

/*==================== for cart function ====================*/
document.addEventListener('DOMContentLoaded', function () {
    const cart = {
        items: [],
        addItem(item) {
            const existingItem = this.items.find(cartItem => cartItem.name === item.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                item.quantity = 1;
                this.items.push(item);
            }
            this.save();
            updateCartCounter();
            console.log("Item added to cart:", item);
        },
        removeItem(itemName) {
            this.items = this.items.filter(cartItem => cartItem.name !== itemName);
            this.save();
            updateCartCounter();
            populateCartModal();
            console.log("Item removed from cart:", itemName);
        },
        updateQuantity(itemName, change) {
            const item = this.items.find(cartItem => cartItem.name === itemName);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    this.removeItem(itemName);
                } else {
                    this.save();
                    populateCartModal();
                }
                console.log("Item quantity updated:", item);
            }
        },
        save() {
            localStorage.setItem('cart', this.items.map(item => `${item.name},${item.detail},${item.price},${item.imgSrc},${item.quantity}`).join('|'));
        },
        load() {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                this.items = savedCart.split('|').map(itemStr => {
                    const [name, detail, price, imgSrc, quantity] = itemStr.split(',');
                    return { name, detail, price, imgSrc, quantity: parseInt(quantity) };
                });
            }
        },
        getTotalQuantity() {
            return this.items.reduce((total, item) => total + item.quantity, 0);
        },
        getTotalPrice() {
            return this.items.reduce((total, item) => total + (parseFloat(item.price.replace('₹', '')) * item.quantity), 0);
        }
    };

    function updateCartCounter() {
        const cartCounter = document.getElementById('cart-counter');
        cartCounter.textContent = cart.getTotalQuantity();
        console.log("Cart counter updated:", cart.getTotalQuantity());
    }

    function populateCartModal() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalItemsElement = document.getElementById('total-items');
        const totalPriceElement = document.getElementById('total-price');
        cartItemsContainer.innerHTML = ''; 

        for (const item of cart.items) {
            const priceInRupees = parseFloat(item.price.replace('₹', '')) * item.quantity;

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

            itemDiv.querySelector('.quantity-decrease').addEventListener('click', () => cart.updateQuantity(item.name, -1));
            itemDiv.querySelector('.quantity-increase').addEventListener('click', () => cart.updateQuantity(item.name, 1));
            itemDiv.querySelector('.cart-item-remove').addEventListener('click', () => cart.removeItem(item.name));
        }

        totalItemsElement.textContent = cart.getTotalQuantity();
        totalPriceElement.textContent = `₹${cart.getTotalPrice().toFixed(2)}`;
        console.log("Cart modal populated with items:", cart.items);
    }

    // adding items
    const buttons = document.querySelectorAll('.menu__button, .add-to-cart');
    for (const button of buttons) {
        button.addEventListener('click', function () {
            const item = {
                name: this.parentElement.querySelector('.menu__name').textContent,
                detail: this.parentElement.querySelector('.menu__detail').textContent,
                price: this.parentElement.querySelector('.menu__price').textContent,
                imgSrc: this.parentElement.querySelector('.menu__img').src
            };
            cart.addItem(item);
        });
    }

    // Update cart 
    cart.load();
    updateCartCounter();

    // cart icon click
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');

    cartIcon.addEventListener('click', function () {
        populateCartModal();
        cartModal.style.display = 'block';
    });

    closeButton.addEventListener('click', function () {
        cartModal.style.display = 'none';
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', function (event) {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Handle back to shopping button
    const backToShoppingButton = document.getElementById('back-to-shopping');
    backToShoppingButton.addEventListener('click', function () {
        cartModal.style.display = 'none';
    });

    // Handle proceed to checkout button
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

    // Function to send WhatsApp message with order details
    function sendWhatsAppMessage() {
        let orderDetails = '';
        let totalPrice = 0;

        for (const item of cart.items) {
            const itemTotal = parseFloat(item.price.replace('₹', '')) * item.quantity;
            orderDetails += `${item.name}: ${item.quantity} x ₹${item.price.replace('₹', '')} = ₹${itemTotal.toFixed(2)}\n`;
            totalPrice += itemTotal;
        }

        const address = document.getElementById('address').value.trim();
        const pincode = document.getElementById('pincode').value.trim();
        const phone = document.getElementById('phone').value.trim();

        const message = `Order Details:\n${orderDetails}\nTotal Items: ${cart.items.length}\nTotal Price: ₹${totalPrice.toFixed(2)}\n\nAddress: ${address}\nPincode: ${pincode}\nPhone: ${phone}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/919616366415?text=${encodedMessage}`;

        console.log("Opening WhatsApp with URL:", whatsappURL);
        window.open(whatsappURL, '_blank');
    }
});
// *******************
// **JS for Products**
// *******************



// for zooming Image

const Default = {
    initialZoom: 1.5,
    minZoom: 1.25,
    maxZoom: 4,
    zoomSpeed: 0.01
};
class Zoomable {
    constructor(element, config) {
        this.element = element;
        this.config = this._mergeConfig(config);
        const { initialZoom, minZoom, maxZoom } = this.config;
        this.zoomed = false;
        this.initialZoom = Math.max(Math.min(initialZoom, maxZoom), minZoom);
        this.zoom = this.initialZoom;
        this.img = element.querySelector(".zoomable__img");
        this.img.draggable = false;
        this.element.style.setProperty("--zoom", this.initialZoom);
        this._addEventListeners();
    }
    static get Default() {
        return Default;
    }
    _addEventListeners() {
        this.element.addEventListener("mouseover", () => this._handleMouseover());
        this.element.addEventListener("mousemove", (evt) => this._handleMousemove(evt));
        this.element.addEventListener("mouseout", () => this._handleMouseout());
        this.element.addEventListener("wheel", (evt) => this._handleWheel(evt));
        this.element.addEventListener("touchstart", (evt) => this._handleTouchstart(evt));
        this.element.addEventListener("touchmove", (evt) => this._handleTouchmove(evt));
        this.element.addEventListener("touchend", () => this._handleTouchend());
    }
    _handleMouseover() {
        if (this.zoomed) return;
        this.element.classList.add("zoomable--zoomed");
        this.zoomed = true;
    }
    _handleMousemove(evt) {
        if (!this.zoomed) return;
        const elPos = this.element.getBoundingClientRect();
        const percentageX = `${((evt.clientX - elPos.left) * 100) / elPos.width}%`;
        const percentageY = `${((evt.clientY - elPos.top) * 100) / elPos.height}%`;
        this.element.style.setProperty("--zoom-pos-x", percentageX);
        this.element.style.setProperty("--zoom-pos-y", percentageY);
    }
    _handleMouseout() {
        if (!this.zoomed) return;
        this.element.style.setProperty("--zoom", this.initialZoom);
        this.element.classList.remove("zoomable--zoomed");
        this.zoomed = false;
    }
    _handleWheel(evt) {
        if (!this.zoomed) return;
        evt.preventDefault();
        const newZoom = this.zoom + evt.deltaY * (this.config.zoomSpeed * -1);
        const { minZoom, maxZoom } = this.config;
        this.zoom = Math.max(Math.min(newZoom, maxZoom), minZoom);
        this.element.style.setProperty("--zoom", this.zoom);
    }
    _handleTouchstart(evt) {
        evt.preventDefault();
        this._handleMouseover();
    }
    _handleTouchmove(evt) {
        if (!this.zoomed) return;
        const elPos = this.element.getBoundingClientRect();
        let percentageX = ((evt.touches[0].clientX - elPos.left) * 100) / elPos.width;
        let percentageY = ((evt.touches[0].clientY - elPos.top) * 100) / elPos.height;
        percentageX = Math.max(Math.min(percentageX, 100), 0);
        percentageY = Math.max(Math.min(percentageY, 100), 0);
        this.element.style.setProperty("--zoom-pos-x", `${percentageX}%`);
        this.element.style.setProperty("--zoom-pos-y", `${percentageY}%`);
    }
    _handleTouchend() {
        this._handleMouseout();
    }
    _mergeConfig(config) {
        return {
            ...this.constructor.Default,
            ...(typeof config === "object" ? config : {})
        };
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const zoomables = document.querySelectorAll(".zoomable");
    for (const el of zoomables) {
        new Zoomable(el);
    }
});

// for Description more/less


document.getElementById('toggleButton').addEventListener('click', function() {
    var description = document.querySelector('.description');
    if (description.classList.contains('expanded')) {
        description.classList.remove('expanded');
        this.textContent = 'View more';
    } else {
        description.classList.add('expanded');
        this.textContent = 'View less';
    }
});


// benefits

function openTab(evt, tabName) {
    var i, tabcontent, tabbuttons;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Benefits").style.display = "flex";
});

function showTab(index) {
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    tabs[index].classList.add('active');
    contents[index].classList.add('active');
}

 // Quantity update function 
 function newQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    currentValue += change;
    if (currentValue < 1) currentValue = 1;
    quantityInput.value = currentValue;
}

function addToCart() {
    console.log('Item added to cart');   
}
function handleAddToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);
    for (let i = 0; i < quantity-1; i++) {
        document.querySelector('.add-to-cart').click();
    }
}



if (window.location.pathname === '/page-where-needed') {
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/scrollreveal';
    document.head.appendChild(script);

    script.onload = function() {
      ScrollReveal().reveal('.reveal');
    };
  }
