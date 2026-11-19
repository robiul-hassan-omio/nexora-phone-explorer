// Exact endpoints used in the teacher's reference project: js/store.js
const PHONE_SEARCH_ENDPOINT = 'https://openapi.programming-hero.com/api/phones?search=';
const PHONE_DETAILS_ENDPOINT = 'https://openapi.programming-hero.com/api/phone/';
const DEFAULT_SEARCH = 'iphone';
const REQUEST_TIMEOUT = 12000;

const phoneGrid = document.getElementById('phone-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('phone-search');
const resultsHeading = document.getElementById('results-heading');
const resultCount = document.getElementById('result-count');
const apiStatus = document.getElementById('api-status');
const modal = document.getElementById('phone-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const menuToggle = document.getElementById('menu-toggle');
const themeToggle = document.getElementById('theme-toggle');
const mainNav = document.querySelector('.main-nav');
const authOpen = document.getElementById('auth-open');
const authModal = document.getElementById('auth-modal');
const authClose = document.getElementById('auth-close');
const authTriggerLabel = document.getElementById('auth-trigger-label');
const authFormsShell = document.getElementById('auth-forms-shell');
const authSession = document.getElementById('auth-session');
const authSessionName = document.getElementById('auth-session-name');
const authFeedback = document.getElementById('auth-feedback');
const authToast = document.getElementById('auth-toast');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authHeading = document.getElementById('auth-heading');
const authSubheading = document.getElementById('auth-subheading');
const authSwitchCopy = document.getElementById('auth-switch-copy');

let currentSearch = DEFAULT_SEARCH;
let lastFocusedElement = null;
let activeSearchController = null;
let latestSearchId = 0;

// The built-in catalogue keeps the project usable if the class API is offline.
// These are clearly labelled preview entries, not live API responses.
const PREVIEW_PHONES = [
  {
    phone_name: 'iPhone 16 Pro Max', brand: 'Apple', slug: 'preview-iphone-16-pro-max',
    image: 'https://images.fravega.com/f1000/b0f5e83b08971961b1b92c9842f8a124.jpg', isPreview: true,
    mainFeatures: { displaySize: '6.9-inch OLED (preview)', chipSet: 'A18 Pro (preview)', memory: '8 GB (preview)', storage: '256 GB (preview)', sensors: 'Face ID, accelerometer (preview)' },
    releaseDate: '2024 (preview)', others: { Bluetooth: 'Bluetooth 5.3 (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'iPhone 16', brand: 'Apple', slug: 'preview-iphone-16',
    image: 'https://cdn.mafrservices.com/pim-content/UAE/media/product/2201987/1726031405/2201987_main.jpg', isPreview: true,
    mainFeatures: { displaySize: '6.1-inch OLED (preview)', chipSet: 'A18 (preview)', memory: '8 GB (preview)', storage: '128 GB (preview)', sensors: 'Face ID (preview)' },
    releaseDate: '2024 (preview)', others: { Bluetooth: 'Bluetooth 5.3 (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'iPhone 15 Pro', brand: 'Apple', slug: 'preview-iphone-15-pro',
    image: 'https://icenter.pt/cdn/shop/files/iPhone_15_Pro_Natural_1197x1197.jpg?v=1708101185', isPreview: true,
    mainFeatures: { displaySize: '6.1-inch OLED (preview)', chipSet: 'A17 Pro (preview)', memory: '8 GB (preview)', storage: '128 GB (preview)', sensors: 'Face ID (preview)' },
    releaseDate: '2023 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'Samsung Galaxy S25 Ultra', brand: 'Samsung', slug: 'preview-samsung-galaxy-s25-ultra',
    image: 'https://mobile-rooms.ru/d/1_463655.jpg', isPreview: true,
    mainFeatures: { displaySize: '6.9-inch AMOLED (preview)', chipSet: 'Snapdragon 8 Elite (preview)', memory: '12 GB (preview)', storage: '256 GB (preview)', sensors: 'Fingerprint, accelerometer (preview)' },
    releaseDate: '2025 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'Samsung Galaxy S24 FE', brand: 'Samsung', slug: 'preview-samsung-galaxy-s24-fe',
    image: 'https://bludiode.com/53555-large_default/samsung-galaxy-s24-fe-s721b-double-sim-8-go-ram-256-go-5g-gris-marbre.jpg', isPreview: true,
    mainFeatures: { displaySize: '6.7-inch AMOLED (preview)', chipSet: 'Exynos (preview)', memory: '8 GB (preview)', storage: '128 GB (preview)', sensors: 'Fingerprint (preview)' },
    releaseDate: '2024 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'Xiaomi 15 Ultra', brand: 'Xiaomi', slug: 'preview-xiaomi-15-ultra',
    image: 'https://cdn.cimri.io/image/1200x1200/xiaomi-15-ultra-512gb-16gb-ram-gumus_973744645.jpg', isPreview: true,
    mainFeatures: { displaySize: '6.73-inch AMOLED (preview)', chipSet: 'Snapdragon 8 Elite (preview)', memory: '16 GB (preview)', storage: '512 GB (preview)', sensors: 'Fingerprint (preview)' },
    releaseDate: '2025 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'Redmi Note 14 Pro 5G', brand: 'Xiaomi', slug: 'preview-redmi-note-14-pro-5g',
    image: 'https://de2kqc9pq55cj.cloudfront.net/_img_productos/xiaomi-redmi-note-14-pro-5g-8gb-256gb-purple-foto1.jpg', isPreview: true,
    mainFeatures: { displaySize: '6.67-inch AMOLED (preview)', chipSet: 'Dimensity series (preview)', memory: '8 GB (preview)', storage: '256 GB (preview)', sensors: 'Fingerprint (preview)' },
    releaseDate: '2025 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'Google Pixel 9 Pro', brand: 'Google', slug: 'preview-google-pixel-9-pro',
    image: 'https://wowffer.com/media/catalog/product/cache/159af46e12db7c086731225d650361fc/p/o/por1_2.jpeg', isPreview: true,
    mainFeatures: { displaySize: '6.3-inch OLED (preview)', chipSet: 'Google Tensor G4 (preview)', memory: '16 GB (preview)', storage: '128 GB (preview)', sensors: 'Fingerprint (preview)' },
    releaseDate: '2024 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'Google Pixel 9', brand: 'Google', slug: 'preview-google-pixel-9',
    image: 'https://www.staples.ca/cdn/shop/files/9674eb80471a4b2efb3d19394d1051ff46c46e38_square3099570_1_800x800.jpg?v=1770358764', isPreview: true,
    mainFeatures: { displaySize: '6.3-inch OLED (preview)', chipSet: 'Google Tensor G4 (preview)', memory: '12 GB (preview)', storage: '128 GB (preview)', sensors: 'Fingerprint (preview)' },
    releaseDate: '2024 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'OnePlus 13', brand: 'OnePlus', slug: 'preview-oneplus-13',
    image: 'https://bludiode.com/img/p/6/3/8/0/1/63801.jpg', isPreview: true,
    mainFeatures: { displaySize: '6.82-inch AMOLED (preview)', chipSet: 'Snapdragon 8 Elite (preview)', memory: '12 GB (preview)', storage: '256 GB (preview)', sensors: 'Fingerprint (preview)' },
    releaseDate: '2025 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'Nothing Phone (2a)', brand: 'Nothing', slug: 'preview-nothing-phone-2a',
    image: 'https://api-rayashop.frelts.fastly.net/media/catalog/product/cache/4e49ac3a70c0b98a165f3fa6633ffee1/w/r/wr2uefs9pfcqzzouvztd_qpuivgichgel3ase.jpg', isPreview: true,
    mainFeatures: { displaySize: '6.7-inch AMOLED (preview)', chipSet: 'Dimensity 7200 Pro (preview)', memory: '8 GB (preview)', storage: '128 GB (preview)', sensors: 'Fingerprint (preview)' },
    releaseDate: '2024 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  },
  {
    phone_name: 'OPPO Find X8 Pro', brand: 'OPPO', slug: 'preview-oppo-find-x8-pro',
    image: 'https://www.oppostore.com.au/cdn/shop/files/FindX8ProBlack-FrontBackSeparate.png?v=1731924005&width=1000', isPreview: true,
    mainFeatures: { displaySize: '6.78-inch AMOLED (preview)', chipSet: 'Dimensity 9400 (preview)', memory: '16 GB (preview)', storage: '512 GB (preview)', sensors: 'Fingerprint (preview)' },
    releaseDate: '2024 (preview)', others: { Bluetooth: 'Bluetooth (preview)', WLAN: 'Wi-Fi (preview)', USB: 'USB-C (preview)' }
  }
];

const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

const FALLBACK_IMAGE = './assets/phone-placeholder.svg';

// The teacher's API uses `image`. The extra fields make the page tolerant of
// equivalent image keys, without changing the teacher's API endpoint or flow.
const getPhoneImage = (phone) => {
  const value = phone?.image || phone?.image_url || phone?.thumbnail || phone?.img;
  if (typeof value !== 'string' || !value.trim()) return FALLBACK_IMAGE;

  try {
    const url = new URL(value.trim(), window.location.href);
    if (!['http:', 'https:'].includes(url.protocol)) return FALLBACK_IMAGE;
    // Avoid mixed-content blocking when an API supplies an old HTTP image URL.
    if (window.location.protocol === 'https:' && url.protocol === 'http:') {
      url.protocol = 'https:';
    }
    return url.href;
  } catch {
    return FALLBACK_IMAGE;
  }
};

const attachImageFallback = (imageElement) => {
  imageElement.referrerPolicy = 'no-referrer';
  imageElement.decoding = 'async';
  imageElement.addEventListener('error', () => {
    if (imageElement.dataset.fallbackApplied === 'true') return;
    imageElement.dataset.fallbackApplied = 'true';
    imageElement.src = FALLBACK_IMAGE;
    imageElement.alt = `${imageElement.alt || 'Phone'} image unavailable`;
  });
};

const setApiStatus = (mode, message = '', options = {}) => {
  if (!apiStatus) return;
  if (mode === 'hidden') {
    apiStatus.hidden = true;
    apiStatus.innerHTML = '';
    return;
  }

  apiStatus.hidden = false;
  apiStatus.className = `api-status ${mode}`;
  const diagnosticLink = options.endpointUrl
    ? `<a class="api-diagnostic-link" href="${escapeHTML(options.endpointUrl)}" target="_blank" rel="noopener noreferrer">Inspect API response</a>`
    : '';
  const retryButton = options.canRetry
    ? '<button class="api-retry-button" id="retry-live-api" type="button">Retry live API <i class="fa-solid fa-rotate-right"></i></button>'
    : '';
  apiStatus.innerHTML = `
    <span class="api-status-icon"><i class="fa-solid ${mode === 'live' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i></span>
    <span class="api-status-copy">${escapeHTML(message)}</span>
    ${diagnosticLink}
    ${retryButton}`;

  const retry = document.getElementById('retry-live-api');
  if (retry) retry.addEventListener('click', () => loadPhones(currentSearch));
};

const showLoading = () => {
  setApiStatus('hidden');
  phoneGrid.innerHTML = `
    <div class="loading-state">
      <span class="loader"></span>
      <p>Finding something brilliant...</p>
    </div>`;
  resultCount.textContent = 'Loading results...';
};

const showMessage = (type, title, message, buttonText = '') => {
  const isError = type === 'error';
  phoneGrid.innerHTML = `
    <div class="${isError ? 'error-state' : 'empty-state'}">
      <span class="${isError ? 'error-icon' : 'empty-icon'}"><i class="fa-solid ${isError ? 'fa-triangle-exclamation' : 'fa-magnifying-glass'}"></i></span>
      <strong>${escapeHTML(title)}</strong>
      <p>${escapeHTML(message)}</p>
      ${buttonText ? `<button class="retry-button" id="retry-search" type="button">${escapeHTML(buttonText)}</button>` : ''}
    </div>`;
  resultCount.textContent = isError ? 'Could not load results' : '0 phones found';
  const retryButton = document.getElementById('retry-search');
  if (retryButton) retryButton.addEventListener('click', () => loadPhones(currentSearch));
};

const renderPhones = (phones, source = 'live') => {
  if (!Array.isArray(phones) || phones.length === 0) {
    showMessage('empty', 'No phones found', 'Try another brand or model name.');
    return;
  }

  phoneGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();

  phones.forEach((phone, index) => {
    const card = document.createElement('article');
    card.className = `phone-card${source === 'preview' ? ' preview-card' : ''}`;
    card.style.setProperty('--delay', `${Math.min(index, 8) * 65}ms`);

    const image = getPhoneImage(phone);
    const name = phone.phone_name || phone.name || 'Unnamed phone';
    const brand = phone.brand || 'Smartphone';
    const slug = phone.slug || '';
    const isPreview = source === 'preview' || phone.isPreview === true;

    card.innerHTML = `
      <div class="card-image-wrap">
        <img class="card-image" src="${escapeHTML(image)}" alt="${escapeHTML(name)}" loading="lazy" referrerpolicy="no-referrer" decoding="async" />
      </div>
      <span class="card-brand">${escapeHTML(brand)}</span>
      <h3 class="card-title">${escapeHTML(name)}</h3>
      <p class="card-copy">${isPreview ? 'Preview catalogue entry. Specifications are illustrative.' : `Explore the design and specifications of this ${escapeHTML(brand)} device.`}</p>
      <div class="card-footer">
        <span class="card-meta">${isPreview ? 'PREVIEW MODEL' : 'MODEL DETAILS'}</span>
        <button class="details-button" type="button" data-slug="${escapeHTML(slug)}" data-name="${escapeHTML(name)}" data-brand="${escapeHTML(brand)}" data-preview="${String(isPreview)}">
          Show details <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>`;

    const cardImage = card.querySelector('.card-image');
    attachImageFallback(cardImage);

    card.querySelector('.details-button').addEventListener('click', openPhoneDetails);
    fragment.appendChild(card);
  });

  phoneGrid.appendChild(fragment);
  resultCount.textContent = source === 'preview'
    ? `${phones.length} preview ${phones.length === 1 ? 'result' : 'results'} · live API unavailable`
    : `${phones.length} ${phones.length === 1 ? 'phone' : 'phones'} found`;
};

const getPreviewPhones = (searchText) => {
  const query = searchText.toLowerCase().trim();
  if (!query || query === 'phone' || query === 'phones' || query === 'all') return PREVIEW_PHONES;
  return PREVIEW_PHONES.filter((phone) =>
    phone.phone_name.toLowerCase().includes(query) || phone.brand.toLowerCase().includes(query)
  );
};

const fetchJSON = async (url, signal) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
    cache: 'no-store'
  });

  const responseText = await response.text();
  if (!response.ok) {
    const error = new Error(`Programming Hero returned HTTP ${response.status}.`);
    error.status = response.status;
    error.responseBody = responseText.slice(0, 500);
    error.requestURL = url;
    throw error;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    const error = new Error('The phone API did not return valid JSON.');
    error.status = response.status;
    error.requestURL = url;
    throw error;
  }
};

const loadPhones = async (searchText = DEFAULT_SEARCH) => {
  const cleanSearch = searchText.trim() || DEFAULT_SEARCH;
  currentSearch = cleanSearch;
  searchInput.value = cleanSearch;
  resultsHeading.textContent = `Results for “${cleanSearch}”`;

  document.querySelectorAll('.quick-chip').forEach((chip) => {
    chip.classList.toggle('selected', chip.dataset.search.toLowerCase() === cleanSearch.toLowerCase());
  });

  if (activeSearchController) activeSearchController.abort();
  const controller = new AbortController();
  activeSearchController = controller;
  const searchId = ++latestSearchId;
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  showLoading();

  try {
    const url = `${PHONE_SEARCH_ENDPOINT}${encodeURIComponent(cleanSearch)}`;
    const result = await fetchJSON(url, controller.signal);
    if (searchId !== latestSearchId) return;

    if (result.status === false) {
      throw new Error(result.message || 'The phone API reported an error.');
    }
    if (!Array.isArray(result.data)) {
      throw new Error('The phone API response did not contain a phone list.');
    }

    setApiStatus('hidden');
    renderPhones(result.data, 'live');
  } catch (error) {
    if (searchId !== latestSearchId) return;
    console.error('Phone search failed:', error);

    const previewPhones = getPreviewPhones(cleanSearch);
    const isNotFound = error.status === 404;
    const reason = error.name === 'AbortError'
      ? 'The phone API took too long to respond.'
      : (error.message || 'The phone API could not be reached.');
    const diagnosticURL = error.requestURL || `${PHONE_SEARCH_ENDPOINT}${encodeURIComponent(cleanSearch)}`;
    const statusMessage = isNotFound
      ? `The teacher's exact Programming Hero endpoint returned HTTP 404. The browser reached the server, but that route was not found. This cannot be repaired in front-end JavaScript; the API provider must restore the route. Showing clearly labelled preview entries with product photos where available.`
      : `Live API unavailable (${reason}). Showing clearly labelled preview entries instead.`;

    if (previewPhones.length) {
      setApiStatus('preview', statusMessage, {
        endpointUrl: diagnosticURL,
        canRetry: !isNotFound
      });
      renderPhones(previewPhones, 'preview');
    } else {
      setApiStatus('preview', `${statusMessage} No built-in preview models match “${cleanSearch}”.`, {
        endpointUrl: diagnosticURL,
        canRetry: !isNotFound
      });
      showMessage('empty', 'No preview models match this search', 'Try iPhone, Samsung, Xiaomi, Google, OnePlus, Nothing, or OPPO.');
    }
  } finally {
    window.clearTimeout(timeoutId);
    if (searchId === latestSearchId) activeSearchController = null;
  }
};

const getDetailValue = (value) => {
  if (value === undefined || value === null || value === '') return 'Not provided';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return Object.values(value).filter(Boolean).join(', ') || 'Not provided';
  return String(value);
};

const createSpecItem = (label, value) => `
  <div class="spec-item">
    <span>${escapeHTML(label)}</span>
    <strong>${escapeHTML(getDetailValue(value))}</strong>
  </div>`;

const displayPhoneDetails = (phone, name, brand, isPreview = false) => {
  const features = phone.mainFeatures || {};
  const otherFeatures = phone.others || {};
  const specifications = [
    ['Display', features.displaySize],
    ['Chipset', features.chipSet],
    ['Memory', features.memory],
    ['Storage', features.storage],
    ['Release date', phone.releaseDate],
    ['Brand', phone.brand || brand],
    ['Sensors', features.sensors],
    ['Bluetooth', otherFeatures.Bluetooth],
    ['WLAN', otherFeatures.WLAN],
    ['USB', otherFeatures.USB]
  ];

  const image = getPhoneImage(phone);
  modalContent.innerHTML = `
    <div class="modal-top">
      <div class="modal-image-wrap"><img class="modal-image" src="${escapeHTML(image)}" alt="${escapeHTML(phone.name || phone.phone_name || name)}" referrerpolicy="no-referrer" decoding="async" /></div>
      <div>
        <span class="modal-brand">${escapeHTML(phone.brand || brand)}${isPreview ? ' · PREVIEW' : ''}</span>
        <h2 class="modal-title" id="modal-title">${escapeHTML(phone.name || phone.phone_name || name)}</h2>
        <p class="modal-subtitle">${isPreview ? 'Illustrative preview specifications. The live phone API is currently unavailable.' : 'Explore the available information for this model.'}</p>
      </div>
    </div>
    <h3 class="specs-heading">${isPreview ? 'Preview specifications' : 'Key specifications'}</h3>
    <div class="spec-grid">${specifications.map(([label, value]) => createSpecItem(label, value)).join('')}</div>`;

  const modalImage = modalContent.querySelector('.modal-image');
  attachImageFallback(modalImage);
};

const openPhoneDetails = async (event) => {
  const button = event.currentTarget;
  const slug = button.dataset.slug;
  const name = button.dataset.name || 'Phone details';
  const brand = button.dataset.brand || 'Smartphone';
  const isPreview = button.dataset.preview === 'true';
  if (!slug) return;

  lastFocusedElement = button;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modalContent.innerHTML = `
    <div class="modal-loading"><span class="loader"></span><span>Loading phone details...</span></div>`;
  modalClose.focus();

  if (isPreview) {
    const previewPhone = PREVIEW_PHONES.find((phone) => phone.slug === slug);
    if (previewPhone) displayPhoneDetails(previewPhone, name, brand, true);
    return;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const detailURL = `${PHONE_DETAILS_ENDPOINT}${encodeURIComponent(slug)}`;
    const result = await fetchJSON(detailURL, controller.signal);
    if (result.status === false || !result.data) {
      throw new Error(result.message || 'Phone details were not available.');
    }
    displayPhoneDetails(result.data, name, brand, false);
  } catch (error) {
    console.error('Phone detail request failed:', error);
    const detailURL = `${PHONE_DETAILS_ENDPOINT}${encodeURIComponent(slug)}`;
    const isNotFound = error.status === 404;
    modalContent.innerHTML = `
      <div class="modal-error">
        <div class="error-icon" style="margin: 0 auto 14px"><i class="fa-solid fa-circle-exclamation"></i></div>
        <h3 id="modal-title">Details are unavailable</h3>
        <p>We could not load the live specifications for ${escapeHTML(name)}. ${isNotFound ? 'The teacher API detail endpoint returned HTTP 404. This needs to be restored by the API provider.' : 'The request failed or the API is temporarily unavailable.'}</p>
        ${isNotFound ? `<a class="api-diagnostic-link" href="${escapeHTML(detailURL)}" target="_blank" rel="noopener noreferrer">Inspect detail API response</a>` : '<button class="retry-button" id="retry-details" type="button">Try again</button>'}
      </div>`;
    const retryButton = modalContent.querySelector('#retry-details');
    if (retryButton) retryButton.addEventListener('click', () => openPhoneDetails({ currentTarget: button }));
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
};

const applyTheme = (theme) => {
  const selectedTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = selectedTheme;
  const isLight = selectedTheme === 'light';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-moon"></i><span>Dark mode</span>'
    : '<i class="fa-solid fa-sun"></i><span>Light mode</span>';
  try {
    localStorage.setItem('nexora-theme', selectedTheme);
  } catch (error) {
    console.warn('Theme preference could not be saved in this browser.', error);
  }
};

const getSavedTheme = () => {
  try {
    return localStorage.getItem('nexora-theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

// ---------------------------------------------------------------------------
// Demo-only authentication UI. It stores only a temporary display profile in
// sessionStorage; passwords are never stored or verified by this static site.
// ---------------------------------------------------------------------------
const DEMO_SESSION_KEY = 'nexora-demo-session';
let demoSession = null;
let authLastFocusedElement = null;
let authToastTimer = null;

const readDemoSession = () => {
  try {
    const saved = sessionStorage.getItem(DEMO_SESSION_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed.email === 'string' ? parsed : null;
  } catch {
    return null;
  }
};

const updateAuthTrigger = () => {
  const signedIn = Boolean(demoSession);
  authTriggerLabel.textContent = signedIn ? 'Account' : 'Sign in';
  authOpen.innerHTML = signedIn
    ? '<i class="fa-solid fa-user-check"></i><span id="auth-trigger-label">Account</span>'
    : '<i class="fa-regular fa-user"></i><span id="auth-trigger-label">Sign in</span>';
  authOpen.setAttribute('aria-label', signedIn ? 'Open demo account' : 'Open sign in and register');
};

const showAuthToast = (message) => {
  authToast.textContent = message;
  authToast.classList.add('visible');
  window.clearTimeout(authToastTimer);
  authToastTimer = window.setTimeout(() => authToast.classList.remove('visible'), 3400);
};

const showAuthFeedback = (message, type = 'error') => {
  authFeedback.hidden = false;
  authFeedback.className = `auth-feedback ${type}`;
  authFeedback.textContent = message;
};

const refreshAuthPanel = () => {
  const isSignedIn = Boolean(demoSession);
  authFormsShell.hidden = isSignedIn;
  authSession.hidden = !isSignedIn;
  if (isSignedIn) {
    authSessionName.textContent = `${demoSession.name || 'Explorer'} · ${demoSession.email}`;
  }
};

const setAuthMode = (mode) => {
  const isRegister = mode === 'register';
  document.querySelectorAll('[data-auth-tab]').forEach((tab) => {
    const active = tab.dataset.authTab === mode;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  loginForm.hidden = isRegister;
  registerForm.hidden = !isRegister;
  authHeading.innerHTML = isRegister ? 'Create your <span>space.</span>' : 'Welcome <span>back.</span>';
  authSubheading.textContent = isRegister ? 'A fresh start for your tech discoveries.' : 'Sign in to continue exploring.';
  authSwitchCopy.innerHTML = isRegister
    ? 'Already have a demo session? <button type="button" data-auth-switch="login">Sign in instead</button>'
    : 'New to Nexora? <button type="button" data-auth-switch="register">Create an account</button>';
  authFeedback.hidden = true;
};

const openAuth = (mode = 'login') => {
  authLastFocusedElement = document.activeElement;
  refreshAuthPanel();
  setAuthMode(mode);
  authModal.classList.add('open');
  authModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('auth-open');
  authClose.focus();
};

const closeAuth = () => {
  authModal.classList.remove('open');
  authModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('auth-open');
  if (authLastFocusedElement && typeof authLastFocusedElement.focus === 'function') authLastFocusedElement.focus();
};

const startDemoSession = (name, email) => {
  demoSession = { name, email, signedInAt: new Date().toISOString() };
  try {
    sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoSession));
  } catch (error) {
    console.warn('Demo session could not be stored in this tab.', error);
  }
  updateAuthTrigger();
  refreshAuthPanel();
  closeAuth();
  showAuthToast(`Welcome to Nexora, ${name || 'Explorer'}! Demo session started.`);
};

authOpen.addEventListener('click', () => openAuth(demoSession ? 'login' : 'login'));
authClose.addEventListener('click', closeAuth);
authModal.addEventListener('click', (event) => {
  if (event.target === authModal) closeAuth();
});
document.querySelectorAll('[data-auth-tab]').forEach((tab) => {
  tab.addEventListener('click', () => setAuthMode(tab.dataset.authTab));
});
document.addEventListener('click', (event) => {
  const switchButton = event.target.closest('[data-auth-switch]');
  if (switchButton) setAuthMode(switchButton.dataset.authSwitch);
});
document.querySelectorAll('[data-password-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.passwordTarget);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    button.innerHTML = `<i class="fa-regular ${show ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
  });
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAuthFeedback('Enter a valid email address to continue.');
    return;
  }
  if (password.length < 6) {
    showAuthFeedback('Enter at least 6 characters for the demo password.');
    return;
  }
  // Deliberately does not send or persist the password. This is a visual demo.
  startDemoSession(email.split('@')[0], email);
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');
  if (name.length < 2) {
    showAuthFeedback('Please enter a name with at least 2 characters.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAuthFeedback('Enter a valid email address.');
    return;
  }
  if (password.length < 6) {
    showAuthFeedback('Your demo password must contain at least 6 characters.');
    return;
  }
  if (password !== confirmPassword) {
    showAuthFeedback('Those passwords do not match. Please try again.');
    return;
  }
  // Store only the visible demo profile in sessionStorage, never the password.
  startDemoSession(name, email);
});

document.getElementById('auth-signout').addEventListener('click', () => {
  demoSession = null;
  try { sessionStorage.removeItem(DEMO_SESSION_KEY); } catch (error) {
    console.warn('Demo session could not be cleared.', error);
  }
  updateAuthTrigger();
  refreshAuthPanel();
  closeAuth();
  showAuthToast('You have signed out of the demo session.');
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loadPhones(searchInput.value);
});

document.querySelectorAll('.quick-chip').forEach((chip) => {
  chip.addEventListener('click', () => loadPhones(chip.dataset.search));
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && authModal.classList.contains('open')) closeAuth();
  else if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.innerHTML = `<i class="fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}"></i>`;
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
});

demoSession = readDemoSession();
updateAuthTrigger();
refreshAuthPanel();
applyTheme(getSavedTheme());
document.getElementById('current-year').textContent = new Date().getFullYear();
loadPhones(DEFAULT_SEARCH);
