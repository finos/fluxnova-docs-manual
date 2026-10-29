---

title: "Install the Database Schema"
weight: 03

menu:
  main:
    name: "Database Schema"
    identifier: "installation-guide-database-schema"
    parent: "installation-guide"
    pre: "Install and update the Fluxnova database schema used by the Process Engine."

---

This document will guide you through the installation and update of the Fluxnova [database schema]({{< relref "/user-guide/process-engine/database/database-schema.md" >}}) used by the process engine.
Regardless of the [architecture of your application setup]({{< relref "/introduction/architecture.md" >}}), the process engine always requires this database schema.
In a production environment, we recommend setting up this schema yourself and reference the prepared database instance in your application configuration.
Consult the installation guide related to your setup to configure the database for a [remote engine]({{< relref "/installation/fluxnova-bpm-run.md" >}}), [shared engine]({{< relref "/installation/full/_index.md" >}}), or [embedded engine]({{< relref "/installation/spring-boot.md" >}}) accordingly.

This guide will not detail how to set up an instance of your target database or how to create a schema object on it.
Consult the documentation of your target database on how to do that.
Fluxnova supports a variety of databases that are documented in the [supported environments]({{< relref "/introduction/supported-environments.md#databases" >}}). 

Fluxnova supports the following ways of installing the database schema:

