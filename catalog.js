// ===============================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ (используются из index.html)
// ===============================

let activeItemForDrawer = null;

// ВАЛЮТА
window.pendingCurrencyItem = null;

// ===============================
// DRAWERS / UI
// ===============================

function closeAllDrawers() {
  overlay?.classList.remove('active');
  productDrawer?.classList.remove('active');
  cartDrawer?.classList.remove('active');
  appleModal?.classList.remove('active');
  confirmClearCartModal?.classList.remove('active');
  serverWelcomeModal?.classList.remove('active');
  currencyOrderModal?.classList.remove('active');

  activeItemForDrawer = null;
  window.pendingCurrencyItem = null;
}

// ===============================
// ОТКРЫТИЕ КАРТОЧКИ ТОВАРА
// ===============================

function openProductDrawer(item) {
  activeItemForDrawer = item;

  cartDrawer?.classList.remove('active');

  const dImg = getEl('d-image');
  if (dImg) dImg.src = item.image;

  const dName = getEl('d-name');
  if (dName) dName.innerText = item.name;

  const tagEl = getEl('d-tag');
  if (tagEl) {
    tagEl.innerText = item.category || 'Другое';
    tagEl.className =
      'tag ' + (item.category || 'другое').toLowerCase().replace(/\s+/g, '-');
  }

  const noteContainer = getEl('d-note-container');
  const noteText = getEl('d-note-text');
  const adminIconsGrid = getEl('d-admin-icons');

  if (adminIconsGrid) adminIconsGrid.innerHTML = '';

  const name = item.name.trim().toLowerCase();

  if (
    name === 'золотое яблоко' ||
    name === 'исчезнувшее золотое яблоко'
  ) {
    if (noteText) noteText.innerText = '⚠️ Покупка только навесом';
    if (noteContainer) noteContainer.style.display = 'block';
  } else if (item.adminIcons?.length) {
    if (noteText)
      noteText.innerText = 'В комплекте с этим окрасом идут предметы:';

    item.adminIcons.forEach(icon => {
      const img = document.createElement('img');
      img.src = icon;
      img.className = 'admin-mini-icon';
      adminIconsGrid.appendChild(img);
    });

    if (noteContainer) noteContainer.style.display = 'block';
  } else {
    if (noteContainer) noteContainer.style.display = 'none';
  }

  // META
  const metaContainer = getEl('d-meta-container');

  if (item.category?.toLowerCase() === 'окрасы') {
    getEl('d-breed').innerText = item.breed || 'Не указана';
    getEl('d-type').innerText = item.type || 'Обычный';
    getEl('d-affix').innerText = item.affix ? 'Да' : 'Нет';
    getEl('d-chk').innerText = item.chk ? 'Да' : 'Нет';

    const companion = getEl('d-companion');
    if (companion) {
      companion.innerHTML = item.companionImage
        ? `<img src="${item.companionImage}" class="companion-img">`
        : 'Нет';
    }

    metaContainer.style.display = 'block';
  } else {
    metaContainer.style.display = 'none';
  }

  // OPTIONS
  const optionsContainer = getEl('d-options-container');

  if (item.category?.toLowerCase() === 'окрасы') {
    optCrSelect.value = 'none';
    optFkSelect.value = 'none';
    optSkillsSelect.value = 'none';
    optionsContainer.style.display = 'block';
  } else {
    optionsContainer.style.display = 'none';
  }

  // DESCRIPTION
  const isColor = item.category?.toLowerCase() === 'окрасы';

  getEl('d-desc-label').style.display = isColor ? 'none' : 'block';
  getEl('d-description').style.display = isColor ? 'none' : 'block';
  getEl('d-get-label').style.display = isColor ? 'none' : 'block';
  getEl('d-get').style.display = isColor ? 'none' : 'block';

  if (!isColor) {
    getEl('d-description').innerText = item.description || '';
    getEl('d-get').innerText = item.howto || '';
  }

  // STOCK
  const flags = Object.keys(item.stocks || {}).filter(
    k => item.stocks[k] > 0
  );

  getEl('d-flags').innerText =
    flags.length ? flags.join(' ') : 'Нет в наличии';

  const stock = item.stocks?.[currentServer] || 0;
  getEl('d-count').innerText = `${stock} шт`;

  getEl('d-price').innerText = `${item.price || 0} ₽`;

  overlay.classList.add('active');
  productDrawer.classList.add('active');

  recalcDrawerPrice?.();
}

