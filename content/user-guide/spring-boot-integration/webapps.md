---

title: "Web applications"
weight: 40

menu:
  main:
    name: "Web Applications"
    identifier: "user-guide-spring-boot-webapps"
    parent: "user-guide-spring-boot-integration"

---

To enable the [Web Applications]({{<relref "/webapps/_index.md">}}) you can use the following starter in your `pom.xml`:

```xml
<dependency>
  <groupId>org.finos.fluxnova.bpm.springboot</groupId>
  <artifactId>fluxnova-bpm-spring-boot-starter-webapp</artifactId>
  <version>{project-version}</version>
</dependency>
```

By default the application path is `/fluxnova`, so without any further configuration you can access 
the Webapps under [http://localhost:8080/fluxnova/app/](http://localhost:8080/fluxnova/app/).

## Configurations

You can change the application path with the following configuration property in your `application.yaml` file:
```properties
fluxnova.bpm.webapp.application-path=/my/application/path
```

By default, the starter registers a controller to redirect `/` to Fluxnova's bundled `index.html`.
To disable this, you have to add to your application properties:
```properties
fluxnova.bpm.webapp.index-redirect-enabled=false
```

## Error Pages

The default error handling coming with the Spring Boot ('whitelabel' error page) is enabled in the starter. To switch to the Fluxnova error pages (`webjar/META-INF/resources/webjars/fluxnova/error-XYZ-page.html`), please put them to the application folder structure under `/src/main/resources/public/error/XYZ.html`.

## Building Custom REST APIs

The Fluxnova Web Applications use a `CSRF Prevention Filter` that expects a `CSRF Token` on any 
modifying request for paths beginning with `/fluxnova/api/` or `/fluxnova/app/`. Any modifying requests 
mapped to these paths will fail, and the current session will be ended if no CSRF Token is present.
You can avoid this by registering your resources on different paths or add your resources to the
CSRF Prevention Filter Whitelist (via the configuration property `fluxnova.bpm.webapp.csrf.entry-points`).