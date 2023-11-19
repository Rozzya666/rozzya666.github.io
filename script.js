const closeBtn = document.getElementById('close-btn');
const openBtn = document.getElementById('open-menu');
const productInner = document.getElementById('product-container');
const filterMobileMenu = document.getElementById('filter-mobile-menu');
const darkTheme = document.getElementById('dark-theme');
const filterBtn = document.getElementById('filter-button');
const closeFilterBtn = document.getElementById('close-filter');
const closePopupMenu = document.getElementById('close-popup-menu');
const popup = document.getElementById('popup');
const popupInner = document.getElementById('popup-inner');
const previousPage = document.getElementById("previous_page");
const nextPage = document.getElementById("next_page");
const pagination = document.getElementById("pagination");
const totalPages = 10;
let currentPage = 1;

const handleProductSizeClick = (e) => {
    const btn = e.target.closest("button");
    const btnContainerSize = btn?.closest('#sizes');
    if (!btnContainerSize) {
        return;
    }
    const activeBtn = btnContainerSize.querySelector('.active');
    activeBtn?.classList.remove('active', 'bg-gray-900', 'text-white');
    btn.classList.add('active', 'bg-gray-900', 'text-white');
}

const handleProductColorClick = (e) => {
    const btn = e.target.closest("button");
    const btnContainerColor = btn?.closest('#colors');

    if (!btnContainerColor) {
        return;
    }

    const activeBtn = btnContainerColor.querySelector('.active');

    activeBtn?.classList.remove('active');
    activeBtn?.replaceChildren();
    btn.classList.add('active');
    btn.innerHTML = `
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5306 2.03063L5.5306 10.0306C5.46092 10.1005 5.37813 10.156 5.28696 10.1939C5.1958 10.2317 5.09806 10.2512 4.99935 10.2512C4.90064 10.2512 4.8029 10.2317 4.71173 10.1939C4.62057 10.156 4.53778 10.1005 4.4681 10.0306L0.968098 6.53063C0.898333 6.46087 0.842993 6.37804 0.805236 6.28689C0.76748 6.19574 0.748047 6.09804 0.748047 5.99938C0.748047 5.90072 0.76748 5.80302 0.805236 5.71187C0.842993 5.62072 0.898333 5.53789 0.968098 5.46813C1.03786 5.39837 1.12069 5.34302 1.21184 5.30527C1.30299 5.26751 1.40069 5.24808 1.49935 5.24808C1.59801 5.24808 1.69571 5.26751 1.78686 5.30527C1.87801 5.34302 1.96083 5.39837 2.0306 5.46813L4.99997 8.4375L12.4693 0.969379C12.6102 0.828483 12.8013 0.749329 13.0006 0.749329C13.1999 0.749329 13.391 0.828483 13.5318 0.969379C13.6727 1.11028 13.7519 1.30137 13.7519 1.50063C13.7519 1.69989 13.6727 1.89098 13.5318 2.03188L13.5306 2.03063Z" fill="white"/>
        </svg>
    `;
};

const buildColorSection = (product) => {
    const colors = product.options?.find(option => option.name == "Color");

    if (!colors || colors.values.length == 1) {
        return '';
    }

    const colorButtons = colors.values.map(color => `<button style="background-color:${color};" class="rounded-full flex justify-center items-center w-8 h-8"></button>`).join("");

    return `
        <div>
            <p class="pb-2">Select Colors</p>
            <div id="colors" class="flex gap-3 cursor-pointer">
                ${colorButtons}
            </div>
        </div>
    `;
};

const buildSizeSection = (product) => {
    const sizes = product.options?.find(option => option.name = "Size");

    if (!sizes || sizes.values.length == 1) {
        return '';
    }

    const sizeButtons = sizes.values.map(size => `<button class="py-2 px-4 rounded-2xl bg-gray-300">${size}</button>`).join("");

    return `
        <div>
            <p>Choose Size</p>
            <div id="sizes" class="flex flex-wrap gap-2">
                ${sizeButtons}
            </div>
        </div>
    `;
};