// ===============================
// ADD TO CART
// ===============================

function addToCart(item) {
  const name = item.name.trim().toLowerCase();

  // ЯБЛОКИ
  if (
    name === 'золотое яблоко' ||
    name === 'исчезнувшее золотое яблоко'
  ) {
    currentAppleType = name === 'золотое яблоко' ? 'зя' : 'ися';

    closeAllDrawers();

    appleModalText.innerHTML =
      'Товар продаётся только навесом';

    overlay.classList.add('active');
    appleModal.classList.add('active');
    return;
  }

  // ВАЛЮТА (ПРОПУСКИ)
  if (
    item.category?.toLowerCase() === 'валюта' &&
    name.includes('пропуск')
  ) {
    window.pendingCurrencyItem = item;

    closeAllDrawers();

    currencyInputCount.value = 1;

    overlay.classList.add('active');
    currencyOrderModal.classList.add('active');
    return;
  }

  // обычный товар
  cart.push({
    ...item,
    quantity: 1
  });

  localStorage.setItem('lowadi_cart', JSON.stringify(cart));

  updateCartUI();
  renderItems();

  showToast(`Добавлено: ${item.name}`);
}

// ===============================
// ПОДТВЕРЖДЕНИЕ ВАЛЮТЫ
// ===============================

document.getElementById('confirmCurrencyBtn')?.addEventListener('click', () => {
  if (!window.pendingCurrencyItem) return;

  const count = parseInt(currencyInputCount.value, 10);

  if (!count || count <= 0) {
    showToast('Введите корректное количество');
    return;
  }

  const urgency =
    document.querySelector('input[name="modalUrgencyRadio"]:checked')
      ?.value || 'normal';

  cart.push({
    ...window.pendingCurrencyItem,
    quantity: count,
    urgency,
    price: urgency === 'urgent' ? 150 : 75
  });

  window.pendingCurrencyItem = null;

  currencyOrderModal.classList.remove('active');
  overlay.classList.remove('active');

  updateCartUI();
  renderItems();
});

// ===============================
// КНОПКА ИЗ ДРОУЕРА
// ===============================

drawerAddCartBtn?.addEventListener('click', () => {
  if (activeItemForDrawer) addToCart(activeItemForDrawer);
});

// ===============================
// КОРЗИНА / ФИЛЬТРЫ (оставляем как у тебя)
// ===============================

openCartBtn?.addEventListener('click', () => {
  productDrawer?.classList.remove('active');
  overlay.classList.add('active');
  cartDrawer.classList.add('active');
});

openFavBtn?.addEventListener('click', () => {
  isFavoritesPage = !isFavoritesPage;
  currentPage = 1;
  renderItems();
  showToast(isFavoritesPage ? 'Избранное' : 'Каталог');
});

searchInput?.addEventListener('input', () => {
  currentPage = 1;
  renderItems();
});

stockFilter?.addEventListener('change', () => {
  currentPage = 1;
  renderItems();
});

tagFilter?.addEventListener('change', () => {
  currentPage = 1;
  renderItems();
});

// фильтры
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentCategory = btn.dataset.category;

    currentPage = 1;
    loadAndRenderCategory();
  });
});

subFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    subFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentSubCategory = btn.dataset.subcategory;

    currentPage = 1;
    renderItems();
  });
});