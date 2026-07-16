---

title: "Patch Level Update"
weight: 20

menu:
  main:
    name: "Patch Level Update"
    identifier: "migration-guide-patch"
    parent: "migration-guide"
    pre: "Guides you through a patch level update (Example: `1.0.2` to `1.0.3`)."

---

This guide explains how to perform a patch level update. The *patch level* is the version number "after the second dot". Example: update from `1.0.2` to `1.0.3`.

# Database Patches

Between patch levels, the structure of the database schema is not changed. The database structure of all patch releases is backward compatible with the corresponding minor version. Our [database schema update guide]({{< relref "/installation/database-schema.md#patch-level-update" >}}) provides details on the update procedure as well as available database patches.

# Special Considerations

This section describes noteworthy changes between individual patch levels.

## 1.0.2 to 1.0.3

TBD

# Full Distribution

This section is applicable if you installed the [Full Distribution]({{< relref "/introduction/downloading-fluxnova.md#full-distribution" >}}) with a **shared process engine**. In this case you need to update the libraries and applications installed inside the application server.

Please note that the following procedure may differ for cluster scenarios. 

* Shut down the server
* Exchange Fluxnova libraries, tools and webapps (EAR, RAR, Subsystem (Wildfly), Shared Libs) - essentially, follow the [installation guide]({{< relref "/installation/full/_index.md" >}}) for your server.
* Restart the server

# Application With Embedded Process Engine

In case you use an embedded process engine inside your Java Application, you need to

1. update the Process Engine library in your dependency management (Apache Maven, Gradle ...),
2. re-package the application,
3. deploy the new version of the application.

# Applying Multiple Patches at Once

It is possible to apply multiple patches in one go (e.g., updating from `1.0.0` to `1.0.3`).
