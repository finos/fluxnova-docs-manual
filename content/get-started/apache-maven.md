---

title: 'Apache Maven Coordinates'
weight: 13

menu:
  main:
    name: "Maven Coordinates"
    identifier: "get-started-maven"
    parent: "get-started"
    pre: "The most commonly used Apache Maven Coordinates for Fluxnova."

---

This page lists the most commonly used Apache Maven Coordinates for Fluxnova.

Most Fluxnova artifacts are pushed to [maven central](https://central.sonatype.com/).


# Fluxnova BOM (Bill of Materials)

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.finos.fluxnova.bpm</groupId>
      <artifactId>fluxnova-bom</artifactId>
      <version>1.0.0</version>
      <scope>import</scope>
      <type>pom</type>
    </dependency>
  </dependencies>
</dependencyManagement>
```

{{< note title="Use the BOM!" class="info" >}}
  Please import the Fluxnova BOM if you use multiple Fluxnova projects. The BOM defines versions for all Fluxnova projects. This way it is ensured that no incompatible versions are imported.
{{< /note >}}


# Fluxnova Engine

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm</groupId>
  <artifactId>fluxnova-engine</artifactId>
</dependency>
```


# Fluxnova Engine Spring Integration

The `fluxnova-engine` Spring integration for Spring Framework 5:

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm</groupId>
  <artifactId>fluxnova-engine-spring</artifactId>
</dependency>
```

The `fluxnova-engine` Spring integration for Spring Framework 6:

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm</groupId>
  <artifactId>fluxnova-engine-spring-6</artifactId>
</dependency>
```

# Fluxnova Engine CDI Integration

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm</groupId>
  <artifactId>fluxnova-engine-cdi</artifactId>
</dependency>
```

# Fluxnova DMN Engine BOM (Bill of Materials)
This BOM allows to use the DMN engine standalone without the BPMN engine and the rest of the Fluxnova Platform.

```xml
<dependencyManagement>
  <dependency>
    <groupId>org.finos.fluxnova.bpm.dmn</groupId>
    <artifactId>fluxnova-engine-dmn-bom</artifactId>
    <version>1.0.0</version>
    <type>pom</type>
    <scope>import</scope>
  </dependency>
</dependencyManagement>
```

# Fluxnova DMN
This dependency allows to use DMN engine standalone without the BPMN engine and the rest of the Fluxnova Platform.
It is not needed when using `fluxnova-engine` because that already contains the DMN engine.

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm.dmn</groupId>
  <artifactId>fluxnova-engine-dmn</artifactId>
</dependency>
```

# Process Application EJB Client

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm.javaee</groupId>
  <artifactId>fluxnova-ejb-client</artifactId>
</dependency>
```

# Fluxnova Artifact Storage

## Artifactory

Fluxnova relies on JFrog Artifactory to provide Fluxnova artifacts to users at [artifacts.camunda.com](https://artifacts.camunda.com/). The artifact data is stored in [Amazon S3](https://aws.amazon.com/s3/) storage and gets served by [artifacts.camunda.com](https://artifacts.camunda.com/) via redirects to AWS S3. Users must be able to connect to both endpoints for artifact retrieval.

```xml
<repositories>
  <repository>
    <id>fluxnova-bpm-nexus</id>
    <name>fluxnova-bpm-nexus</name>
    <url>
      https://artifacts.camunda.com/artifactory/public/
    </url>
  </repository>
</repositories>
```

### Browse Fluxnova Artifact Storage
In order to browse the Fluxnova artifacts, here are the links which you can use.

https://artifacts.camunda.com/ui/native/camunda-bpm

### Known issues

#### cURL artifacts
The files are hosted in AWS S3, therefore, Artifactory rewrites the requests to S3 and sends a 302 as the first response. For cURL this means to add the "`-L`" or "`--location`" option to follow the response.

Example:
```
curl -LO https://artifacts.camunda.com/artifactory/camunda-bpm/org/finos/fluxnova/bpm/camunda-engine-rest/7.23.0/camunda-engine-rest-7.23.0.war
```

# Other Fluxnova Modules:

* [DMN Engine]({{< ref "/user-guide/dmn-engine/embed/#maven-coordinates" >}})
* [Fluxnova Spin]({{< ref "/reference/spin" >}})
* [Fluxnova Connect]({{< ref "/reference/connect/#maven-coordinates" >}})
* [Templating Engines]({{< ref "/user-guide/process-engine/templating/#install-a-template-engine-for-an-embedded-process-engine" >}})
* [Spring Boot Integration]({{< ref "/user-guide/spring-boot-integration/" >}})
