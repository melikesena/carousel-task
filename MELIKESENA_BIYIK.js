
function isHomePage() {
    const path = window.location.pathname.replace(/\/$/, ''); 
    return path === "" || path === "/index.html";
}





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
        const discount = product.original_price > product.price ? `<span class="discount">-${Math.round(((product.original_price - product.price) / product.original_price) * 100)}%</span>` : '';
        const originalPrice = product.original_price > product.price ? `<span class="original-price">$${product.original_price}</span>` : '';


        return `
        <div class="product" data-url="${product.url}" data-id="${product.id}">
            <img src="${product.img}" width="242" height="200" alt="${product.name}">
            <h2 class="product-item__brand-name">
                <b class="brand">${product.brand} - </b>
                <span class="description">${product.name}</span>
            </h2>
            <p class="price">$${product.price} ${originalPrice} ${discount}</p>
            <i class="heart-icon" title="Favorilere Ekle"></i>
            <i class="add-icon" title="Sepete Ekle">+</i>
        </div>
        `;
    }).join('');
    return html;

};

const createCarousel = (products) => {
    if (!(window.location.pathname === "/" || window.location.pathname === "/index.html")) return;
    const section = document.querySelector('cx-page-slot[position="Section2A"]');
    if (!section || document.querySelector('.carousel')) return;
    const carouselHtml =`
    <div class="carousel">
        <h2> Beğenebileceğinizi Düşündüklerimiz </h2>
        <div class="carousel-wrapper">
            <button class="carousel-btn prev">&lt;</button>
        <div class="carousel-container">

            ${buildHtml(products)}
        </div>
        <button class="carousel-btn next">&gt;</button>
        </div>
    </div>
    `;

        section.insertAdjacentHTML('beforebegin', carouselHtml);


    const carousel = section.previousElementSibling; 
    const container = carousel.querySelector('.carousel-container');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');

    const gap = 10;
    prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -(container.querySelector('.product').offsetWidth + gap), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: container.querySelector('.product').offsetWidth + gap, behavior: 'smooth' });
    });


   
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
    font-family: "Open Sans", sans-serif;
    }

    .carousel h2 {
        font-family: Quicksand-SemiBold;
        font-weight: 500; 
        font-size: clamp(18px, 2vw, 24px);
        line-height: 1.3;                     
        color: #212738;                      
        margin: 0 0 10px 0;                   
        text-align: left; 
    }

     .carousel-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .carousel-container {
        display: flex;
        overflow-x: auto;
        gap: 10px;
        padding: 0 20px;
        scroll-behavior: smooth;
        justify-content: flex-start;
        max-width: 100%;
        flex-wrap: nowrap;
    }

    .carousel-container::-webkit-scrollbar {
        display: none;
    }

    .carousel-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 44px;
        height: 44px;
        background-color: rgba(255,255,255,0.9);
        border: none;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 2px 2px rgba(0,0,0,0.2);
        cursor: pointer;
        font-size: 20px;
        z-index: 10;
        
    }

    .carousel-btn.prev {
     left: 0;
     position: absolute;
     top: 50%;
     transform: translateY(-50%);
      }
    .carousel-btn.next { right: 0;position: absolute;
     top: 50%;
     transform: translateY(-50%); }

    .product {
    flex: 0 0 auto;
    width: clamp(150px, 30%, 242px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #eee;
    margin: 8px;
    padding: 8px;
    box-sizing: border-box;
    background: #fff;
    position: relative;
    border-radius: 12px;
    overflow: hidden;



    }

    .product img {
    width: 100%;
    aspect-ratio: 242 / 200;    
    object-fit: contain;
    background-color: #fff;
    border-radius: 8px;
    display: block;
    margin: 0 auto;
    
    }

    .brand {
        font-family: 'Quicksand-Medium', sans-serif;
        font-size: 12px;
        color: #747881;
        margin: 5px 0 0;
    }

    .product-item__brand-name {
    font-family: 'Quicksand-Medium', sans-serif;
    gap: 4px;             
    font-size: 12px;
    line-height: 1.2;
    color: var(--Primary-Black);
}

.product-item__brand-name .brand {
    font-family: 'Quicksand-Medium', sans-serif;
    font-weight: bolder;
    white-space: nowrap;
    color: var(--Primary-Black);
}

.product-item__brand-name .description {
    font-family: 'Quicksand', sans-serif;
    font-weight: 500;
    color: var(--Primary-Black);    
    word-break: break-word;
}

    .product .add-icon {
    position: absolute;
    bottom: 10px;          
    right: 10px;
    width: 48px;           
    height: 48px;
    background-color: #fff; 
    color: #007bff;       
    border: 2px solid #fff; 
    border-radius: 50%;   
    font-size: 28px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    
    cursor: pointer;
    transition: all 0.3s ease;
    line-height: 1;
}


    .add-icon:hover {
    background-color: #007bff;    
    color: #fff;                  
    border-color: #fff;           
}



    .product-name {
        font-size: 14px;
        margin: 5px 0 5px;
        line-height: 1.2;
        color: #212738;
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
    font-family: 'Arial';
        position: absolute;
    top: 8px; 
    right: 8px; 
    width: 28px;
    height: 28px;
    border-radius: 50%; 
    background-color: #fff; 
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
    font-size: 16px;
        }

        .heart-icon::before {
        content: "\\2661"; 
        color: #ccc;
         font-size: 16px;
        transition: color 0.3s
        }

        .heart-icon:hover::before {
            color: orange;  
        }

        .heart-icon.filled::before {
            content: "\\2764"; 
            color: orange;
        }


    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
};        

(async function initCarousel() {
    if (!isHomePage()) {
        console.log("wrong page");
        if (existingCarousel) existingCarousel.remove();
        return;
    } 
    

    buildCSS();                     
    const products = await getData(); 

    createCarousel(products);        
    setEvents();                    
}

)();
