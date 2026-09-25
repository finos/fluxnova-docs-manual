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

The Community Edition docker images can be found on [Docker Hub](https://hub.docker.com/r/finos/fluxnova-bpm-platform/). The Dockerfile used to build the image can be found on [GitHub](https://github.com/finos/fluxnova-bpm-platform/blob/main/Dockerfile)

## Start Fluxnova using Docker

To pull and start the prebuilt [Fluxnova Run]({{< relref "/user-guide/fluxnova-bpm-run.md" >}}) distribution, execute the following commands:

```shell
docker pull finos/fluxnova-bpm-platform:latest
docker run -d --name fluxnova -p 8080:8080 finos/fluxnova-bpm-platform:latest
```

This starts a Fluxnova Run instance on port 8080. You can access the web interface at `http://localhost:8080/`.