# Teknisk dokumentation – Skapa kampanjlänk 1.0.0

## Arkitektur

Version 1.0.0 är en riktig Sitevision WebApps 2-app.

- `src/index.js` är server-entrypoint.
- `src/main.js` är klient-entrypoint.
- Sitevision-API importeras från `@sitevision/api`.
- Bygg och signering görs med `@sitevision/sitevision-scripts`.
- `manifest.json` har `bundled: true`.
- Ingen storage används.
- Ingen privileged API-användning används.
- Ingen extern backend används.

## Klientfunktion

UTM-länkar, kopiering och QR-kod skapas i webbläsaren.

QR-bibliotek: `qrcode-compact-svg` 1.1.0, MIT.

## Global konfiguration

`wwwRequiredDomains` anger domäner som alltid ska använda `www`.

`wwwRemovedDomains` anger domäner där `www` ska tas bort.

Okända domäner lämnas oförändrade.

## Loggning

Serversidan använder Sitevisions `LogUtil`.

Endast generell renderingsstatus eller feltyp loggas. Användarens URL, kampanjnamn och UTM-värden loggas inte.

## Tillgänglighet

WebAppen använder semantiska formulärfält och etiketter, `aria-describedby`, `required`, `role="alert"` och `role="status"`.

Funktionen kan användas med tangentbord, respekterar `prefers-reduced-motion` och QR-koden är aldrig den enda informationsbäraren.

## Build

```powershell
npm.cmd ci
npm.cmd run build
```

## Signering

```powershell
npm.cmd run sign
```
