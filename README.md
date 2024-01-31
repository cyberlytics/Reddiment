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
  
## Tech Stack
cyberlytics/Reddiment is built on the following main stack:

- <img width='25' height='25' src='https://img.stackshare.io/service/832/mocha.png' alt='Mocha'/> [Mocha](http://mochajs.org/) – Javascript Testing Framework
- <img width='25' height='25' src='https://img.stackshare.io/service/841/Image_2019-05-20_at_4.58.04_PM.png' alt='Elasticsearch'/> [Elasticsearch](https://www.elastic.co/products/elasticsearch) – Search as a Service
- <img width='25' height='25' src='https://img.stackshare.io/service/993/pUBY5pVj.png' alt='Python'/> [Python](https://www.python.org) – Languages
- <img width='25' height='25' src='https://img.stackshare.io/service/1011/n1JRsFeB_400x400.png' alt='Node.js'/> [Node.js](http://nodejs.org/) – Frameworks (Full Stack)
- <img width='25' height='25' src='https://img.stackshare.io/service/1052/YMxUfyWf.png' alt='NGINX'/> [NGINX](http://nginx.org) – Web Servers
- <img width='25' height='25' src='https://img.stackshare.io/service/1163/hashtag.png' alt='ExpressJS'/> [ExpressJS](http://expressjs.com/) – Microframeworks (Backend)
- <img width='25' height='25' src='https://img.stackshare.io/service/1209/javascript.jpeg' alt='JavaScript'/> [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) – Languages
- <img width='25' height='25' src='https://img.stackshare.io/service/1612/bynNY5dJ.jpg' alt='TypeScript'/> [TypeScript](http://www.typescriptlang.org) – Languages
- <img width='25' height='25' src='https://img.stackshare.io/service/1683/preview.png' alt='Logstash'/> [Logstash](http://logstash.net/) – Log Management
- <img width='25' height='25' src='https://img.stackshare.io/service/1722/Image_2019-05-20_at_4.53.31_PM.png' alt='Kibana'/> [Kibana](https://www.elastic.co/kibana) – Monitoring Tools
- <img width='25' height='25' src='https://img.stackshare.io/service/2202/72d087642cfce6fef6f2dabec5bf49e8_400x400.png' alt='Autoprefixer'/> [Autoprefixer](https://github.com/postcss/autoprefixer) – CSS Pre-processors / Extensions
- <img width='25' height='25' src='https://img.stackshare.io/service/3337/Q4L7Jncy.jpg' alt='ESLint'/> [ESLint](http://eslint.org/) – Code Review
- <img width='25' height='25' src='https://img.stackshare.io/service/3339/rlFcjEdI.png' alt='PostCSS'/> [PostCSS](https://github.com/postcss/postcss) – CSS Pre-processors / Extensions
- <img width='25' height='25' src='https://img.stackshare.io/service/3820/12972006.png' alt='GraphQL'/> [GraphQL](http://graphql.org/) – Query Languages
- <img width='25' height='25' src='https://img.stackshare.io/service/4190/fGBUdNf__400x400.jpg' alt='Jupyter'/> [Jupyter](http://jupyter.org) – Data Science Notebooks
- <img width='25' height='25' src='https://img.stackshare.io/service/4631/default_c2062d40130562bdc836c13dbca02d318205a962.png' alt='Shell'/> [Shell](https://en.wikipedia.org/wiki/Shell_script) – Shells
- <img width='25' height='25' src='https://img.stackshare.io/service/5508/CyUH653y.png' alt='Apollo'/> [Apollo](https://www.apollographql.com/) – Platform as a Service
- <img width='25' height='25' src='https://img.stackshare.io/service/5561/303157.png' alt='TSLint'/> [TSLint](https://github.com/palantir/tslint) – Code Review
- <img width='25' height='25' src='https://img.stackshare.io/service/5577/preview.png' alt='nodemon'/> [nodemon](http://nodemon.io/) – node.js Application Monitoring
- <img width='25' height='25' src='https://img.stackshare.io/service/6113/7exmJEg4_400x400.png' alt='Svelte'/> [Svelte](https://svelte.technology/) – Javascript UI Libraries
- <img width='25' height='25' src='https://img.stackshare.io/service/6552/curl-logo.png' alt='cURL'/> [cURL](http://curl.haxx.se/) – File Transfer
- <img width='25' height='25' src='https://img.stackshare.io/service/7035/default_66f265943abed56bcdbfca1c866a4261b1fbb063.jpg' alt='Prettier'/> [Prettier](https://prettier.io/) – Code Review
- <img width='25' height='25' src='https://img.stackshare.io/service/7054/preview.jpeg' alt='jsdom'/> [jsdom](https://github.com/jsdom/jsdom) – Headless Browsers
- <img width='25' height='25' src='https://img.stackshare.io/no-img-open-source.png' alt='Elastic'/> [Elastic](https://github.com/olivere/elastic) – Search Tools
- <img width='25' height='25' src='https://img.stackshare.io/service/8158/default_660b7c41c3ba489cb581eec89c04655404258c19.png' alt='Tailwind CSS'/> [Tailwind CSS](https://tailwindcss.com) – Front-End Frameworks
- <img width='25' height='25' src='https://img.stackshare.io/service/10369/fYzCQZ9X_400x400.jpg' alt='ApexCharts'/> [ApexCharts](https://apexcharts.com/) – Charting Libraries
- <img width='25' height='25' src='https://img.stackshare.io/service/40090/default_dd2d5033d0363b16e87367cb62b402aa9da531bf.png' alt='Flowbite'/> [Flowbite](https://flowbite.com/) – UI Components
- <img width='25' height='25' src='https://img.stackshare.io/service/1001/default_6d109315b60108628b7cd3e159b84645c31ef0e2.png' alt='Flask'/> [Flask](http://flask.pocoo.org/) – Microframeworks (Backend)
- <img width='25' height='25' src='https://img.stackshare.io/service/586/n4u37v9t_400x400.png' alt='Docker'/> [Docker](https://www.docker.com/) – Virtual Machine Platforms & Containers

Full tech stack [here](/techstack.md)
