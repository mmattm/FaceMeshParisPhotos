// Exhibition keeps the public view clear; M still opens the operator interface.
export function setupExhibitionMode(browser = window) {
  if (new URLSearchParams(browser.location.search).get('exhibition') !== '1') return false;
  browser.document.body.classList.add('interface-hidden', 'exhibition-mode');
  browser.alert = message => browser.console.warn('[Exposition]', message);
  // Operator actions requiring confirmation must never run silently.
  browser.confirm = message => {
    browser.console.warn('[Exposition] Action annulée :', message);
    return false;
  };
  browser.prompt = () => null;
  return true;
}
