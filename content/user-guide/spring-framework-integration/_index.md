---

title: "Spring Framework Integration"
weight: 50

menu:
  main:
    identifier: "user-guide-spring-framework-integration"
    parent: "user-guide"

---

The fluxnova-engine Spring Framework integration is located inside a maven module and can be added to apache maven-based projects through the following dependency:

{{< note title="" class="info" >}}
  Please import the [Fluxnova BOM]({{< relref "/get-started/apache-maven/" >}}) to ensure correct versions for every Fluxnova project.
{{< /note >}}

* `fluxnova-engine-spring` maven module for Spring Framework 5

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm</groupId>
  <artifactId>fluxnova-engine-spring</artifactId>
</dependency>
```

* `fluxnova-engine-spring-6` maven module for Spring Framework 6.

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm</groupId>
  <artifactId>fluxnova-engine-spring-6</artifactId>
</dependency>
```

The process engine Spring artifact should be added as a library to the process application.
The following minimal set of Spring dependencies must be added in the desired version:

```xml
<properties>
  <spring.version>X.Y.Z.RELEASE</spring.version>
</properties>

<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-framework-bom</artifactId>
      <version>${spring.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-orm</artifactId>
  </dependency>
</dependencies>
```

