---

title: 'Setup a Spring Boot Project'
weight: 10

menu:
  main:
    name: "Project Setup"
    parent: "get-started-spring-boot"
    identifier: "get-started-spring-boot-project-setup"
    pre: "Set up Spring Boot application as an Apache Maven Project inside Eclipse."

---

First, let's set up your first process application project in the IDE of your choice, the following description uses Eclipse.

# Requirements

The project requires Java 21.

# Set Up a Java Project

We will start by setting up a Spring Boot application as an Apache Maven Project inside Eclipse. This consists of three steps:

1. Create a new Maven Project in Eclipse
2. Add the Fluxnova & Spring Boot dependencies
3. Add a main class as an entry point for launching the Spring Boot application.

In the following sections, we go through this process step by step.

## Create a new Maven Project

First, we set up a new Apache Maven based project. Let's call it *loan-approval-spring-boot*. The screenshot below illustrates the settings we choose in Eclipse.

{{< img src="../img/eclipse-new-project.png" >}}

When you are done, click Finish. Eclipse sets up a new Maven project. The project appears in the *Project Explorer* view.

## Add Fluxnova Platform & Spring Boot Dependencies

The next step consists of setting up the Maven dependencies for the new project. Maven dependencies need to be added to the `pom.xml` file of the project.
We add the Spring Boot BOM in the "dependency management" section and the Fluxnova Spring Boot Starter for Webapps, which will automatically include the Fluxnova engine and webapps in the app.
We also use `spring-boot-maven-plugin`, which does all the magic for packaging Spring Boot application content together.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>org.finos.fluxnova.bpm.getstarted</groupId>
  <artifactId>loan-approval-spring-boot</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <properties>
    <fluxnova.spring-boot.version>3.0.0</fluxnova.spring-boot.version>
    <spring-boot.version>4.0.5</spring-boot.version>
    <maven.compiler.release>21</maven.compiler.release>
  </properties>
  
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>${spring-boot.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  
  <dependencies>
    <dependency>
      <groupId>org.finos.fluxnova.bpm.springboot</groupId>
      <artifactId>fluxnova-bpm-spring-boot-starter-webapp</artifactId>
      <version>${fluxnova.spring-boot.version}</version>
    </dependency>
    <dependency>
      <groupId>com.h2database</groupId>
      <artifactId>h2</artifactId>
    </dependency>
    <dependency>
      <groupId>com.sun.xml.bind</groupId>
      <artifactId>jaxb-impl</artifactId>
      <version>4.0.3</version>
    </dependency>
  </dependencies>

   <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <version>${spring-boot.version}</version>
        <configuration>
          <layout>ZIP</layout>
        </configuration>
        <executions>
          <execution>
            <goals>
              <goal>repackage</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.11.0</version>
      </plugin>
    </plugins>
  </build>

</project>
```

## Add Main Class to our Spring Boot Application

Next, we add an application class with a main method that will be the entry point for launching the Spring Boot application. The class has the annotation `@SpringBootApplication` on it,
which implicitly adds several convenient features (autoconfiguration, component scan, etc. - see Spring Boot docs).
The class is added in the `src/main/java` folder in the `org.finos.fluxnova.bpm.getstarted.loanapproval` package.

```java
package org.finos.fluxnova.bpm.getstarted.loanapproval;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WebappExampleProcessApplication {
	public static void main(String... args) {
		SpringApplication.run(WebappExampleProcessApplication.class, args);
	}
}
```

## Build and Run

Now you can perform the first build. Select the `pom.xml` in the Package Explorer, perform a right-click and select `Run As / Maven Install`.

Our first Fluxnova Spring Boot application is ready now. As a result of the build, you will have a JAR-file in your `target` folder. This JAR is a Spring Boot application,
which embeds inside Tomcat as a web container, Fluxnova engine and Fluxnova Web applications resources.
When started, it will use an in-memory H2 database for Fluxnova Engine needs.

You can run the application by right-clicking on the `WebappExampleProcessApplication` class and selecting `Run as / Java application`.
Wait until you see a similar line in the console:
```text
Started WebappExampleProcessApplication in 10.584 seconds
```
Then go to [http://localhost:8080/](http://localhost:8080/) in your browser and enjoy the Fluxnova webapps.

Another way to run the app is to simply run the JAR-file with a `java -jar` command.

{{< get-tag repo="fluxnova-get-started-spring-boot" tag="Step-1" >}}
