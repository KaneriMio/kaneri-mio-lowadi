// ===============================
// КОРЗИНА: ДОБАВЛЕНИЕ ТОВАРОВ
// ===============================

function addToCart(item) {
  const itemNameNormalized = item.name.trim().toLowerCase();

  // ===== ЗОЛОТЫЕ ЯБЛОКИ =====
  if (itemNameNormalized === 'золотое яблоко') {
    currentAppleType = 'зя';
    closeAllDrawers();
    if (overlay) overlay.classList.add('active');
    if (appleModal) appleModal.classList.add('active');
    return;
  }

  if (itemNameNormalized === 'исчезнувшее золотое яблоко') {
    currentAppleType = 'ися';
    closeAllDrawers();
    if (overlay) overlay.classList.add('active');
    if (appleModal) appleModal.classList.add('active');
    return;
  }

  // ===== ВАЛЮТА (ПРОПУСКИ) =====
  if (
    item.category &&
    item.category.toLowerCase() === 'валюта' &&
    itemNameNormalized.includes('пропуск')
  ) {
    window.pendingCurrencyItem = item;

    closeAllDrawers();

    if (currencyInputCount) currencyInputCount.value = "1";

    const normalRadio = document.querySelector('input[value="normal"]');
    if (normalRadio) normalRadio.checked = true;

    if (overlay) overlay.classList.add('active');
    if (currencyOrderModal) currencyOrderModal.classList.add('active');

    return;
  }

  // ===== обычный товар =====
  cart.push({
    ...item,
    quantity: 1,
    cartKey: item.id
  });

  localStorage.setItem('lowadi_cart', JSON.stringify(cart));

  updateCartUI();
  renderItems();
  showToast(`Добавлено: ${item.name}`);
}


// ===============================
// ОБНОВЛЕНИЕ КОРЗИНЫ
// ===============================
function updateCartUI() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const el = document.createElement('div');
    el.className = 'cart-item';

    el.innerHTML = `
      <div>${item.name}</div>
      <div>${item.quantity} шт</div>
      <div>${item.price * item.quantity} ₽</div>
    `;

    cartItemsContainer.appendChild(el);
  });

  if (cartTotalPrice) {
    cartTotalPrice.innerText = `${total} ₽`;
  }
}


// ===============================
// ПОДТВЕРЖДЕНИЕ ПРОПУСКОВ
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('confirmCurrencyBtn');

  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!window.pendingCurrencyItem) return;

    const count = parseInt(
      document.getElementById('currencyInputCount').value,
      10
    );

    if (!count || count <= 0) {
      showToast('Введите корректное количество');
      return;
    }

    const urgencyRadio = document.querySelector(
      'input[name="modalUrgencyRadio"]:checked'
    );

    const urgency = urgencyRadio ? urgencyRadio.value : 'normal';
    const pricePerItem = urgency === 'urgent' ? 150 : 75;

    const item = window.pendingCurrencyItem;

    cart.push({
      ...item,
      quantity: count,
      price: pricePerItem,
      urgency
    });

    localStorage.setItem('lowadi_cart', JSON.stringify(cart));

    updateCartUI();
    renderItems();

    if (window.currencyOrderModal) {
      window.currencyOrderModal.classList.remove('active');
    }
    if (overlay) overlay.classList.remove('active');

    window.pendingCurrencyItem = null;
  });
});