# AutoTask – jednoduchá verze (v3)

Otevřete opportunity → spusťte nástroj → zadejte jeden nebo víc tasků → **Vytvořit**.

* V panelu je vidět **Stage opportunity** a **fáze DADD** (čtou se z polí opportunity). Kategorie všech tasků je vždy **fáze DADD** (jde změnit ručně nahoře), u tasku vybíráte jen typ.
* **Týdny:** zaškrtnete jeden nebo více týdnů a zadáte počet tasků na týden; **Vygenerovat** vytvoří pro každý týden tolik tasků (2 týdny × 5 = 10). Názvy se liší, ale odpovídají fázi a typu (např. „Analyze - Cloud Assessment - follow-up (W44)“).
* **(starší popis) Týden:** vyberete týden a tasky se rozloží od pondělí do pátku (první v pondělí, poslední v pátek, ostatní rovnoměrně). Datum jde u tasku přepsat.
* **Název tasku se doplní automaticky** (kategorie – typ) a mění se s typem; jde přepsat.
* **Počet stejných tasků:** u každého tasku jde zadat počet kopií (1–20). Kopie mají stejný název i nastavení a datumy se rozloží mezi pondělí a pátek.
* Čtení Stage/DADD/produktu bere jen **viditelné** prvky (v konzoli Salesforce zůstávají v DOM schované záložky jiných opt). Před uložením se kontroluje pole **Related To** ve formuláři: když patří jiné opportunity, vytváření se zastaví.
* **Product a Audience se zadávají jednou nahoře** a platí pro všechny tasky (i desítky vygenerovaných). Jednotlivý task jde přepsat v rozbalovací části „Product a Audience tohoto tasku“; ručně přepsaná hodnota se pak už společnou změnou nepřepisuje.
* Product je z **omezeného seznamu** (`LIMITED_PRODUCTS` v `src/ui-simple.js`).
* Product se **předvybere podle produktu v opportunity** (z Products / z názvu opty). Označené ★ jsou produkty z opty, můžete vybrat jiný.
* U každého tasku zadáte **název**, datum, kategorii a typ (podle `Customer_Interaction_Task_List`), Product a Audience.
* Tlačítko **＋ Přidat další task** přidá další task (zkopíruje poslední nastavení, název si dáte vlastní).
* Status = Completed, Priority = Normal, Assigned To = vy, formát data `DD.MM.YYYY`.
* Během vytváření se panel zmenší do rohu, aby bylo vidět formulář Salesforce. **■ Stop** zastaví po aktuálním tasku.
* Dole je **Log** a **Kopírovat log** pro případ potíží.

Starší, složitější verze (průvodce, více opt, plánování týdnů) je ve složce `plna-verze/`.

## Spuštění
Viz `0-CIST-NEJDRIV.txt`.

## Vývoj
`python3 build.py` sestaví jednoduchou verzi do `dist/`, `python3 build.py full` plnou do `dist-full/`. Zdroje: `src/engine.js` (ovládání formuláře), `src/ui-simple.js`, `src/ui-full.js`.
