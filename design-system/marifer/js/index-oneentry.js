/**
 * OneEntry Shop — Interactive JavaScript Engine
 * Archivo: js/index-oneentry.js
 */

(function () {
  'use strict';

  // 1. Estado Reactivo del Carrito y Favoritos
  const state = {
    cart: [],
    favorites: new Set(),
    searchQuery: '',
  };

  // Elementos del DOM
  const cartBadge = document.querySelector('[data-testid="cart-badge"]');
  const favBadge = document.querySelector('[data-testid="favorites-badge"]');
  const searchInput = document.querySelector('.oe-search-input');
  const productCards = document.querySelectorAll('.product-card');

  // 2. Toastify Notification Engine (Idéntico a OneEntry)
  function showToast(message, type = 'success') {
    let container = document.getElementById('oe-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'oe-toast-container';
      container.style.position = 'fixed';
      container.style.bottom = '24px';
      container.style.right = '24px';
      container.style.zIndex = '9999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'oe-toast fade-in';
    toast.style.background = type === 'success' ? '#1e293b' : '#ef4444';
    toast.style.color = '#ffffff';
    toast.style.padding = '14px 20px';
    toast.style.borderRadius = '30px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '600';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.border = '1px solid rgba(255,255,255,0.1)';

    const icon = document.createElement('span');
    icon.innerHTML = type === 'success' 
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fe6e00" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line></svg>';
    
    toast.appendChild(icon);
    
    const text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 300ms ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // 3. Manejo del Carrito
  window.addToCart = function (productName, price) {
    state.cart.push({ name: productName, price: price });
    if (cartBadge) {
      cartBadge.textContent = state.cart.length;
      cartBadge.classList.add('fade-in');
    }
    showToast(`Added "${productName}" to your cart!`);
  };

  // 4. Toggle de Favoritos con Feedback Visual
  window.toggleFavorite = function (btn, productId) {
    const icon = btn.querySelector('svg');
    if (state.favorites.has(productId)) {
      state.favorites.delete(productId);
      btn.style.color = 'var(--oe-muted)';
      if (icon) icon.setAttribute('fill', 'none');
      showToast('Removed from favorites.');
    } else {
      state.favorites.add(productId);
      btn.style.color = '#ef4444';
      if (icon) icon.setAttribute('fill', '#ef4444');
      showToast('Saved to your favorites wishlist!');
    }

    if (favBadge) {
      favBadge.textContent = state.favorites.size;
    }
  };

  // 5. Dynamic Search Filter en Tiempo Real
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const term = e.target.value.toLowerCase().trim();
      productCards.forEach((card) => {
        const title = card.querySelector('.product-card-title')?.textContent.toLowerCase() || '';
        if (title.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 6. Dynamic Radial Hover Tracking para los Block Cards
  const blockCards = document.querySelectorAll('.block-card');
  blockCards.forEach((card) => {
    const radial = card.querySelector('.radial-hover');
    if (radial) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - 150;
        const y = e.clientY - rect.top - 150;
        radial.style.left = `${x}px`;
        radial.style.top = `${y}px`;
      });
    }
  });

  console.log('OneEntry Shop Interactive Engine Initialized.');
})();
