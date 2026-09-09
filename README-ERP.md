# Habesha Restaurant ERP

Diese Erweiterung ergänzt die bestehende Next.js-/Prisma-App um Dashboard, Bestellungen, Lager, Rezepturen, Lieferanten und Einkauf.

## Installation

1. Erstelle zuerst ein Datenbank-Backup.
2. Kopiere die Ordner app, lib und prisma aus diesem Paket in das Projekt und bestätige das Zusammenführen. Bestehende Dateien werden nur dort ersetzt, wo das Paket vollständige aktualisierte Versionen enthält.
3. Ergänze die .env:

```env
ADMIN_PASSWORD=ein-starkes-passwort
ADMIN_SESSION_SECRET=eine-zufaellige-lange-zeichenfolge-mit-mindestens-32-zeichen
DATABASE_URL=postgresql://...
```

4. Führe aus:

```bash
npm install
npx prisma format
npx prisma migrate dev --name restaurant_erp
npm run db:seed
npm run dev
```

5. Öffne http://192.168.0.88:3000/admin.

## Produktionsbetrieb

```bash
npx prisma migrate deploy
npm run build
npm start
```

## Fachlogik

- Eine neue Tischbestellung hat den Status NEW.
- In der Bestellverwaltung kann sie auf CONFIRMED, PREPARING, SERVED, PAID oder CANCELLED gesetzt werden.
- Beim ersten Wechsel auf PAID werden die Rezeptzutaten einmalig aus dem Lager abgebucht.
- Ein Wareneingang erhöht den Lagerbestand und erzeugt nachvollziehbare Lagerbewegungen.
- Bereits gebuchte Lagerabgänge werden durch spätere Statuswechsel nicht doppelt ausgeführt.

## Wichtige Grenze

Das Paket nutzt weiterhin eine einzelne Adminrolle. Für mehrere Mitarbeiter mit getrennten Rollen, persönliche Konten, revisionssichere Kassenführung oder DATEV-Export ist eine zweite Ausbaustufe erforderlich.
