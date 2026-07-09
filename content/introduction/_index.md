---

title: "Introduction"
weight: 10
layout: "single"

menu:
  main:
    identifier: "user-guide-introduction"
    parent: "manual"

---


Welcome to the Fluxnova Manual! Fluxnova is a Java-based framework supporting BPMN for workflow and process automation, CMMN for Case Management and DMN for Business Decision Management. Also see: [Implemented Standards]({{< relref "/introduction/implemented-standards.md" >}}).

Fluxnova is a fork of Camunda 7 Community Edition framework, which was [announced to be end-of-life and discontinued in October 2025](https://forum.camunda.io/t/important-update-camunda-7-community-edition-end-of-life-announced/50921) by its original maintainer Camunda Services GmbH. Fluxnova builds upon the forked version and provides continued improvements, extensions, and security fixes as a FINOS open source project.

This document contains information about the features provided by Fluxnova.

To give you an overview of Fluxnova, the following illustration shows the most important components along with some typical user roles.

{{< img src="img/architecture-overview.png" title="Fluxnova Components and Roles" >}}


# Process Engine & Infrastructure

* [Process Engine]({{< relref "/user-guide/process-engine/_index.md" >}}) The process engine is a Java library responsible for executing BPMN 2.0 processes, CMMN 1.1 cases and DMN 1.3 decisions. It has a lightweight POJO core and uses a relational database for persistence. ORM mapping is provided by the MyBatis mapping framework.
* [Spring Framework Integration]({{< relref "/user-guide/spring-framework-integration/_index.md" >}})
* [CDI/Java EE Integration]({{< relref "/user-guide/cdi-java-ee-integration/_index.md" >}})
* [Runtime Container Integration]({{< relref "/user-guide/runtime-container-integration/_index.md" >}}) (Integration with application server infrastructure.)

# Modeler

* [Fluxnova Modeler]({{< relref "/modeler/_index.md" >}}): Modeling tool for BPMN 2.0 and CMMN 1.1 diagrams as well as DMN 1.3 decision tables.
* [bpmn.io](http://bpmn.io/): Open-source project for the modeling framework and toolkits.

# Web Applications

* [REST API]({{< relref "/reference/rest/_index.md" >}}) The REST API allows you to use the process engine from a remote application or a JavaScript application. (Note: The documentation of the REST API is factored out into own documents.)
* [Fluxnova Tasklist]({{< relref "/webapps/tasklist/_index.md" >}}) A web application for human workflow management and user tasks that allows process participants to inspect their workflow tasks and navigate to task forms in order to work on the tasks and provide data input.
* [Fluxnova Cockpit]({{< relref "/webapps/cockpit/_index.md" >}}) A web application for process monitoring and operations that allows you to search for process instances, inspect their state and repair broken instances.
* [Fluxnova Admin]({{< relref "/webapps/admin/_index.md" >}}) A web application that allows you to manage users, groups and authorizations.
