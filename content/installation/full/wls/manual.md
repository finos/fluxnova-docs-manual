---

title: 'Install the Full Distribution on Oracle WebLogic Application Server'
weight: 20

menu:
  main:
    name: "Manual Installation"
    identifier: "installation-guide-full-wls-install-manual"
    parent: "installation-guide-full-wls"
    pre: "Install and configure the Full Distribution on Oracle WebLogic Application Server."

---


This section will describe how you can install Fluxnova and its components on Oracle WebLogic.

{{< note title="Reading this Guide" class="info" >}}
This guide uses a number of variables to denote common path names and constants.

* `$WLS_DOMAIN_HOME` points to the Oracle WebLogic application server domain directory (typically something like `/opt/oracle/WebLogic/domains/mydomain`).
* `$PLATFORM_VERSION` denotes the version of Fluxnova you want to or have installed, e.g. `1.X.Y`.
* `$WLS_DISTRIBUTION` represents the downloaded Fluxnova distribution for the Oracle WebLogic Application Server, e.g., `fuxnova-oracle-wls-$PLATFORM_VERSION.zip`.

The distribution is available at the Fluxnova release page.
You will be asked to enter the credentials you received during the trial or subscription process.
{{< /note >}}

# Setup

Before you can install the Fluxnova components, you need to perform a number of required setup steps.


## Resource Configuration

Fluxnova requires a set of resources that need to be configured at the application server level:

* One or multiple datasources to be used by the engine.
* A work manager for the job executor.


## Create the Database Schema and Tables

In the default configuration of the distribution, the database schema and all required tables are automatically created in an H2 database when the engine starts up for the first time. If you do not want to use the H2 database, you have to

* Create a database schema for Fluxnova yourself.
* Install the database schema to create all required tables and default indices using our [database schema installation guide]({{< ref "/installation/database-schema.md" >}}).

When you create the tables manually, then you have to configure the engine to **not** create tables at startup by setting the `databaseSchemaUpdate` property to `false` (or, in case you are using Oracle, to `noop`). In WebLogic, this is done in the `bpm-platform.xml`, located in the `$WLS_HOME\modules\fluxnova-oracle-weblogic-ear-$VERSION.ear\fluxnova-oracle-weblogic-service.jar\META-INF\` folder.


## JDBC/Datasource Configuration

Fluxnova uses one or multiple process engines. Use the Oracle WebLogic Server Administration Console for the configuration of the datasources.
The JNDI name of the datasource must be equal to the name used in the datasource-Element of the process engine(s) configured in the bpm-platform.xml.


### Default JNDI Name

The default JNDI name is `jdbc/ProcessEngine`

The following screenshot shows the mandatory configuration of a datasource for Fluxnova:

{{< img outdated="true" src="../img/datasource-jndi.png" title="JNDI Name" >}}

In this section we explain how to add a datasource using the WebLogic Remote Console:

1. Open the WebLogic Remote Console.
2. Switch to **"Edit Tree"**.
3. Navigate to the **"Services / Data Sources"** page.
4. Click the **"New"** Button.
5. On the next page, enter a name for the datasource.
6. Enter the required JNDI Name **"jdbc/ProcessEngine"**, which is **mandatory** for Fluxnova.
7. Select available target.
8. In **"Data Source Type"** select **"Generic Data Source"**.
9. Select your database type in **"Database Type"** field.
10. Fill in your database credentials: **"Database Name"**, **"Host Name"**, **"Port"**, **"Database User Name"** and **"Password"**.
11. Click **"Create"** button to save datasource.
12. Press **"Shopping Card"** button and commit your changes.

Note that you can configure multiple datasources used by different process engine instances. See the [User Guide]({{< ref "/user-guide/_index.md" >}}) for details.


# Required Components

The following steps are required to deploy Fluxnova onto an Oracle WebLogic server.


## Install Fluxnova Domain Libraries

The domain libraries include the Fluxnova engine and some utility JARs. The domain libraries must be visible to both Fluxnova as well as all process applications.

The domain libraries can be found in the lib folder of the distribution:

```
fluxnova-oracle-wls-$PLATFORM_VERSION.zip
|-- modules/
      |-- lib/  <-- The domain libs
           |-- fluxnova-engine-$PLATFORM_VERSION.jar
           |-- java-uuid-generator-XX.jar
           |-- mybatis-XX.jar
           |-- ...
      |-- fluxnova-oracle-weblogic-ear-$PLATFORM_VERSION.ear
```

The domain libraries must be copied to the `$WLS_DOMAIN_HOME/lib` folder of your Oracle WebLogic Server installation. Do **"NOT"** copy it to your `$WL_HOME/lib` folder.
Restart the Oracle WebLogic Server after this operation.

### Use a Custom Location for the Domain Libraries

You can change the location of the domain libraries with the `-Dweblogic.ext.dirs`
[startup option](https://docs.oracle.com/middleware/12213/wls/START/overview.htm#START-GUID-69C7DB81-B1C5-4BCB-ADCF-2F44B66DD9F8).

## Install Fluxnova Modules

Fluxnova includes one module in the modules folder of the distribution:

```
fluxnova-oracle-wls-$PLATFORM_VERSION.zip
|-- modules/
      |-- fluxnova-oracle-weblogic-ear-$PLATFORM_VERSION.ear
