# PM 
*Natalie Tuomi 18 April 2023*

---

## Inledning
Arbetets syfte var att sammanfoga två tidigare projekt. Genom att slå ihop ett login-system med en forumsida så ska resultatet bli en forumsida där användare kan logga in eller skapa användare för att sedan posta eller kommentera med hjälp av sin användare. Allt arbete var enskilt och upplägget kunde variera beroende på vad man hade med sig från de tidigare projekten och hur man tänkte slå ihop dem. 

---

## Bakgrund
Planeringen började med ett anteckningsblock och flera flödesscheman. För att få en mental bild av hur det skulle vara uppdelat ritade jag upp snabba skisser på alla sidor som skulle skapas. Därefter gjorde jag ett flödesschema till varje sida där interaktionen mellan det grafiska, eller form-elementen, och det bakomliggande. De här interaktionerna sammanfattar hur routerna ska fungera och kan innehålla flera router per sida. Varje sida hade garanterat en GET, men det varierade lite i antalet POST. Jag ritade dessutom upp små tabeller som skulle föreställa databasen med alla relevanta kolumner och vad de skulle heta.

[Flödesdiagram förstasidan](/images/homepage.jpg) 

[Flödesdiagram loginsidan](/images/login.jpg)

[Flödesdiagram registreringssidan](/images/register.jpg)

[Flödesdiagram göra ett inlägg sidan](/images/new.jpg)

[Flödesdiagram specifik post](/images/post.jpg)

[Flödesdiagram profilsidan](/images/profile.jpg)

När planeringen var färdig hade jag en ganska bra bild på vad jag skulle arbeta mot och hur jag skulle ta mig dit. Grundrepot forkades, paket laddades ner och sedan började jag med att gå igenom varenda fil och mapp för att jämföra med det jag hade i de tidigare projekten. Det gav mig en ganska stabil grund att fortsätta med. Det var även här jag skapade en fil i view för varje sida som skulle göras. Innehållet i dem blev en blandning av de två projekten och utgick då från de hastiga skisserna jag tidigare hade gjort. Jag skapade även tre tabeller i databasen. Se a och b i nedanstående tabeller för att se vilka värden som jämförs för att hitta tillhörande inlägg eller författare.

**nt19logins**
|id| username | password |
|----------|------|-----|
|a |     ?    |    ?     |

**nt19posts**
|id| authorId | title | content | createdAt |
|----------|------|-----|--------|-----|
|b |     a    |   ?   |    ?    |     ?     |

**nt19commentary**
|id| authorId | postId | content | createdAt |
|----------|------|-----|--------|-----|
|? |     a    |    b   |    ?    |     ?     |

Sedan var det dags att arbeta med routerna. Sex sidor fick en GET vardera. Både förstasidan och sidan för ett specifikt inlägg använde SQL vilket förhandstestades i Tableplus för att få till det korrekt. Därefter lades POST routerna till. I det här stadiet var de främst inklistrade från dem tidigare projekten vilket medvetet gjordes även om det skulle leda till massor med fel. Det var inte alltid rätt, men de var bra grundstenar att redigera eller lägga till för att kunna stadigt arbeta mot målet.

Låt säga så här. Vid det här laget fungerade kanppt någonting, men det fanns iallafall där. Det betydde att man kunde arbeta sig inåt. Testa att ladda in dem olika sidorna. Testa att fylla i formulären och trycka på knappar. Funkar det? Bra. Fungerar det inte? Vad säger terminalen? Kan man se felet rakt av i routen? Lös det helt enkelt. När de sedan fungerade kunde man lägga lite tid på navigation och scss för att göra det enklare att jobba med.I efterhand kunde jag arbeta med validator för att städa upp inputen från formulären. Dessutom kunde valideringen av användarnamn, lösenord och liknande fält förfinas med lite mer genomtänkta specifikationer än det var från början.

---

## Bra
Arbetet byggde inte på nya tekniker utan var istället en sammanfogning av tidigare projekt. Det gjorde det enklare att ta sig framåt och faktiskt förstå vad man höll på med. Det blev mer fokus på att få in det man på någon nivå redan kunde än att lära sig från grunden. Det fick materialen att fastna mer, men underströk också vikten av god planering. Det här var första gången jag skapade egna tabeller i databasen utan att följa steg för steg instruktioner, men det gick väldigt smidigt eftersom jag kunde titta tillbaka på tidigare arbeten för att skapa tabeller som var väl utstakade på papper. 

---

## Mindre bra
Jag försökte mig på att använda en error samling för att visa användaren vad som gick fel när formulären inte godtog inputen. Det var lite väl svårt att lista ut hur man skulle göra utan referensmaterial och tidsbrist fick den idén att läggas på hyllan. Det skulle kunna vara något kul att lära sig i framtiden. Jag försökte mig även på att kunna radera ens egna kommentarer om man var inloggad, men stötte på problem med att få fram kommentarens id. Det hade kunnat fixas om man hade mer tid. 

---

## Sammanfattning
Jag är nöjd med hur min sida uppfyller syftet med uppgiften. Det är en fungerande sammanslagning av forumsidan och login-systemet. Arbetssättet fungerade bra på att utveckla det bitvis och sedan uppdatera eller förbättra efterhand. Det gjorde att det följde planeringen utan att nödvändigtvis fastna på någon specifik del av det nödvändiga. När jag sedan försökte vidareutveckla gick det lite blandat, men det lämnar öppet möjligheter för framtiden.