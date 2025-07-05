

// neues repo anlegen

git init
git remote add origin https://github.com/dein-name/corex-ai-mindlayer.git
git add .
git commit -m "Initial commit – coreX AI MindLayer by AIQIA"
git push -u origin main


Schritt-für-Schritt: main-Branch löschen
1. Neuen Branch erstellen (falls noch nicht geschehen):

In deinem Terminal:

git checkout -b dev
git push origin dev

2. Neuen Branch auf GitHub als „default branch“ setzen:

    Gehe auf dein Repository bei GitHub

    Oben rechts auf ⚙️ Settings

    Links im Menü: Branches

    Unter Default branch ➜ Ändere von main auf dev
    (oder was dein neuer Standard sein soll)

3. main-Branch löschen (auf GitHub oder per Konsole):
🔁 Per Konsole:

git push origin --delete main

🔁 Alternativ: Auf GitHub Webinterface

    Reiter „Branches“ → suche main

    Rechts daneben auf das 🗑️-Symbol klicken → „Delete branch“

🟡 Hinweis:

Wenn du lokal auch den main-Branch entfernen willst:

git branch -d main

Oder zur Not mit -D erzwingen:

git branch -D main
