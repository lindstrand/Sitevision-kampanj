import './styles.scss';
import QRCode from './lib/qrcode-compact';

function normalizeConfiguredDomain(value) {
  var s = String(value || '').trim().toLowerCase();
  if (!s) return '';
  s = s.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
  if (s.indexOf('www.') === 0) s = s.slice(4);
  return s;
}

function configuredDomains(root, attr) {
  var raw = root ? (root.getAttribute(attr) || '') : '';
  var parts = raw.split(/[\s,;]+/);
  var result = [];
  for (var i = 0; i < parts.length; i++) {
    var domain = normalizeConfiguredDomain(parts[i]);
    if (domain && result.indexOf(domain) === -1) result.push(domain);
  }
  return result;
}

var CHANNELS = {
  affisch: { source: 'affisch', medium: 'qr', qr: true },
  broschyr: { source: 'broschyr', medium: 'qr', qr: true },
  skylt: { source: 'skylt', medium: 'qr', qr: true },
  trycksak: { source: 'trycksak', medium: 'qr', qr: true },
  nyhetsbrev: { source: 'nyhetsbrev', medium: 'email' },
  epost: { source: 'epost', medium: 'email' },
  webbannons: { source: 'webbannons', medium: 'display' },
  pressmeddelande: { source: 'pressmeddelande', medium: 'referral' },
  'facebook-organic': { source: 'facebook', medium: 'social' },
  'instagram-organic': { source: 'instagram', medium: 'social' },
  'linkedin-organic': { source: 'linkedin', medium: 'social' },
  'tiktok-organic': { source: 'tiktok', medium: 'social' },
  'snapchat-organic': { source: 'snapchat', medium: 'social' },
  'youtube-organic': { source: 'youtube', medium: 'social' },
  'google-ads': { source: 'google', medium: 'cpc', paid: true },
  'facebook-ads': { source: 'facebook', medium: 'paid-social', paid: true },
  'instagram-ads': { source: 'instagram', medium: 'paid-social', paid: true },
  'linkedin-ads': { source: 'linkedin', medium: 'paid-social', paid: true },
  'tiktok-ads': { source: 'tiktok', medium: 'paid-social', paid: true },
  'snapchat-ads': { source: 'snapchat', medium: 'paid-social', paid: true },
  'youtube-ads': { source: 'youtube', medium: 'paid-video', paid: true },
  'ai-ads': { source: '', medium: 'paid-ai', paid: true, customSource: true },
  annan: { source: '', medium: 'referral', customSource: true }
};

function normalizeValue(value) {
  var s = String(value || '').trim().toLowerCase();
  if (s.normalize) s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o');
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');
  return s;
}

function safeUrl(raw) {
  var value = String(raw || '').trim();
  if (!value) throw new Error('Fyll i länken till sidan.');
  if (!/^[a-z][a-z0-9+.-]*:/i.test(value) && value.charAt(0) !== '/') value = 'https://' + value;
  var url;
  try { url = new URL(value, window.location.origin); } catch (e) { throw new Error('Kontrollera att länken till sidan är korrekt.'); }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Länken måste börja med http:// eller https://.');
  return url;
}

function normalizeDomain(url, root) {
  var originalHost = String(url.hostname || '').toLowerCase();
  var host = originalHost;
  var required = configuredDomains(root, 'data-www-required');
  var removed = configuredDomains(root, 'data-www-removed');

  for (var i = 0; i < required.length; i++) {
    if (host === required[i] || host === 'www.' + required[i]) {
      host = 'www.' + required[i];
      break;
    }
  }

  if (host === originalHost) {
    for (var j = 0; j < removed.length; j++) {
      if (host === 'www.' + removed[j]) {
        host = removed[j];
        break;
      }
    }
  }

  if (host !== originalHost) url.hostname = host;
  return {
    url: url,
    changed: host !== originalHost,
    fromHost: originalHost,
    toHost: host
  };
}

