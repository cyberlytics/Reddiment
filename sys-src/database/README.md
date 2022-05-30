# Elastic Database - Container Setup

Elasticsearch ist eine Open-Source-Suchmaschine auf Basis von Apache Lucene. Sie arbeitet mit Indices, die aus JSON-Dokumenten im NoSQL-Format bestehen. Die Suchmaschine arbeitet sehr schnell, ist für die Suche in großen Datenmengen einsetzbar und unterstützt für eine hohe Verfügbarkeit verteilte Architekturen. [https://www.elastic.co/de/elasticsearch/](https://www.elastic.co/de/elasticsearch/)

## Installation
### 1. Installation Docker Desktop Engine
Installationsanleitung: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
### 2. Umgebungsvariablen anlegen
In den Umgebungsvariablen werden die Secrets für den Zugang zu Elastic gespeichert. Die `.env.example` zeigt die notwendigen KEY=VALUE Paare. Die nachfolgenden Variablen müssen in `.env` gesetzt werden:
```
ELASTIC_VERSION = 8.2.0
ELASTIC_SECURITY = true
ELASTIC_PASSWORD = passwort
```
Die Umgebungsvariablen in `.env` müssen im gleichen Ordner wie die `docker-compose.yml` liegen.
### 3. Starten des Elastic Containers mit Docker
Mit dem Befehl `docker-compose up` wird der Container gestartet. Der erstmalige Start des Containers beansprucht mehr Zeit, da dieser erst noch gebaut werden muss [Parameter zu "docker-compose up"](https://docs.docker.com/compose/reference/up/). Erneutes Starten des Containers kann auch durch die Docker Desktop Oberfläche erfolgen.
### 4. Verfizieren der Verbindung zum Elastic Container
Die Verbindung zu Elastic kann über [https://localhost:9200](https://localhost:9200) geprüft werden. Nach der Anmeldung mit dem __elastic__ User und dem gewählten Passwort muss die nachfolgenden Ausgabe zu sehen sein. Die Ausgabe solle so ähnlich aussehen:
```json
    {
  "name" : "84dce052bee4",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "BPqeIisbTk-HCWB22rezFA",
  "version" : {
    "number" : "8.2.0",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "b174af62e8dd9f4ac4d25875e9381ffe2b9282c5",
    "build_date" : "2022-04-20T10:35:10.180408517Z",
    "build_snapshot" : false,
    "lucene_version" : "9.1.0",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "You Know, for Search"
}
```
