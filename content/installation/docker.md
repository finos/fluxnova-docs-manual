---

title: "Run Fluxnova using Docker"
weight: 20

menu:
  main:
    name: "Docker"
    identifier: "installation-guide-docker"
    parent: "installation-guide"
    pre: "Run the Full Distribution using Docker"

---

# Community Edition

The Community Edition docker images can be found on [GitHub](https://github.com/finos/docker-fluxnova-bpm-platform) and [Docker Hub](https://hub.docker.com/r/fluxnova/fluxnova-bpm-platform/).

## Start Fluxnova Run using Docker

To start [Fluxnova Run]({{< ref "/user-guide/fluxnova-bpm-run.md" >}}) execute the following commands:

```shell
docker pull fluxnova/fluxnova-bpm-platform:run-latest
docker run -d --name fluxnova -p 8080:8080 fluxnova/fluxnova-bpm-platform:run-latest
```

## Start Fluxnova (Tomcat) using Docker

To start Fluxnova, execute the following commands:

```shell
docker pull fluxnova/fluxnova-bpm-platform:latest
docker run -d --name fluxnova -p 8080:8080 fluxnova/fluxnova-bpm-platform:latest
```

Please note that by default the Apache Tomcat distribution is used. For a guide on how to use one of the other distributions, see the [tag schema](https://github.com/finos/docker-fluxnova-bpm-platform#supported-tagsreleases).