```

The `fluxnova-oracle-weblogic-ear` is a Jakarta EE 8 application providing the Fluxnova services. It contains an embedded JCA Resource Adapter, the fluxnova-oracle-weblogic-rar, which provides the jobexecutor service to Fluxnova.
It must be installed to your Oracle WebLogic Application Server.


## Install the Fluxnova Application

In this section, we explain how the fluxnova-oracle-weblogic-ear module can be installed using the Oracle WebLogic Server Administration Console.
The installation process is composed of two steps:

1. Install the `fluxnova-oracle-weblogic-ear-$PLATFORM_VERSION.ear` EAR file.
2. Configure the deployment order of `fluxnova-oracle-weblogic-ear-$PLATFORM_VERSION.ear` EAR file.


### Install the EAR File

First the `fluxnova-oracle-weblogic-ear-$PLATFORM_VERSION.ear` RAR file must be installed:

1. Open the WebLogic Remote Console.
2. Switch to **"Edit Tree"**.
3. Navigate to the **"Deployments / App Deployments"** page.
4. Click the **"New"** button.
5. Fill in `fluxnova-bpm-platform` in **"Name"** field.
6. Select available target.
7. Use upload icon in right corner of **"Source"** field to select the `fluxnova-oracle-weblogic-ear-$PLATFORM_VERSION.ear` from the modules folder of Fluxnova for Oracle WebLogic Application Server distribution.
8. Click **"Create"** button.
9. Press **"Shopping Card"** button and commit your changes.
{{< note title="Heads Up!" class="info" >}}
The names of the [JNDI Bindings for Fluxnova Services]({{< ref "/user-guide/runtime-container-integration/jndi-bindings-for-bpmn-platform-services.md" >}}) consist of the name of the enterprise application deployment.

**Please note:** If you change the name of the enterprise application deployment, the JNDI names change as well.
{{< /note >}}
{{< img outdated="true" src="../img/ear-name.png" title="EAR Name" >}}
10. (optional) [Configure location of the bpm-platform.xml file]({{< ref "/reference/deployment-descriptors/descriptors/bpm-platform-xml.md#configure-location-of-the-bpm-platform-xml-file" >}}).

### Configure the Deployment Order

1. In the deployment's configuration screen, change the value of the **"Deployment Order"** from **"100"** to **"90"**, so the Enterprise Application starts before process application deployments.
2. Click **"Save"** to persist the change.
3. Press **"Shopping Card"** button and commit your changes.

Example: Deployment order set to **"90"**.

{{< img outdated="true" src="../img/ear-deploymentorder.png" title="Deployment Order" >}}

# Optional Components

This section describes how to install optional components onto an Oracle WebLogic server. None of these are required to work with the core platform.

## Cockpit, Tasklist and Admin

The web application archive that contains Fluxnova Cockpit and Tasklist resides under `webapps/fluxnova-webapp-ee-wls-$PLATFORM_VERSION.war` in the Oracle WebLogic Application Server distribution archive.

In this section we explain how to install the WAR file using the WebLogic Remote Console:

1. Open the WebLogic Remote Console.
2. Switch to **"Edit Tree"**.
3. Navigate to the **Deployments / App Deployments** screen.
4. Click the **"New"** button.
5. Fill in `fluxnova-webapp` in **"Name"** field.
6. Select available target.
7. Use upload icon in right corner of **"Source"** field to select the `fluxnova-webapp-wls-$PLATFORM_VERSION.war` from the modules folder of Fluxnova for Oracle WebLogic Application Server distribution.
8. (optional) If you want to start your application after deployment select **"Start Application"** option in **"On Deployment"** field.
9. Click **"Create"** button.
10. Press **"Shopping Card"** button and commit your changes.

After completing the wizard, the Cockpit and Tasklist should be accessible on the default context path **/fluxnova**.
In some situations, you also have to start the web application manually:

1. Open the WebLogic Remote Console.
2. Switch to **"Monitoring Tree"**.
3. Navigate to the **Deployments / Application Management** screen.
4. Select checkbox in row with **"fluxnova-webapp"**.
5. Click **"Start"** button.
{{< img outdated="true" src="../img/web-app-start-manually.png" title="Start Web-Application Manualy" >}}

You can check if everything went well by accessing Cockpit, Tasklist and Admin via `/fluxnova/app/cockpit`, `/fluxnova/app/tasklist` and `/fluxnova/app/admin` or under the context path you configured.


## REST API

The Fluxnova REST API WAR file resides under `webapps/fluxnova-engine-rest-$PLATFORM_VERSION-wls.war` in the Oracle WebLogic Application Server distribution archive.

In this section we explain how to install the WAR file using the WebLogic Remote Console:

1. Open the WebLogic Remote Console.
2. Switch to **"Edit Tree"**.
3. Navigate to the **Deployments / App Deployments** screen.
4. Click the **"New"** button.
5. Fill in `fluxnova-rest` in **"Name"** field.
6. Select available target.
7. Use upload icon in right corner of **"Source"** field to select the `fluxnova-engine-rest-$PLATFORM_VERSION-wls.war` from the modules folder of Fluxnova for Oracle WebLogic Application Server distribution.
8. (optional) If you want to start your application after deployment select **"Start Application"** option in **"On Deployment"** field.
9. Click **"Create"** button.
10. Press **"Shopping Card"** button and commit your changes.

After completing the wizard, the REST API should be successfully installed on the application server.
The context root for the REST API is **/engine-rest** by default.
In some situations, you also have to start the web application manually from the **Monitoring Tree** **Deployments / Application Management** screen.