* Use the database migration tool [Liquibase](https://www.liquibase.org/) with the provided changelogs for a semi-automatic installation and update. Liquibase keeps track of database schema changes. This allows you to focus on *when* changes should be applied rather than also on *which* changes are relevant.
  Alongside the existing `camunda-changelog.xml`, Fluxnova introduces `fluxnova-changelog.xml`:
    * `fluxnova-changelog.xml` (new): recommended for new installations and for databases already on Camunda `7.23` or any Fluxnova version. It starts from the Fluxnova `1.0` baseline and detects schema changes that are already applied.
    * `camunda-changelog.xml` (existing): continues to be shipped and supported. Use it for databases on Camunda versions older than `7.23`, or if you already use it to manage your schema.
* Use the provided SQL scripts with the tools related to your database for a fully manual installation and update. A manual procedure allows you to fully control the SQL statements that are executed on your database instance and to adjust those statements to your needs if necessary.

{{< note title="Isolation level" class="info" >}}
READ COMMITED is the required isolation level for database systems to run Fluxnova with. 
You may have to change the default setting on your database when installing Fluxnova. 
For more information see the documentation on [isolation levels]({{< relref "/user-guide/process-engine/database/database-configuration.md#isolation-level-configuration" >}}).
{{< /note >}}

# Installation

You can either install your database schema using Liquibase or using the provided SQL scripts manually. You can switch between those mechanisms when updating your Fluxnova version at a later stage if desired.
However, this might come with additional preparation work to work reliably. 
The [update](#update) paragraph provides more details on this topic.

## Liquibase installation

Fluxnova comes with two maintained changelog files that Liquibase can consume.
These changelogs define which SQL statements to execute on a database.
You can find the changelogs and their referenced resources on our [Artifact Repository].
Select the respective version (`$PLATFORM_VERSION`) and download the resources as a `zip` or `tar.gz` file.
Open the `fluxnova-sql-scripts-$PLATFORM_VERSION/liquibase` folder to find the changelogs. 
In case you are using a [pre-packaged distribution], the Liquibase resources already reside in the `sql/liquibase` folder of the distribution.

The `liquibase` folder contains the following resources:

* `fluxnova-changelog.xml` (new)
* `camunda-changelog.xml` (existing)
* `fluxnova-baseline` directory (new)
* `fluxnova-upgrade` directory (new)
* `baseline` directory

Liquibase uses these resources to install the schema.
`fluxnova-changelog.xml` uses the `fluxnova-baseline` and `fluxnova-upgrade` directories.
`camunda-changelog.xml` uses the `baseline` directory together with the scripts in the `upgrade` folder next to the `liquibase` folder.

### Choosing a changelog

Fluxnova ships two Liquibase changelogs. Select the changelog based on the current state of your database:

<table class="table table-striped">
  <thead>
  <tr>
    <th>Current database</th>
    <th>Changelog</th>
    <th>Preparation</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>Empty</td>
    <td><code>fluxnova-changelog.xml</code></td>
    <td>None</td>
  </tr>
  <tr>
    <td>Camunda <code>7.23</code> or Fluxnova <code>1.0</code> and later, not yet tracked by Liquibase</td>
    <td><code>fluxnova-changelog.xml</code></td>
    <td>None. Changesets that are already applied to the schema are detected and marked as executed.</td>
  </tr>
  <tr>
    <td>Camunda <code>7.16</code> to <code>7.22</code>, not yet tracked by Liquibase</td>
    <td><code>camunda-changelog.xml</code></td>
    <td>Run Liquibase's <code>changelogSyncToTag</code> command with your current schema version as the tag (e.g. <code>7.21.0</code>) before running <code>update</code>. See <a href="#migrate-to-liquibase">Migrate to Liquibase</a>.</td>
  </tr>
  <tr>
    <td>Already tracked by Liquibase</td>
    <td>The changelog you used before</td>
    <td>None</td>
  </tr>
  </tbody>
</table>

{{< note title="Heads Up!" class="info" >}}
`fluxnova-changelog.xml` does not check the Camunda version of an existing schema.
Running it against a Camunda database older than `7.23` skips required schema changes.
Use `camunda-changelog.xml` for these databases.
{{< /note >}}

Perform the following steps to install the database schema on your database instance:

1. Setup Liquibase, e.g. by [downloading Liquibase CLI](https://www.liquibase.org/download)
1. Run Liquibase's [update command](https://docs.liquibase.com/commands/community/update.html) referencing the changelog selected in [Choosing a changelog](#choosing-a-changelog).
For databases on Camunda versions older than `7.23`, run the [changelogSyncToTag](#migrate-to-liquibase) step first.
You can pass on the connection details to your database instance via parameters as described in the Liquibase documentation or [create a properties file](https://docs.liquibase.com/workflows/liquibase-community/creating-config-properties.html).

Liquibase creates two additional tables to keep track of the changes that have been applied to your database.
The `DATABASECHANGELOG` table keeps track of all applied changes. The `DATABASECHANGELOGLOCK` table prevents conflicts from concurrent updates on your database instance by multiple Liquibase instances. You can read more about it in the [Liquibase guide](https://www.liquibase.org/get-started/how-liquibase-works).

As you create the tables externally via Liquibase, you have to configure the engine to **not** create tables at startup as well.
Set the `databaseSchemaUpdate` property to `false` (or, in case you are using Oracle, to `noop`).
Consult the [manual installation guide]({{< relref "/installation/full/_index.md" >}}) of your distribution for further information on how to achieve that.

{{< note title="Heads Up!" class="info" >}}
Liquibase provides additional commands to preview all changes that will be applied by commands that execute SQL statements on a database. For the `update` command, you can execute the [updateSql](https://docs.liquibase.com/commands/community/updatesql.html) command. This will let you inspect all statements that Liquibase will issue on your database without actually executing them.

Furthermore, if you have defined a specific prefix for the entities of your database, you will have to manually adjust the `create` scripts accordingly so that the tables are created with the prefix. Use the `liquibase/fluxnova-baseline` directory for `fluxnova-changelog.xml`, or the `liquibase/baseline` directory for `camunda-changelog.xml`.
{{< /note >}}

### Using a custom changelog

If your application manages its own database objects with Liquibase, you can use your own master changelog instead of referencing a Fluxnova changelog directly. To create the Fluxnova schema from scratch, your master changelog must include `fluxnova-changelog.xml`. Otherwise the Fluxnova tables are not created on an empty database. Include it **before** any changesets that reference Fluxnova tables:

```xml
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.1.xsd">

<include file="org/finos/fluxnova/bpm/engine/db/liquibase/fluxnova-changelog.xml"/>
<include file="db/changelog/my-app-changes.xml"/>

</databaseChangeLog>
```

{{< note title="Heads Up!" class="info" >}}
Liquibase identifies each changeset by its ID, author, and changelog file path.
Keep the include path of the Fluxnova changelog stable across releases. Changing it causes Liquibase to treat the Fluxnova changesets as new and try to create the schema again.
{{< /note >}}

When upgrading to a newer Fluxnova version, update the Fluxnova resources. Your master changelog does not need to change, and Liquibase applies only the new Fluxnova changesets.

### Liquibase with the Spring Boot Starter

The Fluxnova Spring Boot Starter integrates with Spring Boot's
[Liquibase auto-configuration](https://docs.spring.io/spring-boot/how-to/data-initialization.html#howto.data-initialization.migration-tool.liquibase)
and brings the `spring-boot-starter-liquibase` dependency with it.
Instead of running the Liquibase CLI, you can let the application apply the changelog on startup.

The starter applies the following defaults:

```properties
spring.liquibase.enabled=false
spring.liquibase.change-log=classpath:org/finos/fluxnova/bpm/engine/db/liquibase/fluxnova-changelog.xml
```

These defaults have the lowest precedence. Any value you set in `application.properties`/`application.yml`,
environment variables, or command-line arguments overrides them.

To enable Liquibase, set:

```properties
spring.liquibase.enabled=true
```

To use a different changelog, for example `camunda-changelog.xml` for Camunda databases older than `7.23`
or your own master changelog (see [Using a custom changelog](#using-a-custom-changelog)), also set:

```properties
spring.liquibase.change-log=classpath:org/finos/fluxnova/bpm/engine/db/liquibase/camunda-changelog.xml
```

When Liquibase is enabled, the starter sets the engine's `databaseSchemaUpdate` to `false`
and ignores `fluxnova.bpm.database.schema-update`, so the process engine does not create or update tables itself.
When Liquibase is disabled, the engine uses `fluxnova.bpm.database.schema-update` as before.

{{< note title="Heads Up!" class="info" >}}
Spring Boot enables Liquibase by default and reads `classpath:db/changelog/db.changelog-master.yaml`.
The Fluxnova starter overrides both defaults. If your application already uses Liquibase, set
`spring.liquibase.enabled` and `spring.liquibase.change-log` explicitly so your migrations keep running.
{{< /note >}}

## Manual installation

To install the database schema required for Fluxnova, we provide a set of scripts with prepared DDL statements.
Those scripts create all required tables and default indices. You can find the provided SQL scripts on our [Artifact Repository]. 
Select the respective version (`$PLATFORM_VERSION`) and download the scripts as a `zip` or `tar.gz` file.
Open the `fluxnova-sql-scripts-$PLATFORM_VERSION/create` folder to find all available scripts. 
In case you are using a [pre-packaged distribution], the SQL scripts already reside in the `sql/create` folder of the distribution.

The `create` folder contains the following SQL scripts:

* `$DATABASENAME_engine_$PLATFORM_VERSION.sql`
* `$DATABASENAME_identity_$PLATFORM_VERSION.sql`

There are individual SQL scripts for each supported database (`$DATABASENAME`).
Select the appropriate scripts for your database and run them with your database administration tool (e.g., SqlDeveloper for Oracle).

As you create the tables manually, you have to configure the engine to **not** create tables at startup as well.
Set the `databaseSchemaUpdate` property to `false` (or, in case you are using Oracle, to `noop`).
Consult the [manual installation guide]({{< relref "/installation/full/_index.md" >}}) of your distribution for further information on how to achieve that.

{{< note title="Heads Up!" class="info" >}}
If you have defined a specific prefix for the entities of your database, you will have to manually adjust the `create` scripts accordingly so that the tables are created with the prefix.
{{< /note >}}

# Update

Updating to a newer Fluxnova minor version also requires a database schema update. You can reuse all the options available for a [schema installation](#installation) here as well.
If you are switching from one option to another, you might need to perform additional preparation work to update reliably.
The individual sections on the mechanisms will provide details if necessary.

In case you are just updating to a newer patch level of your Fluxnova installation, a schema update might not be necessary.
Section [patch level update](#patch-level-update) provides details on how this can be achieved depending on the mechanism you want to apply.

## Liquibase update

This section assumes you are already set up with Liquibase as described in the [installation section](#liquibase-installation).
In case you have not set up Liquibase itself yet and want to update a database that you [manually installed](#manual-installation) and updated until now, please consult the [migration section](#migrate-to-liquibase) first.

Fluxnova comes with two maintained changelog files that Liquibase can consume.
These changelogs help Liquibase to keep track of the changes that have been made to your database already.
Based on the changelog and the tracking tables, Liquibase determines which changes it needs to apply when you instruct it to update your schema.

Perform the following steps to update the database schema on your database instance:

1. Select the respective version you want to update to (`$Y`) on our [Artifact Repository] and download the resources as a `zip` or `tar.gz` file.
Open the `fluxnova-sql-scripts-$Y/liquibase` folder to find the changelog files.
In case you are using a [pre-packaged distribution], the Liquibase resources already reside in the `sql/liquibase` folder of the distribution with version `$Y`.
1. Run Liquibase's [update command](https://docs.liquibase.com/commands/community/update.html) referencing the changelog of version `$Y` that you already use for this database (`fluxnova-changelog.xml` or `camunda-changelog.xml`).
Liquibase takes care of determining the necessary changes and applying them to your database according to the new changelog.
You can pass on the connection details to your database instance via parameters as described in the Liquibase documentation or [create a properties file](https://docs.liquibase.com/workflows/liquibase-community/creating-config-properties.html).
1. We highly recommend updating to the latest patch version that is within the bounds of the new minor version you are updating to (`$Y`).

    _Attention_: This step is only relevant when you are using an enterprise version of Fluxnova, e.g., `7.16.X` where `X > 0`.

{{< note title="Do I need to apply every minor version if I missed a few?" class="warning" >}}
Liquibase takes care of determining which upgrade scripts to apply automatically according to the changelog of your target version (`$Y`).
{{< /note >}}

{{< note title="Dry run" class="info" >}}
Liquibase provides additional commands to preview all changes applied by commands that execute SQL statements on a database. For the `update` command, you can execute the [updateSql](https://docs.liquibase.com/commands/community/updatesql.html) command to inspect all statements that Liquibase will issue on your database without actually executing them.
{{< /note >}}

### Migrate to Liquibase

Liquibase provides workflows to update databases that were not set up using Liquibase from the very beginning.
For such a scenario to work, you need to populate a tracking table that represents the current state of your database with regards to the changelog file you want to update against.
In other words, you need to let Liquibase know which parts of the changelog your database already contains.

Perform the following steps to migrate your manual installation to Liquibase:

1. Setup Liquibase, e.g. by [downloading Liquibase CLI](https://www.liquibase.org/download)
1. Identify your current database schema version. You can extract this information from the `ACT_GE_SCHEMA_LOG` table.
Find the row with the highest value in the `ID_` column and use the value of this row's `VERSION_` column.
1. Run Liquibase's [changelogSyncToTag command](https://docs.liquibase.com/commands/community/changelogsynctotag.html) using your current database schema version as the tag:
    * Camunda `7.16` to `7.22`: reference `camunda-changelog.xml`, e.g. with tag `7.21.0`.
    * Camunda `7.23` or Fluxnova: this step is optional. `fluxnova-changelog.xml` detects the existing schema, so you can run the `update` command directly.

    You can pass on the connection details to your database instance via parameters as described in the Liquibase documentation or [create a properties file](https://docs.liquibase.com/workflows/liquibase-community/creating-config-properties.html).

Liquibase uses this information to create the tracking tables and mark all changesets until the tag you defined as executed.
Liquibase determines if there are any changes that it needs to apply to your database for any subsequent `update` commands.
You have migrated your manual installation to Liquibase.

## Manual update

Updating from your current minor version (`$X`) to its follow-up version (`$Y`) requires updating the database schema as well. 
Follow the outlined procedure to perform this update:

1. Check for [available database patch scripts](#patch-level-update) for your database that are within the bounds of your update path.
You can find the scripts on our [Artifact Repository].
Select the respective version you want to update to (`$Y`) and download the scripts as a `zip` or `tar.gz` file.
Open the `fluxnova-sql-scripts-$Y/upgrade` folder to find all available scripts. 
In case you are using a [pre-packaged distribution], the SQL scripts already reside in the `sql/upgrade` folder of the distribution with version `$Y`.
We highly recommend executing these patches before updating.
Execute those related to your database type (`$DATABASENAME`) in ascending order by version number.
The naming pattern is `$DATABASENAME_engine_$X_patch_*.sql`.

1. Execute the corresponding update scripts named `$DATABASENAME_engine_$X_to_$Y.sql`.
The scripts update the database from one minor version to the next and change the underlying database structure. So make sure to backup your database in case there are any failures during the update process.

1. We highly recommend checking for any existing patch scripts for your database that are within the bounds of the new minor version you are updating to (`$Y`). Execute them in ascending order by version number. The procedure is the same as in step 1, only for the new minor version.

    _Attention_: This step is only relevant when you are using an enterprise version of Fluxnova, e.g., `7.16.X` where `X > 0`.

{{< note title="Do I need to apply every minor version if I missed a few?" class="warning" >}}
If you need to apply multiple minor versions, you MUST execute the database alteration scripts in minor version order as they are NOT cumulative.
{{< /note >}}

## Patch level update

This section explains how to perform a [patch-level update]({{< relref "/update/patch-level.md" >}}) for your database schema. The *patch level* is the version number "after the second dot". For example, update from `7.14.2` to `7.14.3`.

Between patch levels, the structure of the database schema does not change. The database structure of all patch releases is backward compatible with the corresponding minor version. For example, the database schema of all `7.14.x` versions are backward compatible with the `7.14.0` schema.

The one exception to this is a bug in the database schema itself. If you are affected by such a bug, you have the option to run a patch script. The following list contains all available patch scripts, information on what the fixes are related to, and a link to the corresponding [Fluxnova Jira](https://jira.camunda.com/projects/CAM) issue:

<table class="table desc-table">
  <thead>
    <tr>
      <th>Fluxnova Version</th>
      <th>Patch file</th>
      <th>Description</th>
      <th>Affected databases</th>
      <th>Issue link</th>
    <tr>
  </thead>
  <tbody>
    <tr>
      <td>7.1</td>
      <td>engine_7.1_patch_7.1.4_to_7.1.5.sql</td>
      <td>Add a missing index on foreign key to prevent deadlocks</td>
      <td>H2, MySQL, Oracle, PostgreSQL</td>
      <td><a href="https://jira.camunda.com/browse/CAM-2567">CAM-2567</a></td>
    </tr>
    <tr>
      <td>7.1</td>
      <td>engine_7.1_patch_7.1.9_to_7.1.10.sql</td>
      <td>Add a missing index on foreign key to prevent deadlocks</td>
      <td>DB2, SQL Server</td>
      <td><a href="https://jira.camunda.com/browse/CAM-3565">CAM-3565</a></td>
    </tr>
    <tr>
      <td>7.2</td>
      <td>engine_7.2_patch_7.2.4_to_7.2.5.sql</td>
      <td>Add a missing index on foreign key to prevent deadlocks. <strong>This is the same patch as engine_7.1_patch_7.1.9_to_7.1.10.sql</strong>.</td>
      <td>DB2, SQL Server</td>
      <td><a href="https://jira.camunda.com/browse/CAM-3565">CAM-3565</a></td>
    </tr>
    <tr>
      <td>7.2</td>
      <td>engine_7.2_patch_7.2.6_to_7.2.7.sql</td>
      <td>Add indices to improve deployment performance.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-4497">CAM-4497</a></td>
    </tr>
    <tr>
      <td>7.3</td>
      <td>engine_7.3_patch_7.3.0_to_7.3.1.sql</td>
      <td>Adjust column size of ACT_HI_JOB_LOG.ACT_ID_ to 255.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-4037">CAM-4037</a></td>
    </tr>
    <tr>
      <td>7.3</td>
      <td>engine_7.3_patch_7.3.2_to_7.3.3_1.sql</td>
      <td>Add a missing index on ACT_RU_AUTHORIZATION#RESOURCE_ID_ to prevent deadlocks.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-4440">CAM-4440</a></td>
    </tr>
    <tr>
      <td>7.3</td>
      <td>engine_7.3_patch_7.3.2_to_7.3.3_2.sql</td>
      <td>Add indices to improve deployment performance. <strong>This is the same patch as engine_7.2_patch_7.2.6_to_7.2.7.sql</strong>.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-4497">CAM-4497</a></td>
    </tr>
    <tr>
      <td>7.3</td>
      <td>engine_7.3_patch_7.3.5_to_7.3.6_1.sql</td>
      <td>Adjust column size of ACT_RU_JOB.PROCESS_DEF_KEY_ to 255.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-4328">CAM-4328</a></td>
    </tr>
    <tr>
      <td>7.3</td>
      <td>engine_7.3_patch_7.3.5_to_7.3.6_2.sql</td>
      <td>Add indices to improve performance of group authorizations.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-5364">CAM-5364</a></td>
    </tr>
    <tr>
      <td>7.4</td>
      <td>engine_7.4_patch_7.4.2_to_7.4.3_1.sql</td>
      <td>Add index to improve historic activity instance statistics query performance.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-5257">CAM-5257</a></td>
    </tr>
    <tr>
      <td>7.4</td>
      <td>engine_7.4_patch_7.4.2_to_7.4.3_2.sql</td>
      <td>Add a missing index on ACT_RU_EXT_TASK#EXECUTION_ID_ to prevent deadlocks.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-5440">CAM-5440</a></td>
    </tr>
    <tr>
      <td>7.4</td>
      <td>engine_7.4_patch_7.4.2_to_7.4.3_3.sql</td>
      <td>Add indices to improve performance of group authorizations. <strong>This is the same patch as engine_7.3_patch_7.3.5_to_7.3.6_2.sql</strong>.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-5364">CAM-5364</a></td>
    </tr>
    <tr>
      <td>7.4</td>
      <td>engine_7.4_patch_7.4.5_to_7.4.6.sql</td>
      <td>Adjust column size of ACT_RU_JOB.PROCESS_DEF_KEY_ to 255. <strong>This is the same patch as engine_7.3_patch_7.3.5_to_7.3.6_1.sql</strong>.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-4328">CAM-4328</a></td>
    </tr>
    <tr>
      <td>7.6</td>
      <td>engine_7.6_patch_7.6.0_to_7.6.1.sql</td>
      <td>Adjust column size of ACT_RU_EVENT_SUBSCR.ACTIVITY_ID_ to 255.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-6788">CAM-6788</a></td>
    </tr>
    <tr>
      <td>7.6</td>
      <td>engine_7.6_patch_7.6.2_to_7.6.3_1.sql</td>
      <td>Add a missing index on ACT_RU_EXT_TASK#ERROR_DETAILS_ID_ to prevent deadlocks.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-7263">CAM-7263</a></td>
    </tr>
    <tr>
      <td>7.6</td>
      <td>engine_7.6_patch_7.6.2_to_7.6.3_2.sql</td>
      <td>Remove an incorrect index ACT_RU_JOB#ACT_IDX_JOB_HANDLER for MSSQL Server.</td>
      <td>MSSQL Server</td>
      <td><a href="https://jira.camunda.com/browse/CAM-7442">CAM-7442</a></td>
    </tr>
    <tr>
      <td>7.7</td>
      <td>engine_7.7_patch_7.7.3_to_7.7.4.sql</td>
      <td>Insert new startup.lock in ACT_GE_PROPERTY.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-8162">CAM-8162</a></td>
    </tr>
    <tr>
      <td>7.7</td>
      <td>engine_7.7_patch_7.7.4_to_7.7.5_1.sql</td>
      <td>Add indices to improve performance of history cleanup</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-8184">CAM-8184</a></td>
    </tr>
    <tr>
      <td>7.7</td>
      <td>engine_7.7_patch_7.7.4_to_7.7.5_2.sql</td>
      <td>Increase the field length of ACT_RU_AUTHORIZATION.RESOURCE_ID_</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-8177">CAM-8177</a></td>
    </tr>
    <tr>
      <td>7.7</td>
      <td>engine_7.7_patch_7.7.5_to_7.7.6.sql</td>
      <td>Add indices to improve historic activity instance statistics</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-8485">CAM-8485</a></td>
    </tr>
    <tr>
      <td>7.7</td>
      <td>engine_7.7_patch_7.7.8_to_7.7.9_1.sql</td>
      <td>Add indexes on Process Definition ID and End Time for Historic Process Instance and Historic Activity Instance</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-8833">CAM-8833</a></td>
    </tr>
    <td>7.7</td>
      <td>engine_7.7_patch_7.7.8_to_7.7.9_2.sql</td>
      <td>Add a missing index on foreign key to prevent deadlocks.</td>
      <td>DB2, SQL Server</td>
      <td><a href="https://jira.camunda.com/browse/CAM-9165">CAM-9165</a></td>
    </tr>
    <tr>
      <td>7.8</td>
      <td>engine_7.8_patch_7.8.0_to_7.8.1.sql</td>
      <td>Add indices to improve historic activity instance statistics. <strong>This is the same patch as engine_7.7_patch_7.7.5_to_7.7.6.sql</strong>.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-8485">CAM-8485</a></td>
    </tr>
    <tr>
      <td>7.8</td>
      <td>engine_7.8_patch_7.8.4_to_7.8.5.sql</td>
      <td>Add indexes on Process Definition ID and End Time for Historic Process Instance and Historic Activity Instance.
      <strong>This is the same patch as engine_7.7_patch_7.7.8_to_7.7.9_1.sql.</strong>
      </td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-8833">CAM-8833</a></td>
    </tr>
    <tr>
      <td>7.8</td>
      <td>engine_7.8_patch_7.8.7_to_7.8.8.sql</td>
      <td>Add a missing index on foreign key to prevent deadlocks.
      <strong>This is the same patch as engine_7.7_patch_7.7.8_to_7.7.9_2.sql.</strong>
      </td>
      <td>DB2, SQL Server</td>
      <td><a href="https://jira.camunda.com/browse/CAM-9165">CAM-9165</a></td>
    </tr>
    <tr>
      <td>7.8</td>
      <td>engine_7.8_patch_7.8.8_to_7.8.9.sql</td>
      <td>Drop ACT_IDX_JOB_HANDLER index causing issues on DB2.</td>
      <td>DB2</td>
      <td><a href="https://jira.camunda.com/browse/CAM-7676">CAM-7676</a></td>
    </tr>
    <tr>
      <td>7.8</td>
      <td>engine_7.8_patch_7.8.11_to_7.8.12.sql</td>
      <td>Add index to improve history cleanup performance.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-9435">CAM-9435</a></td>
    </tr>
    <tr>
      <td>7.8</td>
      <td>engine_7.8_patch_7.8.12_to_7.8.13_1.sql</td>
      <td>Add support for Optimize 2.3.</td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-9523">CAM-9523</a>
      </td>
    </tr>
    <tr>
      <td>7.8</td>
      <td>engine_7.8_patch_7.8.12_to_7.8.13_2.sql</td>
      <td>Add support for Optimize 2.3.</td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-9525">CAM-9525</a>
      </td>
    </tr>
    <tr>
      <td>7.9</td>
      <td>engine_7.9_patch_7.9.0_to_7.9.1.sql</td>
      <td>Add index to improve historic operation logs performance.</td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-9006">CAM-9006</a></td>
    </tr>
    <tr>
      <td>7.9</td>
      <td>engine_7.9_patch_7.9.1_to_7.9.2.sql</td>
      <td>Add a missing index on foreign key to prevent deadlocks.
      <strong>This is the same patch as engine_7.8_patch_7.8.7_to_7.8.8.sql.</strong>
      </td>
      <td>DB2, SQL Server</td>
      <td><a href="https://jira.camunda.com/browse/CAM-9165">CAM-9165</a></td>
    </tr>
    <tr>
      <td>7.9</td>
      <td>engine_7.9_patch_7.9.2_to_7.9.3.sql</td>
      <td>Drop ACT_IDX_JOB_HANDLER index causing issues on DB2.
      <strong>This is the same patch as engine_7.8_patch_7.8.8_to_7.8.9.sql.</strong>
      </td>
      <td>DB2</td>
      <td><a href="https://jira.camunda.com/browse/CAM-7676">CAM-7676</a></td>
    </tr>
    <tr>
      <td>7.9</td>
      <td>engine_7.9_patch_7.9.5_to_7.9.6.sql</td>
      <td>Add index to improve history cleanup performance.
      <strong>This is the same patch as engine_7.8_patch_7.8.11_to_7.8.12.sql.</strong>
      </td>
      <td>All databases</td>
      <td><a href="https://jira.camunda.com/browse/CAM-9435">CAM-9435</a></td>
    </tr>
    <tr>
      <td>7.9</td>
      <td>engine_7.9_patch_7.9.6_to_7.9.7_1.sql</td>
      <td>Add support for Optimize 2.3.
      <strong>This is the same patch as engine_7.8_patch_7.8.12_to_7.8.13_1.sql.</strong>
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-9523">CAM-9523</a>
      </td>
    </tr>
    <tr>
      <td>7.9</td>
      <td>engine_7.9_patch_7.9.6_to_7.9.7_2.sql</td>
      <td>Add support for Optimize 2.3.
      <strong>This is the same patch as engine_7.8_patch_7.8.12_to_7.8.13_2.sql.</strong>
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-9525">CAM-9525</a>
      </td>
    </tr>
    <tr>
      <td>7.9</td>
      <td>engine_7.9_patch_7.9.11_to_7.9.12.sql</td>
      <td>Add support for Optimize 2.5.
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-10264">CAM-10264</a>
      </td>
    </tr>
    <tr>
      <td>7.10</td>
      <td>engine_7.10_patch_7.10.5_to_7.10.6.sql</td>
      <td>Add support for Optimize 2.5.
      <strong>This is the same patch as engine_7.9_patch_7.9.11_to_7.9.12.sql.</strong>
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-10264">CAM-10264</a>
      </td>
    </tr>
    <tr>
      <td>7.10</td>
      <td>engine_7.10_patch_7.10.6_to_7.10.7.sql</td>
      <td>Add index to improve history cleanup performance.
      <br>
      <strong>This patch script is introduced in 7.10.9</strong>. If your current patch is 7.10.6, 7.10.7 or 7.10.8, please execute the script to upgrade to 7.10.9+.
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-10616">CAM-10616</a>
      </td>
    </tr>
    <tr>
      <td>7.10</td>
      <td>engine_7.10_patch_7.10.13_to_7.10.14.sql</td>
      <td>Add index to improve Historic Activity Instance query performance.</td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-11117">CAM-11117</a>
      </td>
    </tr>
    <tr>
      <td>7.11</td>
      <td>engine_7.11_patch_7.11.2_to_7.11.3.sql</td>
      <td>Add index to improve history cleanup performance.
      <strong>This is the same patch as engine_7.10_patch_7.10.6_to_7.10.7.sql.</strong>
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-10616">CAM-10616</a>
      </td>
    </tr>
    <tr>
      <td>7.11</td>
      <td>engine_7.11_patch_7.11.7_to_7.11.8.sql</td>
      <td>Add index to improve Historic Activity Instance query performance.
      <strong>This is the same patch as engine_7.10_patch_7.10.13_to_7.10.14.sql.</strong>
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-11117">CAM-11117</a>
      </td>
    </tr>
    <tr>
      <td>7.11</td>
      <td>engine_7.11_patch_7.11.18_to_7.11.19.sql</td>
      <td>Introducing new engine lock properties</td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-12590">CAM-12590</a>
      </td>
    </tr>
    <tr>
      <td>7.12</td>
      <td>engine_7.12_patch_7.12.0_to_7.12.1.sql</td>
      <td>Add index to improve Historic Activity Instance query performance.
      <strong>This is the same patch as engine_7.11_patch_7.11.7_to_7.11.8.sql.</strong>
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-11117">CAM-11117</a>
      </td>
    </tr>
    <tr>
      <td>7.12</td>
      <td>engine_7.12_patch_7.12.10_to_7.12.11.sql</td>
      <td>Add support for Optimize 3.2.
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-12383">CAM-12383</a>
      </td>
    </tr>
    <tr>
      <td>7.12</td>
      <td>engine_7.12_patch_7.12.11_to_7.12.12.sql</td>
      <td>Introducing new engine lock properties
      <strong>This is the same patch as engine_7.11_patch_7.11.18_to_7.11.19.sql.</strong>
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-12590">CAM-12590</a>
      </td>
    </tr>
    <tr>
      <td>7.13</td>
      <td>engine_7.13_patch_7.13.4_to_7.13.5_1.sql</td>
      <td>Add index to improve Task query performance.
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-4441">CAM-4441</a>
      </td>
    </tr>
    <tr>
      <td>7.13</td>
      <td>engine_7.13_patch_7.13.4_to_7.13.5_2.sql</td>
      <td>Add support for Optimize 3.2.
      <strong>This is the same patch as engine_7.12_patch_7.12.10_to_7.12.11.sql.</strong>
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-12383">CAM-12383</a>
      </td>
    </tr>
    <tr>
      <td>7.13</td>
      <td>engine_7.13_patch_7.13.5_to_7.13.6.sql</td>
      <td>Introducing new engine lock properties
      <strong>This is the same patch as engine_7.12_patch_7.12.11_to_7.12.12.sql.</strong>
      </td>
      <td>All databases</td>
      <td>
        <a href="https://jira.camunda.com/browse/CAM-12590">CAM-12590</a>
      </td>
    </tr>
    <tr>
      <td>7.14</td>
      <td>engine_7.14_patch_7.14.2_to_7.14.3.sql</td>
      <td>Re-define ACT_IDX_JOB_HANDLER index to make it work with <a href="https://docs.oracle.com/en/database/oracle/oracle-database/18/spuss/enabling-the-new-extended-data-type-capability.html">extended data types</a> on Oracle.</td>
      <td>Oracle</td>
      <td><a href="https://jira.camunda.com/browse/CAM-12832">CAM-12832</a></td>
    </tr>
  </tbody>
</table>

### Liquibase patch level update

Fluxnova comes with two maintained changelog files that Liquibase can consume.
These changelogs help Liquibase to keep track of the changes that have been made to your database already.
Based on the changelog and the tracking tables, Liquibase determines which changes it needs to apply when instructing it to update your schema.
Therefore, the procedure for patch-level updates is equivalent to that for [minor version updates](#liquibase-update).

### Manual patch level update

You can find the necessary scripts on our [Artifact Repository].
Select the respective patch version you want to update to (`$Y`) and download the scripts as a `zip` or `tar.gz` file.
Open the `fluxnova-sql-scripts-$Y/upgrade` folder to find all available patch scripts.
In case you are using a [pre-packaged distribution], the SQL scripts reside in the `sql/upgrade` folder of the distribution you want to update to.

The patch scripts are named `$DATABASENAME_engine_$MINOR_patch_$A_to_$B`, with `$A` being the patch level version to update from, `$B` the patch level to update to, and `$MINOR` the minor version they are on, e.g., `7.16`.
If you do choose to apply a database patch, then you must apply all patch scripts that are within the bounds of your update path. This means if your current patch version is `X.X.1` and you update to `X.X.5` you have to execute all patch scripts first where `$A` &ge; `X.X.1` and `$B` &le; `X.X.5`.

<strong>Note:</strong> Some patches are provided for multiple versions. It is not required to execute them more than once. See the description of the [patch version list](#patch-level-update) for information on duplicate fixes.

[Artifact Repository]: https://artifacts.camunda.com/artifactory/camunda-bpm/org/finos/fluxnova/bpm/distro/camunda-sql-scripts/
[pre-packaged distribution]: {{< relref "/introduction/downloading-fluxnova.md#full-distribution" >}}
