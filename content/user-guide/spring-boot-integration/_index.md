---

title: "Spring Boot Integration"
weight: 55

menu:
  main:
    identifier: "user-guide-spring-boot-integration"
    parent: "user-guide"

---

The Fluxnova Engine can be used in a Spring Boot application by using provided Spring Boot starters.
Spring boot starters allow to enable behavior of your spring-boot application by adding dependencies to the classpath.

These starters will pre-configure the Fluxnova process engine, REST API and Web applications, so they can easily be used in a standalone process application.

If you are not familiar with [Spring Boot](http://projects.spring.io/spring-boot/), read the [getting started](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#getting-started) guide.

To enable Fluxnova auto configuration, add the following dependency to your ```pom.xml```:

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm.springboot</groupId>
  <artifactId>fluxnova-bpm-spring-boot-starter</artifactId>
  <version>{{< minor-version >}}.0</version>
</dependency>
```

This will add the Fluxnova engine v.{{< minor-version >}}.0 to your dependencies.

Other starters that can be used are: 

* [`fluxnova-bpm-spring-boot-starter-rest`](rest-api)
* [`fluxnova-bpm-spring-boot-starter-webapp`](webapps)
* [`fluxnova-bpm-spring-boot-starter-external-task-client`]({{< ref "/user-guide/ext-client/spring-boot-starter.md" >}})

# Requirements

Fluxnova Spring Boot Starter requires Java 17.

# Supported deployment scenarios

Following deployment scenario is supported by Fluxnova:

* executable JAR with embedded Tomcat and one embedded process engine (plus Webapps when needed)

There are other possible variations that might also work, but are not tested by Fluxnova at the moment.
