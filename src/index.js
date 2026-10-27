import router from '@sitevision/api/common/router';
import globalAppData from '@sitevision/api/server/globalAppData';
import appInfo from '@sitevision/api/server/appInfo';
import logUtil from '@sitevision/api/server/LogUtil';

const APP_VERSION = '1.0.0';
const LOG_PREFIX = `[Skapa kampanjlänk ${APP_VERSION}]`;

function logError(message, error) {
  try {
    if (!logUtil.isErrorEnabled()) return;
    const name = String((error && error.name) || 'Error')
      .replace(/[^A-Za-z0-9_.-]/g, '')
      .substring(0, 80);
    logUtil.error(`${LOG_PREFIX} ${message} detail=${name || 'Error'}`);
  } catch (ignore) {}
}

function logDebug(message) {
  try {
    if (logUtil.isDebugEnabled()) logUtil.debug(`${LOG_PREFIX} ${message}`);
  } catch (ignore) {}
}

function escapeAttr(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getGlobalString(key, fallback) {
  try {
    var value = globalAppData.get(key);
    if (value === null || typeof value === 'undefined') return fallback || '';
    return String(value);
  } catch (ignore) {
    return fallback || '';
  }
}

function idSuffix() {
  var raw = '';
  try {
    raw = appInfo && appInfo.addon && appInfo.addon['jcr:uuid'] ? appInfo.addon['jcr:uuid'] : '';
  } catch (ignore) { raw = ''; }
  raw = String(raw || 'instance').replace(/[^a-zA-Z0-9_-]/g, '-');
  return raw || 'instance';
}

function html(wwwRequiredDomains, wwwRemovedDomains) {
  var suffix = idSuffix();
  var ids = {
    url: 'hk-campaign-url-' + suffix,
    urlHelp: 'hk-campaign-url-help-' + suffix,
    name: 'hk-campaign-name-' + suffix,
    nameHelp: 'hk-campaign-name-help-' + suffix,
    channel: 'hk-campaign-channel-' + suffix,
    channelHelp: 'hk-campaign-channel-help-' + suffix,
    source: 'hk-campaign-source-custom-' + suffix,
    sourceHelp: 'hk-campaign-source-custom-help-' + suffix,
    content: 'hk-campaign-content-' + suffix,
    contentHelp: 'hk-campaign-content-help-' + suffix,
    resultTitle: 'hk-campaign-result-title-' + suffix,
    resultUrl: 'hk-campaign-result-url-' + suffix,
    resultBaseUrl: 'hk-campaign-result-base-url-' + suffix,
    resultParams: 'hk-campaign-result-params-' + suffix
  };
  return '<div class="hk-campaign-tool" data-www-required="' + escapeAttr(wwwRequiredDomains) + '" data-www-removed="' + escapeAttr(wwwRemovedDomains) + '">' +
    '<p class="hk-campaign-intro">Skapa rätt kampanjmätning för sociala medier, annonser, nyhetsbrev, webblänkar eller trycksaker. Verktyget anpassar resultatet efter hur länken ska användas.</p>' +
    '<form class="hk-campaign-form env-form" novalidate>' +
      '<div class="hk-campaign-grid">' +
        '<div class="hk-campaign-field hk-campaign-field--wide env-form-field">' +
          '<label class="hk-campaign-label env-form-label" for="' + ids.url + '">Länk till sidan <span class="hk-campaign-required">(obligatoriskt)</span></label>' +
          '<input class="hk-campaign-input env-form-input" id="' + ids.url + '" name="targetUrl" type="url" inputmode="url" autocomplete="url" required aria-describedby="' + ids.urlHelp + '">' +
          '<span class="hk-campaign-help env-form-field-help" id="' + ids.urlHelp + '">Öppna sidan som kampanjen ska leda till och kopiera adressen hit. Eventuella domänregler i de globala inställningarna används automatiskt.</span>' +
        '</div>' +
        '<div class="hk-campaign-field hk-campaign-field--wide env-form-field">' +
          '<label class="hk-campaign-label env-form-label" for="' + ids.name + '">Kampanjnamn <span class="hk-campaign-required">(obligatoriskt)</span></label>' +
          '<input class="hk-campaign-input env-form-input" id="' + ids.name + '" name="campaign" type="text" required maxlength="120" aria-describedby="' + ids.nameHelp + '">' +
          '<span class="hk-campaign-help env-form-field-help" id="' + ids.nameHelp + '">Använd samma kampanjnamn i alla kanaler som hör till samma satsning. Exempel: Sommarkampanj Hässleholm 2027.</span>' +
        '</div>' +
        '<div class="hk-campaign-field hk-campaign-field--wide env-form-field">' +
          '<label class="hk-campaign-label env-form-label" for="' + ids.channel + '">Var ska kampanjen användas? <span class="hk-campaign-required">(obligatoriskt)</span></label>' +
          '<select class="hk-campaign-select env-form-input" id="' + ids.channel + '" name="channel" required aria-describedby="' + ids.channelHelp + '">' +
            '<option value="">Välj</option>' +
            '<optgroup label="Trycksak och fysisk miljö">' +
              '<option value="affisch">Affisch</option><option value="broschyr">Broschyr</option><option value="skylt">Skylt</option><option value="trycksak">Annan trycksak</option>' +
            '</optgroup>' +
            '<optgroup label="E-post och webblänkar">' +
              '<option value="nyhetsbrev">Nyhetsbrev</option><option value="epost">E-post</option><option value="webbannons">Webbannons på annan webbplats</option><option value="pressmeddelande">Pressmeddelande</option>' +
            '</optgroup>' +
            '<optgroup label="Sociala medier, organiskt">' +
              '<option value="facebook-organic">Facebook</option><option value="instagram-organic">Instagram</option><option value="linkedin-organic">LinkedIn</option><option value="tiktok-organic">TikTok</option><option value="snapchat-organic">Snapchat</option><option value="youtube-organic">YouTube</option>' +
            '</optgroup>' +
            '<optgroup label="Betald annonsering">' +
              '<option value="google-ads">Google Ads</option><option value="facebook-ads">Facebook Ads</option><option value="instagram-ads">Instagram Ads</option><option value="linkedin-ads">LinkedIn Ads</option><option value="tiktok-ads">TikTok Ads</option><option value="snapchat-ads">Snapchat Ads</option><option value="youtube-ads">YouTube Ads</option><option value="ai-ads">AI-/annan annonsplattform</option>' +
            '</optgroup>' +
            '<option value="annan">Annat</option>' +
          '</select>' +
          '<span class="hk-campaign-help env-form-field-help" id="' + ids.channelHelp + '">Verktyget väljer källa, trafiktyp och om QR-kod behövs.</span>' +
        '</div>' +
        '<div class="hk-campaign-field hk-campaign-field--wide hk-campaign-custom hk-campaign-source-custom env-form-field" hidden>' +
          '<label class="hk-campaign-label env-form-label" for="' + ids.source + '">Källa eller plattform <span class="hk-campaign-required">(obligatoriskt)</span></label>' +
          '<input class="hk-campaign-input env-form-input" id="' + ids.source + '" name="sourceCustom" type="text" maxlength="80" aria-describedby="' + ids.sourceHelp + '">' +
          '<span class="hk-campaign-help env-form-field-help" id="' + ids.sourceHelp + '">Skriv till exempel chatgpt, perplexity eller namnet på den tjänst där annonsen visas.</span>' +
        '</div>' +
        '<div class="hk-campaign-field hk-campaign-field--wide env-form-field">' +
          '<label class="hk-campaign-label env-form-label" for="' + ids.content + '">Variant <span class="hk-campaign-required">(valfritt)</span></label>' +
          '<input class="hk-campaign-input env-form-input" id="' + ids.content + '" name="content" type="text" maxlength="120" aria-describedby="' + ids.contentHelp + '">' +
          '<span class="hk-campaign-help env-form-field-help" id="' + ids.contentHelp + '">Använd om du vill skilja flera annonser eller länkar i samma kanal åt, till exempel video-a och video-b.</span>' +
        '</div>' +
      '</div>' +
      '<div class="hk-campaign-actions">' +
        '<button class="hk-campaign-button hk-campaign-button--primary env-button env-button--primary" type="submit">Skapa kampanjmätning</button>' +
        '<button class="hk-campaign-button hk-campaign-reset env-button" type="reset">Rensa</button>' +
      '</div>' +
      '<div class="hk-campaign-error" role="alert" hidden></div>' +
    '</form>' +
    '<section class="hk-campaign-result" aria-labelledby="' + ids.resultTitle + '" hidden>' +
      '<h2 class="hk-campaign-output-heading" id="' + ids.resultTitle + '">Din kampanjmätning</h2>' +
      '<p class="hk-campaign-domain-note" hidden></p>' +
      '<div class="hk-campaign-paid-note" hidden><strong>Betald annonsering:</strong> Använd landningsadressen som mål-URL och lägg UTM-parametrarna i annonsplattformens fält för URL-parametrar eller motsvarande. Lägg inte samma UTM-parametrar på båda ställena.</div>' +
      '<div class="hk-campaign-result-grid">' +
        '<div>' +
          '<div class="hk-campaign-full-link-panel">' +
            '<label class="hk-campaign-label env-form-label" for="' + ids.resultUrl + '">Färdig kampanjlänk</label>' +
            '<textarea class="hk-campaign-url hk-campaign-result-url env-form-input" id="' + ids.resultUrl + '" readonly rows="4"></textarea>' +
            '<div class="hk-campaign-actions">' +
              '<button class="hk-campaign-button hk-campaign-copy env-button env-button--primary" type="button">Kopiera länk</button>' +
              '<a class="hk-campaign-button hk-campaign-link env-button env-button--link" href="#" target="_blank" rel="noopener noreferrer">Testa länken (öppnas i ny flik)</a>' +
            '</div>' +
          '</div>' +
          '<div class="hk-campaign-paid-panel" hidden>' +
            '<label class="hk-campaign-label env-form-label" for="' + ids.resultBaseUrl + '">Landningsadress</label>' +
            '<textarea class="hk-campaign-url hk-campaign-result-base-url env-form-input" id="' + ids.resultBaseUrl + '" readonly rows="2"></textarea>' +
            '<div class="hk-campaign-actions"><button class="hk-campaign-button hk-campaign-copy-base env-button" type="button">Kopiera landningsadress</button></div>' +
            '<label class="hk-campaign-label hk-campaign-label--spaced env-form-label" for="' + ids.resultParams + '">UTM-parametrar</label>' +
            '<textarea class="hk-campaign-url hk-campaign-result-params env-form-input" id="' + ids.resultParams + '" readonly rows="3"></textarea>' +
            '<div class="hk-campaign-actions"><button class="hk-campaign-button hk-campaign-copy-params env-button" type="button">Kopiera UTM-parametrar</button></div>' +
          '</div>' +
          '<div class="hk-campaign-status" role="status" aria-live="polite"></div>' +
          '<ul class="hk-campaign-values" aria-label="Mätvärden i kampanjen">' +
            '<li>Kampanj: <code class="hk-value-campaign"></code></li>' +
            '<li>Källa: <code class="hk-value-source"></code></li>' +
            '<li>Typ: <code class="hk-value-medium"></code></li>' +
            '<li class="hk-value-content-row">Variant: <code class="hk-value-content"></code></li>' +
          '</ul>' +
        '</div>' +
        '<div class="hk-campaign-qr-panel" hidden>' +
          '<h3>QR-kod</h3>' +
          '<div class="hk-campaign-qr" aria-hidden="true"></div>' +
          '<div class="hk-campaign-actions"><button class="hk-campaign-button hk-campaign-download env-button" type="button">Ladda ner QR-kod som SVG</button></div>' +
          '<p class="hk-campaign-help env-form-field-help">QR-koden innehåller samma kampanjlänk som visas bredvid.</p>' +
        '</div>' +
      '</div>' +
    '</section>' +
    '<div class="hk-campaign-note"><strong>Tips:</strong> Använd samma kampanjnamn i alla kanaler som hör till samma satsning. Då kan resultaten jämföras i besöksstatistiken.</div>' +
  '</div>';
}

router.get('/', (req, res) => {
  try {
    const wwwRequiredDomains = getGlobalString('wwwRequiredDomains', '');
    const wwwRemovedDomains = getGlobalString('wwwRemovedDomains', '');
    const markup = html(wwwRequiredDomains, wwwRemovedDomains);
    logDebug('Rendering klar.');
    return res.agnosticRender(markup, {});
  } catch (error) {
    logError('Rendering misslyckades.', error);
    return res.status(500).send(
      '<div class="hk-campaign-error" role="alert">Kampanjverktyget kunde inte visas. Försök igen.</div>'
    );
  }
});
