# Installera Skapa kampanjlänk

Den här guiden beskriver hela vägen från källkod till en signerad WebApp i Sitevision.

Du behöver inte ha arbetat med Sitevision-utveckling tidigare. Följ stegen i ordning.

## 1. Bestäm var verktyget ska användas

Vi rekommenderar att WebAppen placeras på intranätet eller på en annan sida som bara redaktörer och andra behöriga användare kommer åt.

Det går tekniskt att lägga den på en publik webbplats, men då kan vem som helst använda verktyget för att skapa kampanjlänkar och QR-koder. Det rekommenderas därför inte.

Använd Sitevisions vanliga sidbehörigheter och publiceringsregler för att styra vem som kan komma åt sidan.

## 2. Installera Node.js

För att bygga WebAppen på din dator behöver du **Node.js**.

Node.js innehåller också **npm**, som används för att hämta de paket som projektet behöver och för att köra byggkommandona.

Sitevisions nuvarande utvecklingsverktyg kräver Node.js 20.9 eller senare.

1. Gå till [nodejs.org](https://nodejs.org/).
2. Installera en aktuell LTS-version av Node.js.
3. Använd standardvalen i installationen.

När installationen är klar öppnar du **PowerShell** i Windows.

Skriv:

```powershell
node --version
npm --version
```

Om båda kommandona visar ett versionsnummer är installationen klar.

## 3. Hämta källkoden

På GitHub väljer du:

**Code → Download ZIP**

Packa upp ZIP-filen i en ny, tom mapp.

Du behöver inte ha Git installerat för att bygga WebAppen.

## 4. Öppna PowerShell i projektmappen

Öppna den uppackade projektmappen i Utforskaren.

Klicka i adressfältet, skriv:

```text
powershell
```

och tryck Enter.

Då öppnas PowerShell direkt i rätt mapp.

Kontrollera att bland annat `package.json`, `manifest.json` och mappen `src` finns där.

## 5. Installera projektets paket

Kör:

```powershell
npm.cmd ci
```

Kommandot läser `package-lock.json` och installerar de paket som behövs för att bygga WebAppen.

Varningar om äldre beroenden kan förekomma. Det viktiga är att kommandot avslutas utan fel och att `npm audit` inte visar kända sårbarheter.

## 6. Bygg WebAppen

Kör:

```powershell
npm.cmd run build
```

Bygget:

1. kontrollerar versionsnumret
2. kör projektets säkerhetskontroll
3. kompilerar JavaScript och CSS
4. skapar en Sitevision-ZIP

När bygget lyckas skapas mappen:

```text
dist
```

En lyckad build avslutas normalt med:

```text
Compression successful
```

Den osignerade ZIP-filen kan användas i en utvecklingsmiljö som tillåter osignerade appar.

För produktion behöver WebAppen signeras.

## 7. Testa i Sitevision

Importera ZIP-filen från `dist` i en testmiljö.

Testa minst:

- vanlig kampanjlänk
- organisk social kanal
- betald annonsering
- QR-kod
- kopiera länk
- ladda ner QR-kod som SVG
- befintliga query-parametrar
- befintliga UTM-parametrar
- globala domänregler
- tangentbordsanvändning och synligt fokus
- 200 och 400 procent zoom
- smal skärm

## 8. Skaffa ett Sitevision-certifikat

WebApps som ska användas på en produktionswebbplats måste signeras med ett certifikat som är godkänt av Sitevision.

1. Gå till [developer.sitevision.se](https://developer.sitevision.se/).
2. Logga in eller skapa ett konto.
3. Bli medlem i ett team.
4. Öppna teamets sida.
5. Skapa ett certifikat.

Certifikatet hör till teamet. Ett av teamets certifikat är standardcertifikat och används om du inte väljer något annat när du signerar.

## 9. Lägg certifikatet på webbplatsen

Ladda ner certifikatets publika del från teamets sida på developer.sitevision.se.

I Sitevision:

1. Öppna **Webbplatsinställningar**.
2. Gå till **Tilläggscertifikat**.
3. Lägg till certifikatet bland de betrodda certifikaten.

Webbplatsen måste lita på samma certifikat som används när WebAppen signeras.

## 10. Signera WebAppen

Stå kvar i samma PowerShell-fönster och kör:

```powershell
npm.cmd run sign
```

Du får ange användarnamn och lösenord för developer.sitevision.se.

Sedan får du frågan:

```text
Certificate name for signing (blank for default)
```

Tryck Enter om du vill använda teamets standardcertifikat.

När signeringen lyckas skapas en signerad ZIP-fil i `dist`. Den har normalt `-signed` i filnamnet.

## 11. Installera i produktion

1. Öppna **Tillägg** i Sitevision.
2. Importera den signerade ZIP-filen.
3. Aktivera den nya versionen.
4. Lägg till WebAppen på den sida där den ska användas.
5. Kontrollera sidans behörigheter.
6. Ställ in eventuella domänregler under **Globala inställningar**.

Glöm inte att aktivera den importerade versionen.

## macOS och Linux

Guiden ovan använder PowerShell eftersom den är skriven för Windows.

På macOS och Linux använder du Terminal och samma npm-kommandon utan `.cmd`:

```bash
npm ci
npm run build
npm run sign
```
