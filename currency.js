function initCurrencyModal() {
  window.currencyOrderModal = document.getElementById('currencyOrderModal');
  window.currencyInputCount = document.getElementById('currencyInputCount');
  window.confirmCurrencyBtn = document.getElementById('confirmCurrencyBtn');

  if (!window.confirmCurrencyBtn) return;

  // ❗ защита от двойного навешивания
  window.confirmCurrencyBtn.onclick = function () {
    if (!window.pendingCurrencyItem) return;

    const count = parseInt(window.currencyInputCount.value, 10);

    if (!count || count <= 0) {
      showToast('Введите корректное количество');
      return;
    }

    const urgencyRadio = document.querySelector('input[name="modalUrgencyRadio"]:checked');
    const urgency = urgencyRadio ? urgencyRadio.value : 'normal';

    const pricePerItem = urgency === 'urgent' ? 150 : 75;

    cart.push({
      ...window.pendingCurrencyItem,
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
  };
}

document.addEventListener('DOMContentLoaded', initCurrencyModal);