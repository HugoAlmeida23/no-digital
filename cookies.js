/* ============================================================
   NÓ DIGITAL — Cookie Consent Manager
   RGPD compliant: blocks non-essential scripts until consent
   ============================================================ */

(function () {
  'use strict';

  const COOKIE_NAME = 'nd_cookie_consent';
  const COOKIE_DAYS = 365;

  // ============================================================
  // COOKIE UTILITIES
  // ============================================================
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(JSON.stringify(value)) +
      '; expires=' + expires + '; path=/; SameSite=Lax; Secure';
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match[2]));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  // ============================================================
  // CONSENT STATE
  // ============================================================
  function getConsent() {
    return getCookie(COOKIE_NAME);
  }

  function saveConsent(preferences) {
    const consent = {
      necessary: true, // always true
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    setCookie(COOKIE_NAME, consent, COOKIE_DAYS);
    applyConsent(consent);
    hideBanner();
    hideModal();
  }

  // ============================================================
  // APPLY CONSENT (activate/deactivate scripts)
  // ============================================================
  function applyConsent(consent) {
    if (consent.analytics) {
      activateAnalytics();
    } else {
      deactivateAnalytics();
    }
    // Marketing scripts can be handled here if added in the future
  }

  function activateAnalytics() {
    // Activate GoatCounter if not already loaded
    if (!document.querySelector('script[data-goatcounter]')) {
      const script = document.createElement('script');
      script.setAttribute('data-goatcounter', 'https://nodigital.goatcounter.com/count');
      script.async = true;
      script.src = '//gc.zgo.at/count.js';
      document.body.appendChild(script);
    }
  }

  function deactivateAnalytics() {
    // Remove GoatCounter script if present
    const gcScript = document.querySelector('script[data-goatcounter]');
    if (gcScript) {
      gcScript.remove();
    }
    // Set GoatCounter to not count
    window.goatcounter = window.goatcounter || {};
    window.goatcounter.no_onload = true;
  }

  // ============================================================
  // BANNER UI
  // ============================================================
  function createBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferências de cookies');
    banner.innerHTML = `
      <div class="cookie-banner-inner">
        <div class="cookie-banner-text">
          <p>Utilizamos cookies para garantir o funcionamento do site e, com o seu consentimento, para análise estatística. Pode aceitar, rejeitar ou gerir as suas preferências. <a href="/politica-cookies.html">Saber mais</a></p>
        </div>
        <div class="cookie-banner-actions">
          <button class="cookie-btn cookie-btn-accept" id="cookie-accept-all">Aceitar todos</button>
          <button class="cookie-btn cookie-btn-reject" id="cookie-reject-all">Rejeitar</button>
          <button class="cookie-btn cookie-btn-settings" id="cookie-open-settings">Gerir preferências</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Event listeners
    document.getElementById('cookie-accept-all').addEventListener('click', function () {
      saveConsent({ analytics: true, marketing: true });
    });

    document.getElementById('cookie-reject-all').addEventListener('click', function () {
      saveConsent({ analytics: false, marketing: false });
    });

    document.getElementById('cookie-open-settings').addEventListener('click', function () {
      showModal();
    });

    // Show with animation
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('visible');
      });
    });
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(function () { banner.remove(); }, 500);
    }
  }

  // ============================================================
  // PREFERENCES MODAL
  // ============================================================
  function createModal() {
    const consent = getConsent() || { analytics: false, marketing: false };

    const overlay = document.createElement('div');
    overlay.className = 'cookie-modal-overlay';
    overlay.id = 'cookie-modal-overlay';
    overlay.innerHTML = `
      <div class="cookie-modal" role="dialog" aria-labelledby="cookie-modal-title">
        <h2 class="cookie-modal-title" id="cookie-modal-title">Preferências de cookies</h2>
        <p class="cookie-modal-desc">Escolha as categorias de cookies que autoriza. Os cookies necessários não podem ser desativados porque são essenciais ao funcionamento do site.</p>

        <div class="cookie-category">
          <div class="cookie-category-header">
            <div class="cookie-category-info">
              <h3>Cookies necessários</h3>
              <p>Essenciais para o funcionamento do site. Incluem preferências de cookies e segurança.</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" checked disabled />
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="cookie-category">
          <div class="cookie-category-header">
            <div class="cookie-category-info">
              <h3>Cookies de análise</h3>
              <p>Permitem entender como o site é utilizado de forma agregada e anónima (GoatCounter).</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" id="cookie-pref-analytics" ${consent.analytics ? 'checked' : ''} />
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="cookie-category">
          <div class="cookie-category-header">
            <div class="cookie-category-info">
              <h3>Cookies de marketing</h3>
              <p>Podem ser utilizados para medir campanhas publicitárias. Atualmente não utilizados.</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" id="cookie-pref-marketing" ${consent.marketing ? 'checked' : ''} />
              <span class="cookie-toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="cookie-modal-actions">
          <button class="cookie-modal-btn cookie-modal-btn-reject" id="cookie-modal-reject">Rejeitar todos</button>
          <button class="cookie-modal-btn cookie-modal-btn-save" id="cookie-modal-save">Guardar preferências</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Events
    document.getElementById('cookie-modal-save').addEventListener('click', function () {
      const analytics = document.getElementById('cookie-pref-analytics').checked;
      const marketing = document.getElementById('cookie-pref-marketing').checked;
      saveConsent({ analytics: analytics, marketing: marketing });
    });

    document.getElementById('cookie-modal-reject').addEventListener('click', function () {
      saveConsent({ analytics: false, marketing: false });
    });

    // Close on overlay click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        hideModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        hideModal();
      }
    });
  }

  function showModal() {
    let overlay = document.getElementById('cookie-modal-overlay');
    if (!overlay) {
      createModal();
      overlay = document.getElementById('cookie-modal-overlay');
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('visible');
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    const overlay = document.getElementById('cookie-modal-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
      setTimeout(function () { overlay.remove(); }, 300);
    }
  }

  // ============================================================
  // FOOTER "Gerir preferências de cookies" BUTTON
  // ============================================================
  function bindSettingsButton() {
    const btn = document.getElementById('cookie-settings-btn');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        showModal();
      });
    }
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    const consent = getConsent();

    if (consent) {
      // User already made a choice — apply it
      applyConsent(consent);
    } else {
      // No consent yet — block analytics and show banner
      deactivateAnalytics();
      createBanner();
    }

    bindSettingsButton();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