function setCustomSource(root, show) {
  var box = root.querySelector('.hk-campaign-source-custom');
  var input = root.querySelector('[name="sourceCustom"]');
  if (!box || !input) return;
  box.hidden = !show;
  input.required = !!show;
  if (!show) input.value = '';
}

function getValue(root, selector) {
  var el = root.querySelector(selector);
  return el ? el.value : '';
}

function buildCampaign(root) {
  var normalized = normalizeDomain(safeUrl(getValue(root, '[name="targetUrl"]')), root);
  var baseUrl = normalized.url;
  var campaign = normalizeValue(getValue(root, '[name="campaign"]'));
  var channelKey = getValue(root, '[name="channel"]');
  var cfg = CHANNELS[channelKey];
  var content = normalizeValue(getValue(root, '[name="content"]'));

  if (!campaign) throw new Error('Fyll i ett kampanjnamn.');
  if (!cfg) throw new Error('Välj var kampanjen ska användas.');

  var source = cfg.customSource ? normalizeValue(getValue(root, '[name="sourceCustom"]')) : cfg.source;
  if (!source) throw new Error('Fyll i källa eller plattform.');
  var medium = cfg.medium;

  ['utm_campaign', 'utm_source', 'utm_medium', 'utm_content'].forEach(function (key) { baseUrl.searchParams.delete(key); });

  var params = new URLSearchParams();
  params.set('utm_campaign', campaign);
  params.set('utm_source', source);
  params.set('utm_medium', medium);
  if (content) params.set('utm_content', content);

  var fullUrl = new URL(baseUrl.toString());
  params.forEach(function (value, key) { fullUrl.searchParams.set(key, value); });

  return {
    url: fullUrl.toString(),
    baseUrl: baseUrl.toString(),
    params: params.toString(),
    campaign: campaign,
    source: source,
    medium: medium,
    content: content,
    paid: !!cfg.paid,
    qr: !!cfg.qr,
    domainChanged: normalized.changed,
    domainFromHost: normalized.fromHost,
    domainToHost: normalized.toHost
  };
}

function createQrSvg(url) {
  var qr = new QRCode({ content: url, padding: 4, ecl: 'M', color: '#000000', background: '#ffffff' });
  return qr.svg({ container: 'svg' });
}

function showError(root, message) {
  var box = root.querySelector('.hk-campaign-error');
  if (!box) return;
  box.textContent = message;
  box.hidden = false;
}

function clearError(root) {
  var box = root.querySelector('.hk-campaign-error');
  if (!box) return;
  box.textContent = '';
  box.hidden = true;
}

function setStatus(root, message) {
  var box = root.querySelector('.hk-campaign-status');
  if (box) box.textContent = message || '';
}

