# 📦 Installation Guide - coreX AI MindLayer v3.7.0

> **Verschiedene Wege, das AI MindLayer in dein Projekt zu integrieren**

## 📚 Wichtige Hinweise

- Für KI-Systeme: Bitte zuerst [INITIALIZE.md](INITIALIZE.md) lesen
- Für Entwickler: [README.md](README.md) enthält die Projektübersicht
- Aktuelle Features: Siehe [CHANGELOG.md](CHANGELOG.md)

## 🆕 Neues in v3.7.0

- Sicherer Update-Mechanismus mit Backup-System
- Intelligente Schema-Vergleichsanalyse
- Verbesserter Datenschutz für projektspezifische Daten
- Automatische Versionsprüfung

## 🎯 Installationsoptionen

### **Option 1: Neues Projekt** ✨

_Für komplett neue Projekte_

```bash
# Repository klonen
git clone https://github.com/AIQIA/corex-ai-mindlayer.git mein-projekt
cd mein-projekt

# Git-History zurücksetzen (optional)
rm -rf .git
git init
git add .
git commit -m "Initial commit mit AI MindLayer"
```

---

### **Option 2: Bestehendes Projekt** 🔄

_Das klassische "Ordner ist nicht leer"-Problem_

#### **2a) Manuelle Integration** (Empfohlen)

```bash
# 1. AI MindLayer temporär downloaden
git clone https://github.com/AIQIA/corex-ai-mindlayer.git temp-ai-layer

# 2. Relevante Dateien in dein Projekt kopieren
cp temp-ai-layer/.ai.json.example ./
cp temp-ai-layer/ai-init.php ./
cp temp-ai-layer/AI-INTEGRATION.md ./

# 3. Temp-Ordner löschen
rm -rf temp-ai-layer

# 4. .ai.json erstellen
cp .ai.json.example .ai.json
# → Jetzt .ai.json an dein Projekt anpassen!

# 5. Optional: .gitignore erweitern
echo ".ai.json" >> .gitignore
```

#### **2b) Git Subtree** (Für Profis)

```bash
# AI MindLayer als Subtree hinzufügen
git subtree add --prefix=ai-layer \
  https://github.com/AIQIA/corex-ai-mindlayer.git main --squash

# Dateien ins Root verschieben
mv ai-layer/.ai.json.example ./
mv ai-layer/ai-init.php ./
mv ai-layer/AI-INTEGRATION.md ./

# AI-Layer Ordner entfernen
rm -rf ai-layer
```

#### **2c) Download & Extract** (Einfachste Methode)

```bash
# ZIP downloaden und entpacken
curl -L https://github.com/AIQIA/corex-ai-mindlayer/archive/main.zip -o ai-layer.zip
unzip ai-layer.zip

# Benötigte Dateien kopieren
cp corex-ai-mindlayer-main/.ai.json.example ./
cp corex-ai-mindlayer-main/ai-init.php ./
cp corex-ai-mindlayer-main/AI-INTEGRATION.md ./

# Aufräumen
rm -rf corex-ai-mindlayer-main ai-layer.zip
```

---

## 🛠️ Nach der Installation

### **Schritt 1: .ai.json konfigurieren**

```bash
# Beispiel-Datei kopieren
cp .ai.json.example .ai.json

# Mit deinem Editor anpassen
nano .ai.json  # oder VS Code, PHPStorm, etc.
```

### **Schritt 2: ai-init.php testen**

```bash
# Falls PHP-Server läuft:
# http://localhost/dein-projekt/ai-init.php

# Oder via CLI:
php ai-init.php
```

### **Schritt 3: Gitignore anpassen** (Optional)

```bash
# .ai.json von Versionierung ausschließen
echo ".ai.json" >> .gitignore
```

---

## 🎛️ Minimale Installation

**Nur das Nötigste?** Kopiere nur diese Dateien:

```
📁 Dein Projekt/
├── .ai.json.example     ← Template
├── ai-init.php          ← KI-Erkennung (optional)
└── .ai.json             ← Deine Konfiguration
```

**Das wars!** 🎉

---

## 💡 Pro-Tipps

### **Für Laravel/Symfony Projekte:**

```bash
# ai-init.php ins public/ Verzeichnis
cp ai-init.php public/

# URL: https://dein-projekt.de/ai-init.php
```

### **Für Node.js Projekte:**

```bash
# .ai.json ins Root, ai-init.php optional weglassen
cp .ai.json.example ./.ai.json
```

### **Für WordPress:**

```bash
# In Theme/Plugin-Ordner oder Root
cp .ai.json.example ./wp-content/themes/dein-theme/
```

---

## 🚨 Troubleshooting

### **"Directory not empty" Fehler:**

```bash
# Lösung: Manuelle Integration (Option 2a) verwenden
# NICHT: git clone in bestehenden Ordner
```

### **Permission Errors:**

```bash
# Linux/Mac: Rechte anpassen
chmod 644 .ai.json.example
chmod 755 ai-init.php
```

### **PHP Errors in ai-init.php:**

```bash
# Prüfe PHP-Version
php --version

# Teste Datei
php -l ai-init.php
```

---

## 🔄 Updates

### **AI MindLayer aktualisieren:**

```bash
# Neue Version manuell downloaden
curl -L https://github.com/AIQIA/corex-ai-mindlayer/archive/main.zip -o update.zip
unzip update.zip

# Nur gewünschte Dateien überschreiben
cp corex-ai-mindlayer-main/ai-init.php ./
# .ai.json NICHT überschreiben (deine Konfiguration!)

rm -rf corex-ai-mindlayer-main update.zip
```

---

## 🔧 Ecosystem Integration

### **PHP/Composer Projekte**

Die coreX AI MindLayer Composer-Integration bietet zwei Optionen:

#### **Option 1: Mit Composer (empfohlen wenn verfügbar)**

```bash
# Composer installieren (falls noch nicht vorhanden)
# Linux/Mac:
./scripts/install-composer.sh
# Windows:
.\scripts\install-composer.bat

# Composer Plugin installieren
cd scripts/ecosystem/composer-plugin
composer install   # oder: php ../../composer.phar install
cd ../../..

# Plugin ausführen
php scripts/ecosystem/composer-plugin/vendor/bin/composer aimindlayer:update
```

#### **Option 2: Standalone PHP Scanner (keine Composer-Installation nötig)**

```bash
# PHP muss installiert sein
php scripts/ecosystem/php-scanner/PhpProjectScanner.php
```

**Hinweis:** Die VS Code Extension erkennt automatisch, ob Composer verfügbar ist und wählt die passende Option.

---

## 📞 Hilfe benötigt?

- 📖 Siehe auch: `AI-INTEGRATION.md`
- 💬 GitHub Issues: [Fragen stellen](https://github.com/AIQIA/corex-ai-mindlayer/issues)
- 📧 E-Mail: [info@aiqia.de](mailto:info@aiqia.de)

---

_Happy Coding mit AI MindLayer! 🤖✨_
