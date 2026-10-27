# Skapa kampanjlänk för Sitevision

Skapa kampanjlänk är en WebApp för Sitevision som hjälper redaktörer att skapa enhetliga kampanjlänkar med UTM-parametrar. För trycksaker och fysisk miljö kan verktyget också skapa QR-koder.

Verktyget är främst avsett att användas på intranätet eller på en annan sida som bara redaktörer och andra behöriga användare kommer åt.

Det går tekniskt att använda WebAppen på en publik webbplats, men vi rekommenderar inte att verktyget görs tillgängligt för allmänheten.

## Det här gör WebAppen

- skapar UTM-länkar för vanliga kampanjkanaler
- hjälper redaktören att använda samma kampanjnamn i flera kanaler
- ger särskild vägledning för betald annonsering
- skapar QR-kod som SVG för trycksaker och fysisk miljö
- genererar QR-koden lokalt i webbläsaren
- bevarar andra parametrar som redan finns i mål-URL:en
- ersätter befintliga UTM-parametrar i stället för att skapa dubletter
- kan anpassa `www` per domän genom globala inställningar
- använder Sitevisions och Envisions standardstilar i största möjliga mån
- är byggd med tillgänglighet enligt WCAG 2.2 AA i åtanke

WebAppen skickar ingen statistik till Piwik PRO. Den skapar bara länkar som sedan kan mätas när de används.

## Använd tillsammans med Besöksstatistik

WebAppen passar bra tillsammans med [Besöksstatistik för Sitevision](https://github.com/lindstrand/sitevision-besoksstatistik).

**Skapa kampanjlänk** hjälper redaktören att skapa rätt UTM-parametrar. **Besöksstatistik** kan sedan visa kampanjtrafiken direkt i Sitevisions dashboard.

## Krav

Du behöver:

- Sitevision med stöd för WebApps 2
- behörighet att hantera tillägg i Sitevision
- Node.js om du vill bygga WebAppen från källkod
- ett Sitevision-godkänt certifikat om WebAppen ska användas i produktion

Piwik PRO behövs inte för att själva kampanjverktyget ska fungera, men UTM-länkarna är avsedda att kunna följas i ett analysverktyg som Piwik PRO.

## Installera

Se [INSTALLATION.md](INSTALLATION.md) för hela installationen, inklusive hur du installerar Node.js, bygger WebAppen och signerar den med ett eget Sitevision-certifikat.

## Globala inställningar

Under WebAppens globala inställningar kan du ange:

- domäner som alltid ska använda `www`
- domäner där `www` ska tas bort

Lämna fälten tomma om inga domänregler behövs.

## Bygga från källkod

Packa upp eller klona projektet i en ny, ren mapp och kör:

```powershell
npm.cmd ci
npm.cmd run build
```

Den färdiga ZIP-filen skapas i mappen `dist`.

Se [INSTALLATION.md](INSTALLATION.md) om du inte har byggt en Sitevision-app tidigare.

## Säkerhet och integritet

WebAppen lagrar inte det redaktören skriver in och skickar inte mål-URL:er, kampanjnamn eller UTM-parametrar till någon extern tjänst.

QR-koder skapas lokalt i webbläsaren.

Serverloggning använder Sitevisions `LogUtil`. Loggen innehåller inte kampanjnamn, URL:er, UTM-parametrar eller användaruppgifter.

Se [SECURITY.md](SECURITY.md) för mer information.
