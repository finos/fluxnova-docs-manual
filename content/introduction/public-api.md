---

title: 'Public API'
weight: 80

menu:
  main:
    identifier: "user-guide-introduction-public-api"
    parent: "user-guide-introduction"

---


Fluxnova provides a public API. This section covers the definition of the public API and backwards compatibility for version updates.


# Definition of Public API

The Fluxnova public API is limited to the following items:

Java API: 

All non-implementation Java packages (package name does not contain `impl`) of the following modules.

* `fluxnova-engine`
* `fluxnova-engine-spring`
* `fluxnova-engine-cdi`
* `fluxnova-engine-dmn`
* `fluxnova-bpmn-model`
* `fluxnova-cmmn-model`
* `fluxnova-dmn-model`
* `fluxnova-spin-core`
* `fluxnova-connect-core`
* `fluxnova-commons-typed-values`

HTTP API (REST API):

* `fluxnova-engine-rest`: HTTP interface (set of HTTP requests accepted by the REST API as documented in [REST API reference]({{< relref "/reference/rest/_index.md" >}}). Java classes are not part of the public API.


# Backwards Compatibility for Public API

The Fluxnova versioning scheme follows the MAJOR.MINOR.PATCH pattern put forward by [Semantic Versioning](http://semver.org/). Fluxnova will maintain public API backwards compatibility for MINOR version updates. Example: Update from version `1.1.x` to `1.2.x` will not break the public API.
