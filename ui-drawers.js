function closeAllDrawers() {
  if (overlay) overlay.classList.remove('active');
  if (productDrawer) productDrawer.classList.remove('active');
  if (cartDrawer) cartDrawer.classList.remove('active');
  if (appleModal) appleModal.classList.remove('active');
  if (confirmClearCartModal) confirmClearCartModal.classList.remove('active');
  if (serverWelcomeModal) serverWelcomeModal.classList.remove('active');
  if (currencyOrderModal) currencyOrderModal.classList.remove('active');

  window.activeItemForDrawer = null;
  window.pendingCurrencyItem = null;
}

// close events
if (overlay) overlay.addEventListener('click', closeAllDrawers);
if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeAllDrawers);
if (closeCartDrawerBtn) closeCartDrawerBtn.addEventListener('click', closeAllDrawers);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAllDrawers);

// open cart
if (openCartBtn) {
  openCartBtn.addEventListener('click', () => {
    if (productDrawer) productDrawer.classList.remove('active');
    if (overlay) overlay.classList.add('active');
    if (cartDrawer) cartDrawer.classList.add('active');
  });
}