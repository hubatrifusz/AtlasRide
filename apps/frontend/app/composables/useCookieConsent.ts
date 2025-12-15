export function useCookieConsent() {
  const cookieConsent = useCookie('cookie-consent', {
    maxAge: 60 * 60 * 24 * 30 * 6,
    sameSite: 'lax',
  });
  const { gtag } = useGtag();

  function acceptCookies() {
    gtag('consent', 'update', {
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
    cookieConsent.value = 'granted';
  }

  function denyAllCookies() {
    gtag('consent', 'update', {
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
    cookieConsent.value = 'denied';
  }

  function initCookies() {
    if (cookieConsent.value === 'granted') {
      acceptCookies();
    } else if (cookieConsent.value === 'denied') {
      denyAllCookies();
    }
  }

  function getCookieConsentValue() {
    return cookieConsent.value;
  }

  return { acceptCookies, denyAllCookies, initCookies, getCookieConsentValue };
}
