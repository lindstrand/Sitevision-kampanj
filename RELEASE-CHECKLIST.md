# Checklista för en ny version

Den här checklistan är till för den som utvecklar eller publicerar WebAppen.

## 1. Börja i en ren mapp

Skapa en ny mapp för varje version. Lägg inte nya filer ovanpå en gammal arbetsmapp.

## 2. Kontrollera versionen

Samma versionsnummer ska finnas i:

- `manifest.json`
- `package.json`
- `package-lock.json`
- `APP_VERSION` i `src/index.js`

## 3. Installera beroenden

```powershell
npm.cmd ci
```

## 4. Kör kontrollerna

```powershell
npm.cmd audit
npm.cmd run check
```

## 5. Bygg

```powershell
npm.cmd run build
```

Bygget ska avslutas med `Compression successful`.

## 6. Testa i Sitevision

Testa minst:

- vanlig kampanjlänk
- organisk social kanal
- betald annonsering
- QR-kod och SVG-nedladdning
- kopieringsknappar
- befintliga query-parametrar
- ersättning av befintliga UTM-parametrar
- globala domänregler
- tangentbord och synligt fokus
- 200 och 400 procent zoom
- smal skärm
- högkontrast
- reduced motion

## 7. Granska säkerhet och integritet

Kontrollera att:

- ingen användarinmatning loggas
- inga externa nätverksanrop har lagts till utan att det är avsiktligt
- inga nya cookies eller lokal lagring har lagts till utan dokumentation
- inga privata nycklar, certifikat, tokens eller lösenord finns i källkoden
- tredjepartsberoenden och deras licenser är kända

## 8. Publicera källkoden

Kontrollera att följande inte finns med:

- `node_modules`
- `dist`
- `.dev_properties.json`
- `.env`
- certifikat
- privata nycklar

## 9. Signera

När den byggda versionen är testad:

```powershell
npm.cmd run sign
```

Testa även den signerade versionen innan produktion.
