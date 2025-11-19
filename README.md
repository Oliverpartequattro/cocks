# Cock Battle API 🐓🔥

Ez egy egyszerű, de ütős REST API, ami a "kakasversenyek" világába kalauzol!  
Lehetővé teszi, hogy kövesd, hozz létre, frissíts és törölj különböző kakasokat egy MongoDB adatbázisban.

## Fő funkciók

- **Lista lekérése**: `/cocks` – Nézd meg az összes kakast.
- **Egy kakas lekérése**: `/cocks/:id` – Részletek egy konkrét kakasról.
- **Új kakas hozzáadása**: `/cocks` (POST) – Adj hozzá egy új versenyzőt.
- **Kakas frissítése**: `/cocks/:id` (PUT) – Módosíts egy meglévő kakast.
- **Kakas törlése**: `/cocks/:id` (DELETE) – Törölj egy kakast az adatbázisból.

## Adatmodell

Minden kakas rendelkezik a következő tulajdonságokkal:

- `_id` – Egyedi azonosító  
- `nev` – A kakas neve  
- `kor` – Életkor  
- `fogadas_osszeg` – Mennyi pénzt tettek rá a fogadók  
- `kedvenc_kakas` – A kakas kedvence a versenytársak közül  
- `battle_id` – Melyik csatában vett részt  

## Technológiák

- Node.js & Express – Backend és REST API  
- MongoDB + Mongoose – Adatbázis és adatmodell  
- CORS – Kényelmes API hozzáférés bárhonnan  

## Tesztek

Ez a projekt Jest-tel van tesztelve, a HTTP-kéréseket a `node-mocks-http` segítségével mockoljuk. Futtatás:

```powershell
npm test
```

Új (rövid) tesztek, amiket hozzáadtam:

- `tests/cock.param.test.js` – Parameterizált `GET /cocks/:id` teszt több scenárióval (talált, nem talált, DB hiba).
- `tests/cock.short.test.js` – Egy rövid teszt az ismeretlen útvonal viselkedésére (404 vagy 200 a teszthuzalon belül).
- `tests/cock.headers.test.js` – Ellenőrzi, hogy a `GET /cocks` JSON Content-Type fejlécet ad-e.
- `tests/cock.delete.body.test.js` – Ellenőrzi, hogy a sikeres `DELETE /cocks/:id` választ a szerver a törlési üzenettel adja vissza.
- `tests/cock.post.headers.test.js` – Ellenőrzi, hogy a `POST /cocks` 201 státuszt és JSON Content-Type-ot ad.

Megjegyzés: a meglévő `tests/cock.test.js` számos endpoint-ot lefed integrációs stílusban (GET, POST, PUT, DELETE). Az új tesztek kiegészítik ezeket olyan rövid, célzott ellenőrzésekkel, amelyek nem ismétlik a korábbi aszserciókat.

Ha szeretnéd, átállíthatom a teszteket `supertest`-re, hogy az Express teljes middleware láncát élesebben teszteljük (ajánlott, ha pontos 404 viselkedést akarsz garantálni).
