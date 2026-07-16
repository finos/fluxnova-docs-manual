---

title: "Update from 1.0 to 1.1"
weight: 120
layout: "single"
draft: true

menu:
  main:
    name: "1.0 to 1.1"
    identifier: "migration-guide-10"
    parent: "migration-guide-minor"
    pre: "Update from `1.0.x` to `1.1.0`."

---

{{< note title="Reading the Guide" class="info" >}}
This guide uses a number of variables to denote common path names and constants:

*`$DATABASE` expresses the target database platform, e.g., DB2, MySql, etc.
*`$DISTRIBUTION_PATH` represents the path of the downloaded pre-packaged Fluxnova distribution, e.g., `fluxnova-bpm-tomcat-$PLATFORM_VERSION.zip` or `fluxnova-bpm-tomcat-$PLATFORM_VERSION.tar.gz` for Tomcat etc.
*`$PLATFORM_VERSION` denotes the version of Fluxnova you want to install, e.g., `7.1.0`.

{{< /note >}}


# Migrate Your Database

For migration from **Fluxnova.0** to **Fluxnova.1**, the provided update scripts that match your database have to be executed.
With a pre-packaged distribution, the update scripts are located in the folder `$DISTRIBUTION_PATH/sql/upgrade`.

Check for [available database patch scripts]({{< relref "/update/patch-level.md#database-patches" >}}) for an overview of available sql patch scripts  to see if there are any for your current version.

Regardless of the version you are migrating from, the main update script is `$DATABASE_engine_7.0_to_7.1.sql` and has to be executed next.


# Migrate Your Process Application

To migrate your process application from Fluxnova.0 to Fluxnova.1, you need to follow these steps:

* If you use `@Inject` with TaskForm, you have to add a `@Named("...")` annotation to the `@Inject` annotation due to backward-compatibility of `fluxnova.taskForm`.
  There you have two choices: If you are using `fluxnova.taskForm` in your process application and don't want to update all your jsf pages and beans you should use `@Named("fluxnova.taskForm")`,
  otherwise you should use `@Named("fluxnovaTaskForm")`. Your application server should write an error or a warning if you use the wrong one. So be careful! However, we recommend that you use the annotation `@Named("fluxnovaTaskForm")`.


# Migrate the Server

## JBoss AS 7.1.3 to 7.2.0

### Update the JBoss Application Server

Fluxnova.1 ships with a new version of the JBoss AS 7, namely, 7.2.0.
The preferred update steps are:

* copy all your custom modules / subsystems to the new JBoss server directory
* re-add all your custom modifications from the existing `$CAMUNDA_HOME/standalone/configuration/standalone.xml` to the new one located in the new JBoss server directory.
* copy all deployed datasources to the new JBoss server directory
* undeploy all process applications and copy them to the new JBoss server directory for redeployment