const fetchProducts = async () => {
    const response = await fetch(`https://voodoo-sandbox.myshopify.com/products.json?limit=9&page=${currentPage}`);

    if (!response.ok) {
        console.error('Error fetching products:', error);
        return;
    }

    const data = await response.json();

    productInner.innerHTML = '';

    renderProductTemplate(data.products);

    const productCards = productInner.querySelectorAll('.card-item');

    productCards.forEach((productCard, index) => {
        productCard.addEventListener('click', function () {
            const selectProduct = data.products[index];
            popup.classList.toggle('hidden');
            popupInner.innerHTML = renderPopupProductCard(selectProduct);
            const firstColorBtn = popupInner.querySelector('#colors > button');
            firstColorBtn?.click();
            const firstSizeBtn = popupInner.querySelector('#sizes > button');
            firstSizeBtn?.click();
        });
    });
};

function generatePagination(currentPagePagination) {
    pagination.innerHTML = "";

    nextPage.addEventListener("click", async () => {
        currentPage++;
        await fetchProducts(currentPage);
        const activePageBtn = pagination.querySelector('.active');
        const pageBtn = pagination.children[currentPage - 1];
        if (pageBtn) {
            activePageBtn?.classList.remove('active');
            pageBtn?.classList.add('active');
        }
        scrollTo(0, 100);
    });

    previousPage.addEventListener("click", async () => {
        currentPage--;
        await fetchProducts(currentPage);
        const activePageBtn = pagination.querySelector('.active');
        const pageBtn = pagination.children[currentPage - 1];
        if (pageBtn) {
            activePageBtn?.classList.remove('active');
            pageBtn?.classList.add('active');
        }
        scrollTo(0, 100);
    });

    for (let i = 1; i <= totalPages; i++) {
        const listItem = document.createElement("li");
        listItem.classList.add("pagination-item");

        if (i === currentPagePagination) {
            listItem.classList.add("active");
        }

        listItem.textContent = i;

        pagination.appendChild(listItem);

        listItem.addEventListener("click", async () => {
            currentPage = i;
            const activePageBtn = pagination.querySelector('.active');
            const pageBtn = pagination.children[currentPage - 1];
            if (pageBtn) {
                activePageBtn?.classList.remove('active');
                pageBtn?.classList.add('active');
            }
            await fetchProducts(i);
            scrollTo(0, 100);
        });
    }
}

const renderProductTemplate = (products) => {
    productInner.innerHTML = products.map((product) => renderProductCard(product)).join("");
}

