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
