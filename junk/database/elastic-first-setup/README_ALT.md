# Installation des Elastic Stack ("ELK") über Docker

„ELK“ ist die Abkürzung für drei Open-Source-Projekte: Elasticsearch, Logstash und Kibana. Elasticsearch ist eine Suchmaschine und Analytics Engine. Logstash ist eine serverseitige Datenverarbeitungspipeline, die Daten aus unterschiedlichen Quellen gleichzeitig ingestiert, sie umwandelt und dann an einen Speicherort, z. B. an Elasticsearch, sendet. Kibana ermöglicht die Visualisierung von Daten durch Diagramme und Tabellen in Elasticsearch.\
Offizielle Installationsanleitung von Elastic Stack:\
[https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-stack-docker.html#get-started-stack-docker](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-stack-docker.html#get-started-stack-docker)


## 1.Vorbereitungen
### 1.1 Installation Docker Desktop Engine
Installationsanleitung: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
### 1.2 Ziehen der Docker images für Elasticsearch und Kibana
Hinweis: Bei einer Installation unter Windows wurden alle Befehle über das Windows-Subsystem für Linux (WSL) Terminal eingegeben.

Elasticsearch Docker image:\
`docker pull docker.elastic.co/elasticsearch/elasticsearch:8.2.0`\
Kibana Docker image:\
`docker pull docker.elastic.co/kibana/kibana:8.2.0`

## 2. Starten eines Elasticsearch Knoten und registrieren von Kibana
### 2.1 Erzeugen eines Netzwerkes für die beiden Container
`docker network create elastic`
### 2.2 Starten des Elasticsearch Containers
Beim ersten Start des Elasticsearch Containers wird ein Passwort für den `elastic` User und ein Token zur registrierung von Kibana angezeigt. Das erzeugte Passwort und der Token müssen kopiert und sicher abgespeichert werden, da diese Informationen nur beim ersten Start des Elasticsearch Containers angezeigt werden.\
`docker run --name es01 --net elastic -p 9200:9200 -it docker.elastic.co/elasticsearch/elasticsearch:8.2.0`
### 2.3 Kopieren des HTTPS CA Zertifikates aus dem Container in die lokale Maschine
In einem neuen Terminal das Zertifikat an den gewünschten Ort kopieren.\
`docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .`

### 2.4 Verfizieren der Verbindung zum Elasticsearch Container
Im selben Terminal kann die Verbindung vom Elasticsearch Container überprüft werden. Hierzu muss für den Aufruf das `http_ca.crt` Zertifikat verwendet werden.\
`curl --cacert http_ca.crt -u elastic https://localhost:9200`

Die Ausgabe solle so ähnlich aussehen:
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
### 2.5 Starten des Kibana Containers
Starten des Kibana Conatiners in einem neuen Terminal:\
`docker run --name kibana --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.2.0`\
Nach dem Starten von Kibana wird ein Link im Terminal angezeigt. Um auf Kibana zuzugreifen, muss dieser Link verwendet werden. Anschließend müssen folgende Schritte durchgeführt werden:
1. Den zuvor gespeicherten "Kibana enrollment token" einfügen, um Kibana mit Elasticsearch zu verbinden.
2. Login mit dem `elastic` User und dem generierten Passwort.

## 3. Verwendung von Elasticsearch und Kibana
Wenn die beiden Container für Elasticsearch und Kibana laufen, kann auf diese wie folgt zugegriffen werden:

Container|URL|
------|------
Elasticsearch|[https://localhost:9200](https://localhost:9200)|
Kibana|[localhost:5601](localhost:5601)|

Um über einen Internetbrowser unter __Windows__ auf Elasticsearch zuzugreifen, muss das HTTPS CA Zertifikat importiert werden. Der Ablauf wird nachfolgend beschrieben:
1. Kopieren des Zertifikates aus dem Container mit:\
    `docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .`
2. Systemsteuerung --> Netzwerk und Internet --> Netzwerk und Freigabecenter --> Internetoptionen (unten links) --> Tab Inhalte --> Zertifikate --> Tab "Vertrauenswürdige Stammzertifikate" --> Importieren --> den Anweisungen folgen\
[Genauere Anleitung zur Installation des Zertifikates](https://docs.titanhq.com/en/3833-importing-ssl-certificate-in-internet-explorer,-google-chrome-or-opera.html)
3. Nach erfolgreichem importieren des Zertifikates kann Elasticsearch unter [https://localhost:9200](https://localhost:9200) aufgerufen werden. Nach der Anmeldung mit dem `elastic` User erscheint im Browser die JSON Ausgabe von oben.