function renderResult(root, data) {
  var result = root.querySelector('.hk-campaign-result');
  var fullPanel = root.querySelector('.hk-campaign-full-link-panel');
  var paidPanel = root.querySelector('.hk-campaign-paid-panel');
  var paidNote = root.querySelector('.hk-campaign-paid-note');
  var grid = root.querySelector('.hk-campaign-result-grid');
  var qrPanel = root.querySelector('.hk-campaign-qr-panel');
  var qr = root.querySelector('.hk-campaign-qr');
  var domainNote = root.querySelector('.hk-campaign-domain-note');
  if (!result) return;

  root.querySelector('.hk-campaign-result-url').value = data.url;
  root.querySelector('.hk-campaign-link').href = data.url;
  root.querySelector('.hk-campaign-result-base-url').value = data.baseUrl;
  root.querySelector('.hk-campaign-result-params').value = data.params;

  root.querySelector('.hk-value-campaign').textContent = data.campaign;
  root.querySelector('.hk-value-source').textContent = data.source;
  root.querySelector('.hk-value-medium').textContent = data.medium;
  root.querySelector('.hk-value-content').textContent = data.content;
  root.querySelector('.hk-value-content-row').hidden = !data.content;

  fullPanel.hidden = data.paid;
  paidPanel.hidden = !data.paid;
  paidNote.hidden = !data.paid;
  qrPanel.hidden = !data.qr;
  grid.classList.toggle('hk-campaign-result-grid--single', !data.qr);

  if (data.domainChanged) {
    domainNote.textContent = 'Adressen har anpassats automatiskt från ' + data.domainFromHost + ' till ' + data.domainToHost + ' enligt webbplatsens domäninställningar.';
    domainNote.hidden = false;
  } else {
    domainNote.textContent = '';
    domainNote.hidden = true;
  }

  root._hkCampaignSvg = '';
  if (data.qr && qr) {
    var svg = createQrSvg(data.url);
    qr.innerHTML = svg;
    root._hkCampaignSvg = svg;
    root._hkCampaignFilename = 'qr-' + data.campaign + '-' + data.source + '.svg';
  } else if (qr) {
    qr.innerHTML = '';
  }

  result.hidden = false;
  if (data.paid) setStatus(root, 'Landningsadress och UTM-parametrar är klara.');
  else if (data.qr) setStatus(root, 'Kampanjlänken och QR-koden är klara.');
  else setStatus(root, 'Kampanjlänken är klar.');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function copyValue(root, selector, successMessage) {
  var el = root.querySelector(selector);
  if (!el) return;
  var value = el.value;
  function done() { setStatus(root, successMessage); }
  function fallback() {
    el.focus();
    el.select();
    try { document.execCommand('copy'); done(); } catch (e) { setStatus(root, 'Markera texten och kopiera den manuellt.'); }
  }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(done, fallback);
  else fallback();
}

function downloadSvg(root) {
  if (!root._hkCampaignSvg) return;
  var blob = new Blob([root._hkCampaignSvg], { type: 'image/svg+xml;charset=utf-8' });
  var href = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = href;
  a.download = root._hkCampaignFilename || 'kampanj-qr.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(function () { URL.revokeObjectURL(href); }, 1000);
  setStatus(root, 'QR-koden har laddats ner som SVG.');
}

function bind(root) {
  if (root.getAttribute('data-hk-campaign-bound') === 'true') return;
  root.setAttribute('data-hk-campaign-bound', 'true');

  var form = root.querySelector('.hk-campaign-form');
  var channel = root.querySelector('[name="channel"]');
  var download = root.querySelector('.hk-campaign-download');

  channel.addEventListener('change', function () {
    var cfg = CHANNELS[channel.value];
    setCustomSource(root, !!(cfg && cfg.customSource));
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearError(root);
    setStatus(root, '');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    try { renderResult(root, buildCampaign(root)); }
    catch (e) { showError(root, e && e.message ? e.message : 'Kampanjmätningen kunde inte skapas.'); }
  });

  form.addEventListener('reset', function () {
    window.setTimeout(function () {
      setCustomSource(root, false);
      clearError(root);
      setStatus(root, '');
      var result = root.querySelector('.hk-campaign-result');
      if (result) result.hidden = true;
      root._hkCampaignSvg = '';
    }, 0);
  });

  var copy = root.querySelector('.hk-campaign-copy');
  var copyBase = root.querySelector('.hk-campaign-copy-base');
  var copyParams = root.querySelector('.hk-campaign-copy-params');
  if (copy) copy.addEventListener('click', function () { copyValue(root, '.hk-campaign-result-url', 'Länken är kopierad.'); });
  if (copyBase) copyBase.addEventListener('click', function () { copyValue(root, '.hk-campaign-result-base-url', 'Landningsadressen är kopierad.'); });
  if (copyParams) copyParams.addEventListener('click', function () { copyValue(root, '.hk-campaign-result-params', 'UTM-parametrarna är kopierade.'); });
  if (download) download.addEventListener('click', function () { downloadSvg(root); });
}

export default (initialState, el) => {
  if (!el) return;
  const roots = el.matches && el.matches('.hk-campaign-tool')
    ? [el]
    : Array.from(el.querySelectorAll('.hk-campaign-tool'));
  roots.forEach(bind);
};