const renderPopupProductCard = (product) => {
    return `
        <div class="flex gap-5 flex-wrap justify-center">
            <img class="h-auto" style="width: 280px" src="${product.images && product.images.length > 0
            ? product.images[0]?.src
            : "../images/no-image.jpg"
        }" alt="Image">
                <div class="about-item flex flex-col gap-2">
                    <h2 class="md:text-4xl font-black max-w-[620px] truncate">${product.title}</h2>
                    <svg width="197" height="25" viewBox="0 0 197 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.3562 0L15.8569 7.53796L24.1077 8.53794L18.0204 14.1966L19.619 22.3526L12.3562 18.3119L5.09341 22.3526L6.69201 14.1966L0.604756 8.53794L8.85555 7.53796L12.3562 0Z"
                            fill="#FFC633" />
                        <path
                            d="M44.1682 0L47.6689 7.53796L55.9197 8.53794L49.8324 14.1966L51.431 22.3526L44.1682 18.3119L36.9054 22.3526L38.504 14.1966L32.4168 8.53794L40.6676 7.53796L44.1682 0Z"
                            fill="#FFC633" />
                        <path
                            d="M75.9802 0L79.4809 7.53796L87.7317 8.53794L81.6444 14.1966L83.243 22.3526L75.9802 18.3119L68.7174 22.3526L70.316 14.1966L64.2288 8.53794L72.4796 7.53796L75.9802 0Z"
                            fill="#FFC633" />
                        <path
                            d="M107.793 0L111.293 7.53796L119.544 8.53794L113.457 14.1966L115.056 22.3526L107.793 18.3119L100.53 22.3526L102.129 14.1966L96.0413 8.53794L104.292 7.53796L107.793 0Z"
                            fill="#FFC633" />
                        <path
                            d="M131.737 22.3526L139 18.3119V0L135.499 7.53796L127.249 8.53793L133.336 14.1966L131.737 22.3526Z"
                            fill="#FFC633" />
                        <path
                            d="M161.8 19.3562V16.5402H155.736V15.5002L161.8 7.43622H162.92V15.5002H164.376V16.5402H162.92V19.3562H161.8ZM156.712 15.9642L156.568 15.5002H161.8V8.54022L162.2 8.65222L156.712 15.9642ZM166.726 19.3562V17.5962H168.006V19.3562H166.726ZM174.488 19.5482C173.87 19.5482 173.294 19.4415 172.76 19.2282C172.238 19.0149 171.779 18.7109 171.384 18.3162C170.99 17.9215 170.691 17.4522 170.488 16.9082L171.464 16.4282C171.71 17.0469 172.11 17.5375 172.664 17.9002C173.23 18.2522 173.838 18.4282 174.488 18.4282C175.011 18.4282 175.475 18.3055 175.88 18.0602C176.296 17.8149 176.622 17.4842 176.856 17.0682C177.091 16.6415 177.208 16.1669 177.208 15.6442C177.208 15.1002 177.086 14.6202 176.84 14.2042C176.606 13.7882 176.286 13.4629 175.88 13.2282C175.475 12.9829 175.016 12.8602 174.504 12.8602C173.982 12.8602 173.496 12.9829 173.048 13.2282C172.611 13.4629 172.291 13.7509 172.088 14.0922L171.08 13.9002L171.976 7.43622H178.008V8.55622H172.44L172.936 8.12422L172.216 13.2122L171.72 12.9882C172.094 12.5295 172.531 12.2042 173.032 12.0122C173.534 11.8095 174.046 11.7082 174.568 11.7082C175.336 11.7082 176.014 11.8895 176.6 12.2522C177.187 12.6042 177.646 13.0789 177.976 13.6762C178.318 14.2629 178.488 14.9189 178.488 15.6442C178.488 16.3802 178.312 17.0469 177.96 17.6442C177.619 18.2309 177.144 18.6949 176.536 19.0362C175.939 19.3775 175.256 19.5482 174.488 19.5482ZM179.548 21.2762L184.956 8.09222H186.348L180.94 21.2762H179.548Z"
                            fill="black" />
                        <path
                            d="M191.207 19.5482C190.588 19.5482 190.012 19.4415 189.479 19.2282C188.956 19.0149 188.498 18.7109 188.103 18.3162C187.708 17.9215 187.41 17.4522 187.207 16.9082L188.183 16.4282C188.428 17.0469 188.828 17.5375 189.383 17.9002C189.948 18.2522 190.556 18.4282 191.207 18.4282C191.73 18.4282 192.194 18.3055 192.599 18.0602C193.015 17.8149 193.34 17.4842 193.575 17.0682C193.81 16.6415 193.927 16.1669 193.927 15.6442C193.927 15.1002 193.804 14.6202 193.559 14.2042C193.324 13.7882 193.004 13.4629 192.599 13.2282C192.194 12.9829 191.735 12.8602 191.223 12.8602C190.7 12.8602 190.215 12.9829 189.767 13.2282C189.33 13.4629 189.01 13.7509 188.807 14.0922L187.799 13.9002L188.695 7.43622H194.727V8.55622H189.159L189.655 8.12422L188.935 13.2122L188.439 12.9882C188.812 12.5295 189.25 12.2042 189.751 12.0122C190.252 11.8095 190.764 11.7082 191.287 11.7082C192.055 11.7082 192.732 11.8895 193.319 12.2522C193.906 12.6042 194.364 13.0789 194.695 13.6762C195.036 14.2629 195.207 14.9189 195.207 15.6442C195.207 16.3802 195.031 17.0469 194.679 17.6442C194.338 18.2309 193.863 18.6949 193.255 19.0362C192.658 19.3775 191.975 19.5482 191.207 19.5482Z"
                            fill="black" fill-opacity="0.6" />
                    </svg>
                    <div class="flex gap-2 items-center">
                        <h5 class="font-black text-xl">$${product.variants && product.variants[0].compare_at_price && product.variants[0].compare_at_price != null ? product.variants[0].compare_at_price : "30"}</h5>
                        <h5 class="text-gray-400 font-black text-xl line-through">$${product.variants ? product.variants[0].price : "300"}</h5>
                        <span class="text-red-600 bg-red-200 px-2 rounded-xl">-40$</span>
                    </div>
                    <p class="max-w-[590px] opacity-60">${product.body_html ? product.body_html : "default description of our product"}</p>
                        ${buildColorSection(product)}
                    <div id="sizes">  
                        ${buildSizeSection(product)}
                    </div>
                    <div class="flex mt-5 justify-between gap-5 2xl:flex-wrap  md:justify-center">
                        <div class="counter items-center flex bg-gray-300 rounded-3xl py-2 px-4 gap-5">
                            <button>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.375 12C21.375 12.2984 21.2565 12.5845 21.0455 12.7955C20.8345 13.0065 20.5484 13.125 20.25 13.125H3.75C3.45163 13.125 3.16548 13.0065 2.9545 12.7955C2.74353 12.5845 2.625 12.2984 2.625 12C2.625 11.7016 2.74353 11.4155 2.9545 11.2045C3.16548 10.9935 3.45163 10.875 3.75 10.875H20.25C20.5484 10.875 20.8345 10.9935 21.0455 11.2045C21.2565 11.4155 21.375 11.7016 21.375 12Z" fill="black"/>
                                </svg>
                            </button>
                            <h6>1</h6>
                            <button>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M21.375 12C21.375 12.2984 21.2565 12.5845 21.0455 12.7955C20.8345 13.0065 20.5484 13.125 20.25 13.125H13.125V20.25C13.125 20.5484 13.0065 20.8345 12.7955 21.0455C12.5845 21.2565 12.2984 21.375 12 21.375C11.7016 21.375 11.4155 21.2565 11.2045 21.0455C10.9935 20.8345 10.875 20.5484 10.875 20.25V13.125H3.75C3.45163 13.125 3.16548 13.0065 2.9545 12.7955C2.74353 12.5845 2.625 12.2984 2.625 12C2.625 11.7016 2.74353 11.4155 2.9545 11.2045C3.16548 10.9935 3.45163 10.875 3.75 10.875H10.875V3.75C10.875 3.45163 10.9935 3.16548 11.2045 2.9545C11.4155 2.74353 11.7016 2.625 12 2.625C12.2984 2.625 12.5845 2.74353 12.7955 2.9545C13.0065 3.16548 13.125 3.45163 13.125 3.75V10.875H20.25C20.5484 10.875 20.8345 10.9935 21.0455 11.2045C21.2565 11.4155 21.375 11.7016 21.375 12Z"
                                        fill="black" />
                                </svg>
                            </button>
                        </div>
                        <button class="bg-black w-full text-white py-3 rounded-3xl" type="button">Add To Card</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const renderReccomendations = async (product) => {
    const requestRecommendations = await fetch(`https://voodoo-sandbox.myshopify.com/recommendations/products.json?product_id=${product.id}&intent=related  `);
    const data = await requestRecommendations.json();
}

