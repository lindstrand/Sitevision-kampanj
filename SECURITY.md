# Säkerhet och integritet

## Rekommenderad placering

WebAppen är avsedd som ett redaktörsverktyg och bör normalt placeras på intranätet eller på en annan sida som bara behöriga användare når.

WebAppen har ingen egen inloggning eller egen behörighetskontroll. Åtkomsten styrs därför med Sitevisions vanliga sidbehörigheter och publiceringsregler.

## Ingen extern tjänst

WebAppen skickar inte mål-URL, kampanjnamn eller UTM-parametrar till någon extern tjänst.

QR-koden skapas lokalt i webbläsaren med `qrcode-compact-svg`.

## Ingen lagring

WebAppen lagrar inte det redaktören skriver in och använder ingen egen datalagring.

Den använder inte cookies, `localStorage` eller `sessionStorage` för kampanjdata.

## URL-kontroll

Endast `http:` och `https:` accepteras som målprotokoll.

Länken **Testa länken** öppnas i en ny flik och använder `rel="noopener noreferrer"`.

## Loggning

WebAppen använder Sitevisions `LogUtil`.

Loggen kan innehålla:

- appversion
- generell renderingsstatus på debug-nivå
- generell feltyp om serverrenderingen misslyckas

Loggen innehåller inte:

- mål-URL
- kampanjnamn
- källa
- UTM-parametrar
- användarnamn
- IP-adresser
- cookies
- tokens
- lösenord

## QR-bibliotek

QR-koden skapas med `qrcode-compact-svg` 1.1.0, som har MIT-licens.

Den del av biblioteket som används i WebAppen är webbläsaranpassad och gör ingen filsystemsåtkomst eller nätverkskommunikation.

## Automatisk säkerhetskontroll

Före build och signering körs:

```powershell
npm.cmd run check
```

Kontrollen verifierar versionsnumret och letar efter vanliga typer av känsliga filer och hemligheter i projektmappen.

Projektets `.gitignore` utesluter bland annat `node_modules`, `dist`, `.dev_properties.json`, `.env` och vanliga certifikat- och nyckelfiler.
