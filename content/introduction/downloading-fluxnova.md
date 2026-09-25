---

title: 'Download'
weight: 10

menu:
  main:
    identifier: "user-guide-introduction-downloading-fluxnova"
    parent: "user-guide-introduction"

---


# Prerequisites

Before downloading Fluxnova, make sure you have a JRE (Java Runtime Environment), or better, a JDK
(Java Development Kit) installed. Please check the supported [Java versions]({{< relref "/introduction/supported-environments.md#java" >}}).

[Download JDK][get-jdk]


# Download the Runtime

Fluxnova is a flexible framework which can be used in different contexts. See [Architecture Overview]({{< relref "/introduction/architecture.md" >}}) for more details. Based on how you want
to use Fluxnova, you can choose a different distribution or runtime environment like [Spring Boot][run-with-spring-boot] or [Docker][run-with-docker].

* [Download page][community-download-page]


## Full Distribution

Download the full distribution if you want to use a [shared process engine][shared-engine] or if you
want to get to know Fluxnova quickly, without any additional setup or installation steps required.

The full distribution bundles

* Process Engine configured as [shared process engine][shared-engine],
* Runtime Web Applications (Tasklist, Cockpit, Admin),
* Rest Api,
* Container / Application Server itself.

{{< note title="Server/Container" class="info" >}}
  If you download the full distribution for an open-source application
  server/container, the container itself is included. For example, if you download the Tomcat
  distribution, Tomcat itself is included and the Fluxnova binaries (process engine and
  web apps) are pre-installed in the container. This is not true for the the Oracle WebLogic
  and IBM WebSphere downloads; these downloads do not include the application servers themselves.
{{< /note >}}

See the [Installation Guide][installation-guide-full] for additional details.


# Download Fluxnova Modeler

Fluxnova Modeler is a modeling Tool for BPMN 2.0 and DMN 1.3. Fluxnova Modeler can be downloaded
from the [GitHub releases](https://github.com/finos/fluxnova-modeler/releases/latest).



[get-jdk]: https://www.oracle.com/technetwork/java/javase/downloads/index.html
[community-download-page]: https://github.com/finos/fluxnova-bpm-platform/releases
[enterprise-download-page]: /enterprise/download
[shared-engine]: {{< relref "/introduction/architecture.md#shared-container-managed-process-engine" >}}
[installation-guide-full]: {{< relref "/installation/_index.md" >}}
[run-with-spring-boot]: {{< relref "/user-guide/spring-boot-integration/_index.md" >}}
[run-with-docker]: {{< relref "/installation/docker.md" >}}
