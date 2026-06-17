---

title: 'Configure a Spring Boot Project'
weight: 20

menu:
  main:
    name: "Configuration"
    parent: "get-started-spring-boot"
    identifier: "get-started-spring-boot-congiguration"
    pre: "Configure your Fluxnova Spring Boot application"

---

The Fluxnova Spring Boot Application created in previous step uses the default and best practice configuration, embedded in a starter. 
There are several ways to customize or override the configuration. The easiest is to provide a set of parameters in the `application.yaml` (or `application.properties`) file. 
The full list of supported configuration parameters can be found [here]({{< ref "/user-guide/spring-boot-integration/configuration/#fluxnova-engine-properties" >}}).

## Customize Configuration

Let's create an `application.yaml` file in the `src/main/resources` folder with the following content:
```yaml
fluxnova.bpm:
  admin-user:
    id: demo
    password: demo
    firstName: Demo
  filter:
    create: All tasks
```

This configuration will result in the following:

1. Admin user "demo" with the provided password and first name will be created.
2. Default filter with the name "All tasks" will be created for Tasklist.

## Build and Run

Now you can rebuild and rerun the application again. Don't forget to call `mvn clean` before calling `mvn install` again.
Now when you open [http://localhost:8080/](http://localhost:8080/) in your browser, it does not ask you for admin user creation, but asks for login and password. 
You can use "demo/demo", which we configured before, to access the Fluxnova web applications.
  
After you logged in, you can go to Tasklist and see that a filter named "All tasks" was created, though it does not contain any tasks so far.

{{< get-tag repo="fluxnova-get-started-spring-boot" tag="Step-2" >}}
