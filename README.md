# Reddiment

Reddiment ist eine Webanwendung zur Sentiment Analyse von Reddit Posts.

[Build & Run](#build-und-run)


## Workflow

Im Folgenden werden nur die grundlegenden Schritte beschrieben, Informationen zu weiteren Vorgängen (Rebase, Amend Commits, etc.) sind beispielsweise hier zu finden: [https://git-scm.com/docs](https://git-scm.com/docs)

### Voraussetzungen

- Installation von git
- Generierung eines SSH-Schlüssels
- Hinterlegen des öffentlichen SSH-Schlüssels in den GitLab-Einstellungen

### Einrichtung

1. Klonen des Repositorys:
   `git clone git@git.oth-aw.de:bdcc-team-rot/reddiment.git`
2. Wechseln ins Arbeitsverzeichnis:
   `cd reddiment`
3. Setzen der Benutzer-Einstellungen:
   `git config user.name "Max Mustermann"`
   `git config user.email "m.mustermann@oth-aw.de"`

Das Arbeitsverzeichnis kann nun in der gewünschten IDE geöffnet werden.

### Entwicklung einer Änderung

1. Auschecken des `main`-Zweiges als Basis:
   `git checkout main`
2. Aktualisieren des `main`-Zweiges:
   `git pull`
3. Erstellen und Auschecken eines neuen Zweiges zur Entwicklung der Änderung:
   `git checkout -b 7a5b/hello-world`
   _Benennungsschema:_ `<vierstellige OTH-Kennung>/<kurze Bezeichnung>`; die kurze Bezeichnung sollte in Kleinbuchstaben mit einem Bindestrich als Worttrenner geschrieben werden
4. Vornehmen der gewünschten Änderungen.
5. Vormerken der Änderungen mittels `git add .` (Anstelle des Punkts kann auch eine spezifischere Pfadangabe erfolgen.)
6. Commit mittels `git commit`
   Bitte auf eine aussagekräftige Commit message achten; bevorzugt auf Englisch verfassen.
7. Pushen des Zweiges ins Haupt-Repository:
   `git push`
8. Erstellung eines Merge Requests in GitLab

### Merge Requests

1. Die vorgeschlagene Änderung sollte im Merge Request (MR) gut erklärt werden. Falls der MR eine offene Aufgabe schließt, sollte dies in der Beschreibung oder in der Commit Message mittels `Closes #<Issue-Nummer>` (z.B. `Closes #42`) erkennbar gemacht werden. Damit wird beim Mergen des MRs automatisch das entsprechende Issue geschlossen.
2. Jeder MR muss von mindestens einem anderen Teammitglied begutachtet und approved werden.
3. Merge Requests werden nur von einem Verantwortlichen pro Modul gemergt. Eigene MRs darf man nicht selbst mergen.
4. Vor dem Mergen müssen Diskussionen abgeschlossen sein.
5. Änderungsvorschläge dürfen ohne Absprache nicht direkt in die Zweige anderer Teammitglieder (erkennbar am Kürzel) gepusht werden, stattdessen kann beispielsweise die GitLab-Suggestion-Funktionalität verwendet werden.
6. Niemand darf direkt in den `main`-Zweig pushen.

---
---

## Build und Run

Benötigte Software
- Docker
- Docker Compose

1. In den Quellcode-Ordner wechseln
   - `cd sys-src`
2. Build (in Docker-Containern)
   - `docker compose build`
3. Run (in Docker-Containern)
   - `docker compose up`
4. Aufrufen der Website
   - `http://localhost`