# AutoTask Planner v2

Pomocník pro hromadné vytváření tasků **Global Presales Task** v Salesforce Lightning (bez API – ovládá stránku přes DOM).
Běží jako bookmarklet, takže pracuje v přihlášené session; nic se neodesílá mimo prohlížeč.

## Co je nového oproti v1
* **Nové grafické rozhraní** – velké okno se záložkami ① Opportunities · ② Plán tasků · ③ Nastavení, stavovým řádkem, ukazatelem průběhu a logem. Jde zmenšit (▁) na malou lištu.
* **Víc tasků** – přidání libovolného počtu vlastních tasků (＋ Přidat), duplikace, mazání, až 50 tasků/týden.
* **Změna nastavení každého tasku** přímo v tabulce: datum, fáze, Task Type, předmět, Product, Audience, Status.
* **Hromadné úpravy** vybraných tasků: fáze, typ, produkt, audience, status, nastavit datum nebo posunout o ± dní.
* **Přehled týdnů** – barevný pruh pro každou optu (prázdný / pod cílem / splněno / nad cíl / obsahuje plánované).
* **Rychlejší vyplňování** – režim Turbo, rychlejší kontrola data, automatické jedno opakování při chybě, vytvořené tasky se označí a už se nevytvářejí znovu.
* Čeština (výchozí) + angličtina.

## Jednoduchý režim (výchozí)
Průvodce ve 3 krocích: **1) vyberte opty → 2) vyberte týden a počet tasků na optu → 3) zkontrolujte a vytvořte**. Existující tasky se nečtou, vytváří se jen nové..
Pokročilé funkce (hromadné úpravy, přehled týdnů, vlastní tasky, nastavení) jsou za tlačítkem **⚙ Pokročilý režim** v záhlaví.

## Rychlá varianta: jedna opportunita → N tasků
Otevřete záznam opportunity (`/lightning/r/Opportunity/.../view`) a spusťte nástroj. Zobrazí se karta „Vytvořit tasky v této opportunitě“: zadáte počet tasků (výchozí 5), týden, Product a Audience → **Připravit tasky** → zkontrolujete → **Vytvořit**. Fáze a typy se navrhnou podle toho, co už v opportunitě existuje. Bez pomocného okna, vše přímo v otevřené optě.

## Log a diagnostika
Dolní lišta (v jednoduchém i pokročilém režimu) zobrazuje log s časem. Tlačítka: **📋 Kopírovat log**, **⬇ Stáhnout log** (soubor .txt), **🗑** smazat. Log se ukládá i mezi spuštěními (localStorage). Při selhání otevření formuláře se do logu zapíše URL a seznam viditelných tlačítek. Pokud se skript nespustí, zobrazí se nahoře červený pruh s chybou (jde zkopírovat) a stejný výpis je v konzoli (`F12` → Console, prefix `[AutoTask]`).

## Instalace
1. Z `dist/` naimportujte `autotask-bookmarks.html` do záložek prohlížeče (nebo vytvořte záložku s URL z `dist/bookmarklet.txt`).
2. Starou záložku „AutoTask Planner“ nejdřív smažte.
3. Otevřete `/lightning/o/Opportunity/list` a klikněte na záložku. Druhé kliknutí panel zavře.
4. Povolte vyskakovací okna pro `*.lightning.force.com` (skenování a vyplňování běží v pomocném okně).

## Postup práce
1. **① Opportunities** – „Skenovat viditelné opty“ → zaškrtnout → „Přidat vybrané do fronty“ → „Skenovat frontu“ (načte existující tasky a vygeneruje plán).
2. **② Plán tasků** – zkontrolujte přehled týdnů, upravte tasky v tabulce nebo hromadně, případně přidejte vlastní.
3. Zaškrtněte tasky a dole klikněte **▶ Vytvořit vybrané**. Během vyplňování neklikejte do okna panelu.
4. **③ Nastavení** – výchozí Product/Audience/Status, rozsah dat, tasků za týden, rychlost, automatické Save, formát data.

Status „Not Started“ znamená, že se status ve formuláři nemění. Task Type závisí na fázi (Discover / Analyze / Design / Defend).

## Řešení potíží
* Nenalezeno „More Standard Task Actions“ → opta nemá sekci Activity, zkuste znovu.
* Menu Category/Task Type ztrácí volby → v nastavení zvolte rychlost „Klidně“ nebo „Velmi pomalu“.
* Due Date odmítnuto → v nastavení zvolte ručně formát data své instance.
* Pomocné okno se neotevře → povolte popupy.
* Seznam Opportunities je virtuální → posuňte ho a skenujte znovu.

## English summary
Panel language can be switched to English in the header. Workflow is identical: scan list → queue → scan queue → review/edit/bulk-edit plan → create selected. Settings tab holds defaults, date range, tasks/week, speed (Turbo/Fast/Calm/Very slow), auto-save and date format.

## Vývoj
Zdroj je v `src/` (`engine.js` = ovládání Salesforce, `ui.js` = rozhraní). `python3 build.py` vygeneruje `dist/`.
Automatizace závisí na Aura selektorech Salesforce (např. `More Standard Task Actions`, `input[aria-label="Subject"]`) – při změně UI Salesforce je potřeba upravit `engine.js`.
