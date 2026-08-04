# Sharkie

Ein browserbasiertes 2D-Jump'n'Run-Spiel, in dem du einen Hai durch eine Unterwasserwelt steuerst. Bekämpfe Feinde, sammle Münzen und Giftflaschen, und besiege den Endboss.

## Spielprinzip

- Steuere den Hai durch scrollende Level
- Greife Feinde mit Blasen (normal oder giftig) oder einem Klaps an
- Sammle **Münzen** (7 Münzen = 1 Leben) und **Giftflaschen** für Giftblasen-Angriffe
- Besiege den Endboss (Orca), um das Spiel zu gewinnen
- Bei Inaktivität wechselt der Charakter in einen Schlafmodus

## Steuerung

- `→` / `←` / `↑` / `↓` – Schwimmen
- `Leertaste` – Blase schießen
- `D` – Klaps-Angriff

Mobile Steuerung ist ebenfalls vorhanden (Touch-Buttons).

## Feinde

- **Pufferfisch** – regulärer Gegner mit Übergangsphasen
- **Qualle** – regulärer Gegner
- **Orca** – Endboss mit eigenem Angriffs- und Hurt-Verhalten

## Technologien

- Vanilla JavaScript (ES6, OOP)
- HTML5 Canvas API
- CSS3
- LocalStorage
- Kein Framework, kein Build-Tool

## Projektstruktur

- `index.html` – Einstiegspunkt
- `scripts/` – Initialisierung
- `models/` – Spielklassen
- `levels/` – Level-Definitionen
- `styles/` – CSS
- `assets/` – Grafiken & Audio

## Setup & Starten

### Voraussetzungen

- Git
- Ein moderner Browser (Chrome, Firefox, Edge)
- Optional: Node.js (für lokalen Webserver)

### Repository klonen

```bash
git clone git@github.com:DustinGuettnerDev/Sharkie.git
cd Sharkie
```

Oder per HTTPS:

```bash
git clone https://github.com/DustinGuettnerDev/Sharkie.git
cd Sharkie
```

### Spiel starten

**Option 1 – Direkt im Browser:**  
Datei `index.html` im Browser öffnen.
