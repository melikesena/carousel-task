
//Code only runs on homepage
async function isHomePage() {
    try {
            if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
                return true;
            } else {
                console.log("wrong page");
                return false;
            }
    }
     catch (error) {
        console.error(error.message);
        return false;
    }
}


// Fetch the product list and log it to the console
async function getData() {
    const url = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
    try {
        const localData = localStorage.getItem("products");
        if (localData) {
            return JSON.parse(localData);
        }


        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        localStorage.setItem("products", JSON.stringify(result));
        console.log(result);
        return result;
    }   catch (error) {
        console.error(error.message);
        return [];
    }
    
}

const buildHtml = (products) => {
    const html = products.map(product => 
    {
        //If price and original price different then show discount
        const discount = product.original_price > product.price ? `<span class="discount">-${Math.round((product.original_price - product.price) / product.original_price) * 100}%</span>` : '';
        const originalPrice = product.original_price > product.price ? `<span class="original-price">$${product.original_price}</span>` : '';


        return  
        `
        <div class="product" data-url="${product.url}">
            <img src="${product.img}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p class="price">$${product.price} ${originalPrice} ${product.price} ${discount}</p>
        
        </div>
        `;
    }).join('');
    return html;

};

const createCarousel = (products) => {
    const carouselHtml =
    `
    <div class="carousel">
        <h2> Beğenebileceğinizi düşündüklerimiz </h2>
        <div class="carousel-container">
        ${buildHtml(products)}
        </div>
    </div>
    `;

    const section = document.querySelector('cx-page-slot[position="Section2A"]');
    if (section){
        section.insertAdjacentHTML = ('beforeend', carouselHtml);
    }
   
};

const setEvents = () => {
    const products = document.querySelectorAll('.carousel .product');

    products.forEach(product => {
        product.addEventListener('click', () => {
            const productUrl = product.dataset.url;
            if (productUrl) {
                window.open(productUrl, '_blank');
            }
        });
    });
            
};
         