const renderProductCard = (product) => {
    return `
        <div class="card-item flex flex-wrap flex-col gap-2 max-w-[280px]" >
            <div class="w-[280px] h-[320px]">
                <img  class="h-full w-full object-cover" src="${product.images[0]
            ? product?.images[0]?.src
            : "/images/no-image.jpg"
        }" alt="Image">
            </div>                      
            <div class="max-w-[230px]">
                <h4 class="font-semibold text-lg truncate">${product.title}</h4>
                <svg width="130" height="19" viewBox="0 0 130 19" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.24494 0L11.8641 5.63991L18.0374 6.38809L13.4829 10.6219L14.679 16.7243L9.24494 13.701L3.8109 16.7243L5.00697 10.6219L0.452479 6.38809L6.62573 5.63991L9.24494 0Z"
                        fill="#FFC633" />
                    <path
                        d="M33.0468 -6.10352e-05L35.666 5.63985L41.8393 6.38803L37.2848 10.6219L38.4809 16.7242L33.0468 13.7009L27.6128 16.7242L28.8089 10.6219L24.2544 6.38803L30.4276 5.63985L33.0468 -6.10352e-05Z"
                        fill="#FFC633" />
                    <path
                        d="M56.8487 -6.10352e-05L59.4679 5.63985L65.6412 6.38803L61.0867 10.6219L62.2827 16.7242L56.8487 13.7009L51.4147 16.7242L52.6107 10.6219L48.0562 6.38803L54.2295 5.63985L56.8487 -6.10352e-05Z"
                        fill="#FFC633" />
                    <path
                        d="M74.7641 16.7243L80.1981 13.701V0L77.5789 5.63991L71.4056 6.38809L75.9601 10.6219L74.7641 16.7243Z"
                        fill="#FFC633" />
                    <path
                        d="M97.3141 15.4129C96.7728 15.4129 96.2735 15.3196 95.8161 15.1329C95.3588 14.9463 94.9575 14.6803 94.6121 14.3349C94.2761 13.9896 94.0195 13.5789 93.8421 13.1029L94.7381 12.6829C94.9528 13.2243 95.2888 13.6536 95.7461 13.9709C96.2035 14.2789 96.7261 14.4329 97.3141 14.4329C97.7808 14.4329 98.1961 14.3443 98.5601 14.1669C98.9241 13.9803 99.2088 13.7143 99.4141 13.3689C99.6195 13.0236 99.7221 12.6036 99.7221 12.1089C99.7221 11.6143 99.6148 11.1943 99.4001 10.8489C99.1948 10.5036 98.9101 10.2423 98.5461 10.0649C98.1821 9.8876 97.7668 9.79893 97.3001 9.79893C97.1788 9.79893 97.0435 9.8036 96.8941 9.81293C96.7541 9.82227 96.6375 9.83627 96.5441 9.85493L96.3201 9.36493L99.1341 5.79493H94.3321V4.81493H100.394V5.79493L97.7621 9.11293L97.6221 8.93093C98.2475 8.9496 98.8028 9.09893 99.2881 9.37893C99.7735 9.6496 100.151 10.0183 100.422 10.4849C100.702 10.9516 100.842 11.4929 100.842 12.1089C100.842 12.7249 100.693 13.2849 100.394 13.7889C100.095 14.2836 99.6801 14.6803 99.1481 14.9789C98.6161 15.2683 98.0048 15.4129 97.3141 15.4129ZM103.171 15.2449V13.7049H104.291V15.2449H103.171ZM109.963 15.4129C109.422 15.4129 108.918 15.3196 108.451 15.1329C107.994 14.9463 107.593 14.6803 107.247 14.3349C106.902 13.9896 106.641 13.5789 106.463 13.1029L107.317 12.6829C107.532 13.2243 107.882 13.6536 108.367 13.9709C108.862 14.2789 109.394 14.4329 109.963 14.4329C110.421 14.4329 110.827 14.3256 111.181 14.1109C111.545 13.8963 111.83 13.6069 112.035 13.2429C112.241 12.8696 112.343 12.4543 112.343 11.9969C112.343 11.5209 112.236 11.1009 112.021 10.7369C111.816 10.3729 111.536 10.0883 111.181 9.88293C110.827 9.66827 110.425 9.56093 109.977 9.56093C109.52 9.56093 109.095 9.66827 108.703 9.88293C108.321 10.0883 108.041 10.3403 107.863 10.6389L106.981 10.4709L107.765 4.81493H113.043V5.79493H108.171L108.605 5.41693L107.975 9.86893L107.541 9.67293C107.868 9.2716 108.251 8.98693 108.689 8.81893C109.128 8.6416 109.576 8.55293 110.033 8.55293C110.705 8.55293 111.298 8.7116 111.811 9.02893C112.325 9.33693 112.726 9.75227 113.015 10.2749C113.314 10.7883 113.463 11.3623 113.463 11.9969C113.463 12.6409 113.309 13.2243 113.001 13.7469C112.703 14.2603 112.287 14.6663 111.755 14.9649C111.233 15.2636 110.635 15.4129 109.963 15.4129ZM114.39 16.9249L119.122 5.38893H120.34L115.608 16.9249H114.39Z"
                        fill="black" />
                    <path
                        d="M124.592 15.4129C124.051 15.4129 123.547 15.3196 123.08 15.1329C122.623 14.9463 122.221 14.6803 121.876 14.3349C121.531 13.9896 121.269 13.5789 121.092 13.1029L121.946 12.6829C122.161 13.2243 122.511 13.6536 122.996 13.9709C123.491 14.2789 124.023 14.4329 124.592 14.4329C125.049 14.4329 125.455 14.3256 125.81 14.1109C126.174 13.8963 126.459 13.6069 126.664 13.2429C126.869 12.8696 126.972 12.4543 126.972 11.9969C126.972 11.5209 126.865 11.1009 126.65 10.7369C126.445 10.3729 126.165 10.0883 125.81 9.88293C125.455 9.66827 125.054 9.56093 124.606 9.56093C124.149 9.56093 123.724 9.66827 123.332 9.88293C122.949 10.0883 122.669 10.3403 122.492 10.6389L121.61 10.4709L122.394 4.81493H127.672V5.79493H122.8L123.234 5.41693L122.604 9.86893L122.17 9.67293C122.497 9.2716 122.879 8.98693 123.318 8.81893C123.757 8.6416 124.205 8.55293 124.662 8.55293C125.334 8.55293 125.927 8.7116 126.44 9.02893C126.953 9.33693 127.355 9.75227 127.644 10.2749C127.943 10.7883 128.092 11.3623 128.092 11.9969C128.092 12.6409 127.938 13.2243 127.63 13.7469C127.331 14.2603 126.916 14.6663 126.384 14.9649C125.861 15.2636 125.264 15.4129 124.592 15.4129Z"
                        fill="black" fill-opacity="0.6" />
                </svg>
                <h4 class="font-semibold text-lg ">${product.variants[0].price ? product.variants[0].price : ''}$</h4>
            </div>                        
        </div>
    `;
};

openBtn.addEventListener('click', () => {
    document.getElementById('parent-menu').classList.toggle('hidden');
});

closeBtn.addEventListener('click', () => {
    document.getElementById('parent-menu').classList.toggle('hidden');
});

filterBtn.addEventListener('click', () => {
    filterMobileMenu.classList.toggle('hidden');
    darkTheme.classList.toggle('hidden');
});

closeFilterBtn.addEventListener('click', () => {
    filterMobileMenu.classList.toggle('hidden');
    darkTheme.classList.toggle('hidden');
});

closePopupMenu.addEventListener('click', () => {
    popup.classList.toggle('hidden');
});

popupInner.addEventListener('click', handleProductSizeClick);
popupInner.addEventListener('click', handleProductColorClick);

fetchProducts(1);
generatePagination(1);
