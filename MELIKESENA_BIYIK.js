
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


        return `
        <div class="product" data-url="${product.url}" data-id="${product.id}">
            <img src="${product.img}" width="242" height="200" alt="${product.name}">
            <h2>${product.name}</h2>
            <p class="price">$${product.price} ${originalPrice} ${discount}</p>
            <i class="heart-icon" title="Favorilere Ekle"></i>
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
        section.insertAdjacentHTML('beforeend', carouselHtml);
    }
   
};

const showPlaceholder = (count) => {
    const container = document.querySelector('.carousel-container');
    for (let i = 0; i < count; i++) {
        container.insertAdjacentHTML('beforeend', '<div class="product"> <img alt ="placeholder"> <h2 style="background:#f2f2f2;height:20px;"></h2> <p class="price" style="background:#f2f2f2;height:16px;"></p> </div>');
    };
};

const renderProducts = (products) => {
    const container = document.querySelector('.carousel-container');
  container.innerHTML = products.map(p => `
    <div class="product" data-id="${p.id}" data-url="${p.url}">
      <img src="${p.img}" width="242" height="200" alt="${p.name}">
      <h2>${p.name}</h2>
      <p class="price">$${p.price}</p>
      <i class="heart-icon"></i>
    </div>
  `).join('');
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

    const heartIcons = document.querySelectorAll('.heart-icon');
    let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];


    heartIcons.forEach(icon => {
        const productId = icon.parentElement.dataset.id;

        if (favoriteProducts.includes(productId)) icon.classList.add('filled');
        icon.addEventListener('click', (event) => {
            event.stopPropagation(); 
            if (favoriteProducts.includes(productId)) {
                favoriteProducts = favoriteProducts.filter(id => id !== productId);
                icon.classList.remove('filled');
            } else {
                favoriteProducts.push(productId);
                icon.classList.add('filled');
            }

            localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
            
            
        });
    });
            
};

const buildCSS = () => {

    const css = `

    .carousel {
    display: flex;
        flex-direction: column;
        margin: 20px 0;
    }

    .carousel h2 {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .carousel-container {
        display: flex;
        overflow-x: auto;
        gap: 10px;
        padding-bottom: 10px;
    }

    .carousel-container::-webkit-scrollbar {
        display: none;
    }

    .product {
    width: 242px;
    height: 557px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #eee;
    margin: 8px;
    padding: 8px;
    box-sizing: border-box;
    font-family: "Quicksand-Medium", sans-serif;

    }

    .product img {
    width: 100%;
    height: 35%;    
    object-fit: cover;
    background-color: #f2f2f2;
    border-radius: 8px;
    }

    .product h2 {
        font-size: 14px;
        margin: 10px 0 5px;
        line-height: 1.2;
    }

    .price {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        font-size: 14px;
        font-weight: bold;
        color: #212738;
    }

    .original-price {
        text-decoration: line-through;
        color: #212738;
        font-weight: normal;
        font-size: 12px;
    }

    .discount {
        color: #212738;
        font-size: 12px;
        font-weight: normal;
    } 


    .heart-icon {
            display: inline-block;
            width: 24px;
            height: 24px;
            border: 2px solid #ccc;
            border-radius: 50%;
            background-color: transparent; 
            position: relative;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 8px;
        }

        .heart-icon::before {
            content: "\\2661";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ccc; 
            font-size: 20px;
        }

        .heart-icon:hover::before {
            color: orange;  
        }

        .heart-icon.filled::before {
            content: "\\2665"; 
            color: orange;
        }


    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
};        

(async function initCarousel() {
    if (!(await isHomePage())) return; 

    buildCSS();                     
    const products = await getData(); 

    createCarousel(products);        
    setEvents();                    
})();


