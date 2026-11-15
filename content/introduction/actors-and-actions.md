---

title: 'Actors and Actions'
weight: 35

menu:
  main:
    identifier: "user-guide-introduction-actors-and-actions"
    parent: "user-guide-introduction"

---


This page lists the actors in a Fluxnova system and the actions each of them can take. An actor is a person, subsystem or external system that can influence another part of the system. The page covers every Fluxnova component.

For engine internals and deployment scenarios see the [Architecture Overview]({{< relref "/introduction/architecture.md" >}}). For the supported external interfaces see [Public API]({{< relref "/introduction/public-api.md" >}}) and the [REST API reference]({{< relref "/reference/rest/_index.md" >}}). For hardening guidance see the [Security Instructions]({{< relref "/user-guide/security.md" >}}).


# Components in Scope

<table class="table table-striped">
  <tr>
    <th>Component</th>
    <th>Repository</th>
    <th>Distribution</th>
    <th>Release history</th>
  </tr>
  <tr>
    <td>Process engine, REST API, web applications, engine plugins (Connect, Spin, LDAP identity)</td>
    <td><a href="https://github.com/finos/fluxnova-bpm-platform">fluxnova-bpm-platform</a></td>
    <td>Maven Central (<code>org.finos.fluxnova.bpm</code>), Docker Hub <code>finos/fluxnova-bpm-platform</code></td>
    <td><a href="https://github.com/finos/fluxnova-bpm-platform/releases">Releases</a></td>
  </tr>
  <tr>
    <td>Control Center</td>
    <td><a href="https://github.com/finos/fluxnova-control-center">fluxnova-control-center</a></td>
    <td>Docker Hub <code>finos/fluxnova-control-center</code></td>
    <td><a href="https://github.com/finos/fluxnova-control-center/releases">Releases</a></td>
  </tr>
  <tr>
    <td>Modeler</td>
    <td><a href="https://github.com/finos/fluxnova-modeler">fluxnova-modeler</a></td>
    <td>Desktop installers on GitHub Releases</td>
    <td><a href="https://github.com/finos/fluxnova-modeler/releases">Releases</a></td>
  </tr>
  <tr>
    <td>Modeler plugins: code editor, MCP start event</td>
    <td><a href="https://github.com/finos/fluxnova-modeler-plugins">fluxnova-modeler-plugins</a></td>
    <td>GitHub Releases</td>
    <td><a href="https://github.com/finos/fluxnova-modeler-plugins/releases">Releases</a></td>
  </tr>
  <tr>
    <td>Engine plugins: backward compatibility, MCP server, agentic subprocess</td>
    <td><a href="https://github.com/finos/fluxnova-plugins">fluxnova-plugins</a></td>
    <td>Maven Central</td>
    <td><a href="https://github.com/finos/fluxnova-plugins/tags">Tags</a></td>
  </tr>
  <tr>
    <td>FEEL engine</td>
    <td><a href="https://github.com/finos/fluxnova-feel-scala">fluxnova-feel-scala</a></td>
    <td>Maven Central (<code>org.finos.fluxnova.feel</code>)</td>
    <td><a href="https://github.com/finos/fluxnova-feel-scala/tags">Tags</a></td>
  </tr>
  <tr>
    <td>Testing framework</td>
    <td><a href="https://github.com/finos/fluxnova-testing-framework">fluxnova-testing-framework</a></td>
    <td>Maven Central (<code>org.finos.fluxnova.bpm.test</code>)</td>
    <td><a href="https://github.com/finos/fluxnova-testing-framework/tags">Tags</a></td>
  </tr>
</table>

The [fluxnova-deploy](https://github.com/finos/fluxnova-deploy) Helm charts are not a released product. Maintainers use them to run the public demo at [demo.fluxnova.finos.org](https://demo.fluxnova.finos.org/).


# Interaction Diagram

The diagram shows the main actors, the components they use and the interfaces between them. Each grouping box is a separate trust boundary (see [Trust Boundaries](#trust-boundaries)). Arrow labels name the interface used, and dotted arrows are authentication flows. The *engine host* is the embedding application, Fluxnova Run or a Spring Boot application. *Engine plugins* also include the backward compatibility plugin. The build and release pipeline is not shown; see [External Actors](#external-actors).

{{< img src="../img/actors-and-actions.svg" title="Actors and Actions" >}}


# Human Actors

<table class="table table-striped">
  <tr>
    <th>Actor</th>
    <th>What they do</th>
    <th>Main tools</th>
  </tr>
  <tr>
    <td><strong>Process designer</strong></td>
    <td>Models BPMN processes, DMN decisions and forms. Configures technical properties such as scripts, element templates, MCP and agent extension attributes. Deploys models to an engine for testing.</td>
    <td><a href="{{< relref "/modeler/_index.md" >}}">Modeler</a>, Modeler plugins</td>
  </tr>
  <tr>
    <td><strong>Developer</strong></td>
    <td>Embeds the engine in an application or builds a process application. Writes delegate code, scripts, external task workers and tests. Configures engine plugins such as MCP, agentic or LDAP.</td>
    <td><a href="{{< relref "/user-guide/process-engine/process-engine-api.md" >}}">Java API</a>, <a href="{{< relref "/reference/rest/_index.md" >}}">REST API</a>, <a href="{{< relref "/user-guide/ext-client/_index.md" >}}">External task client</a>, <a href="{{< relref "/user-guide/testing/_index.md" >}}">Testing</a></td>
  </tr>
  <tr>
    <td><strong>Operator</strong></td>
    <td>Monitors process instances, incidents, jobs, batches and deployments. Repairs failed instances by retrying, modifying, migrating or suspending them.</td>
    <td><a href="{{< relref "/webapps/cockpit/_index.md" >}}">Cockpit</a>, <a href="{{< relref "/webapps/control-center/_index.md" >}}">Control Center</a></td>
  </tr>
  <tr>
    <td><strong>Administrator</strong></td>
    <td>Manages users, groups, tenants and authorizations. Configures authentication, the database, the identity provider and the deployment.</td>
    <td><a href="{{< relref "/webapps/admin/_index.md" >}}">Admin</a>, <a href="{{< relref "/user-guide/process-engine/authorization-service.md" >}}">Authorization Service</a>, <a href="{{< relref "/user-guide/process-engine/identity-service.md" >}}">Identity Service</a></td>
  </tr>
  <tr>
    <td><strong>Task user</strong></td>
    <td>Claims, works on and completes user tasks, and starts processes they are allowed to start.</td>
    <td><a href="{{< relref "/webapps/tasklist/_index.md" >}}">Tasklist</a></td>
  </tr>
  <tr>
    <td><strong>Maintainer / release manager</strong></td>
    <td>Merges changes and triggers release workflows that publish Fluxnova artifacts.</td>
    <td>GitHub, GitHub Actions</td>
  </tr>
</table>

One person can hold several of these roles. In the engine, roles are modelled as users, groups and [authorizations]({{< relref "/user-guide/process-engine/authorization-service.md" >}}), not as fixed role names. The `fluxnova-admin` group is the built-in [administrator group]({{< relref "/user-guide/process-engine/authorization-service.md#administrators" >}}).


# System Actors

## Fluxnova Components

**Process engine** ([fluxnova-bpm-platform](https://github.com/finos/fluxnova-bpm-platform)). A Java library that executes BPMN 2.0 processes, CMMN 1.1 cases and DMN 1.3 decisions, and stores all state in a relational database. Other components act on it through the [Java API]({{< relref "/user-guide/process-engine/process-engine-api.md" >}}) (in the same JVM) or through the REST API. The engine runs code that comes with deployments, such as [scripts]({{< relref "/user-guide/process-engine/scripting.md" >}}), expressions and [delegate code]({{< relref "/user-guide/process-engine/delegation-code.md" >}}). Anyone who can deploy can therefore run code on the engine host (see [Deployments]({{< relref "/user-guide/security.md#deployments" >}})). The engine checks [authorizations]({{< relref "/user-guide/process-engine/authorization-service.md" >}}) for the authenticated user when authorization is enabled. The engine also runs the DMN engine, which uses the FEEL engine.

**Job executor** (part of the engine). A background thread pool that acquires and runs [jobs]({{< relref "/user-guide/process-engine/the-job-executor.md" >}}): timers, asynchronous continuations and batch jobs. It acts on the engine without a user request, using the same database. The agentic subprocess plugins also run their LLM turns as jobs.

**REST API** ([fluxnova-bpm-platform/engine-rest](https://github.com/finos/fluxnova-bpm-platform/tree/main/engine-rest)). The HTTP interface to the engine, documented in the [REST API reference]({{< relref "/reference/rest/_index.md" >}}) and part of the [public API]({{< relref "/introduction/public-api.md" >}}). Authentication is off by default. HTTP Basic authentication against the engine identity service can be enabled ([Configure Authentication]({{< relref "/reference/rest/overview/authentication.md" >}})). As of release 3.1.1, the Spring Boot REST starter and Fluxnova Run can also validate JWT bearer tokens (issuer, audience, signature through a JWKS URL).

**Web applications** ([fluxnova-bpm-platform/webapps](https://github.com/finos/fluxnova-bpm-platform/tree/main/webapps)). [Cockpit]({{< relref "/webapps/cockpit/_index.md" >}}) (titled *Fluxnova Monitoring* in the 3.x UI), [Tasklist]({{< relref "/webapps/tasklist/_index.md" >}}), [Admin]({{< relref "/webapps/admin/_index.md" >}}) and the Welcome page. They run in the same server as the engine and are served together with an internal back-end API. Users log in with a session against the engine identity service, which uses the database or LDAP ([Authentication in the Web Applications]({{< relref "/user-guide/security.md#authentication-in-the-web-applications" >}})). The web apps' internal API is not part of the public API.

**Engine plugins in the platform** ([fluxnova-bpm-platform/engine-plugins](https://github.com/finos/fluxnova-bpm-platform/tree/main/engine-plugins)). [Process engine plugins]({{< relref "/user-guide/process-engine/process-engine-plugins.md" >}}) that change engine behaviour when configured. *Connect* lets processes call [external HTTP and SOAP services]({{< relref "/user-guide/process-engine/connectors.md" >}}). *Spin* handles JSON and XML data formats ([Spin reference]({{< relref "/reference/spin/_index.md" >}})). *LDAP identity* makes the engine read users and groups from an [LDAP directory]({{< relref "/user-guide/process-engine/identity-service.md" >}}).

**Control Center** ([fluxnova-control-center](https://github.com/finos/fluxnova-control-center)). A [web application]({{< relref "/webapps/control-center/_index.md" >}}) for monitoring and operations. It has an Angular single-page app and a NestJS *backend for frontend* (BFF). The BFF serves the UI, holds the user session, applies CSRF protection and forwards requests to the engine REST API at `FXN_REST_API_URL`. UI login is either off or uses OpenID Connect against an external identity provider. Calls from the BFF to the REST API can carry a client-credentials token from an API gateway (`FXN_API_AUTH_*`). When OIDC is used, the BFF also forwards the user's token in a separate header (`x-fxn-identity-token`). In multi-engine setups it picks the target engine with the `x-fxn-engine` header, which is read by the REST API's `EngineRoutingFilter`. It checks what the user may do by calling the REST authorization check. It can optionally export OpenTelemetry data. Details: Control Center [authentication](https://github.com/finos/fluxnova-control-center/blob/develop/docs/reference/authentication.md), [configuration](https://github.com/finos/fluxnova-control-center/blob/develop/docs/reference/configuration.md) and [tech stack](https://github.com/finos/fluxnova-control-center/blob/develop/docs/reference/tech-stack.md).

**Modeler** ([fluxnova-modeler](https://github.com/finos/fluxnova-modeler)). An Electron desktop application ([install]({{< relref "/installation/fluxnova-modeler.md" >}}), [user guide]({{< relref "/modeler/_index.md" >}})) for editing BPMN, DMN and form files on the local file system. It deploys models and starts process instances through the engine REST API (`/deployment/create`, `/process-definition/{id}/start`), using no authentication, Basic, a bearer token or OIDC. At startup it loads Modeler plugins from the `resources/plugins` folders of the installation and of the user data directory. Plugins run inside the Modeler with the same privileges as the Modeler itself.

**Modeler plugins** ([fluxnova-modeler-plugins](https://github.com/finos/fluxnova-modeler-plugins)). Add-ons the designer installs into the Modeler ([installation guide](https://github.com/finos/fluxnova-modeler-plugins/blob/main/docs/installing-plugins.md)). The *code-editor-plugin* adds a code editor with syntax highlighting, linting and autocompletion for inline scripts. The *mcp-start-event-plugin* adds a palette entry for MCP tool start events. Plugins only change what the designer edits. They do not talk to the engine themselves.

**Backward compatibility plugin** ([fluxnova-plugins/fluxnova-backward-compatibility-plugin](https://github.com/finos/fluxnova-plugins/tree/main/fluxnova-backward-compatibility-plugin)). An engine plugin that registers script preprocessors. It rewrites Camunda package and class references in scripts to their Fluxnova equivalents before they run. If anything goes wrong it returns the original script unchanged. ([README](https://github.com/finos/fluxnova-plugins/blob/main/fluxnova-backward-compatibility-plugin/README.md))

**MCP server plugin** ([fluxnova-plugins/agentic](https://github.com/finos/fluxnova-plugins/tree/main/agentic)). Two engine plugins that run in the engine host. `mcp-server-plugin` runs a Spring AI MCP server and provides a `ToolRegistry` for other plugins. `mcp-process-start-event` scans deployed BPMN for start events with `mcp:` attributes and registers each one as an MCP tool. When an MCP client calls a tool, the plugin starts the process through the engine Java API (`RuntimeService`) with the tool arguments as variables, and returns the process instance ID and the declared return variables. The transport (for example streamable HTTP or stdio) is set with standard Spring AI properties. The plugin code does not add authentication of its own, and it does not set an authenticated engine user before starting the process. This interface is documented in the [MCP server plugin README](https://github.com/finos/fluxnova-plugins/blob/main/agentic/mcp-server-plugin/README.md) and the [agentic README](https://github.com/finos/fluxnova-plugins/blob/main/agentic/README.md).

**Agentic subprocess plugins** ([fluxnova-plugins/agentic-subprocess](https://github.com/finos/fluxnova-plugins/tree/main/agentic-subprocess)). Engine plugins that let an LLM drive a BPMN [ad-hoc subprocess]({{< relref "/user-guide/process-engine/ad-hoc-subprocess.md" >}}). When the subprocess is entered, and each time a tool activity finishes, a job runs the next turn. The job sends the configured system prompt, the declared context variables and the catalogue of child activities to the LLM provider named in `agent:config`. It then starts the activities the model chose. Providers are Spring AI `ChatModel` beans configured in the host application, for example Ollama or OpenAI. Deployment fails if a BPMN file names a provider that is not configured. ([README](https://github.com/finos/fluxnova-plugins/blob/main/agentic-subprocess/README.md))

**FEEL engine** ([fluxnova-feel-scala](https://github.com/finos/fluxnova-feel-scala)). A Scala library that parses and evaluates FEEL expressions. The DMN engine uses it to evaluate decision tables and expressions ([FEEL Engine]({{< relref "/user-guide/dmn-engine/feel/_index.md" >}})). It has no network interface. It only evaluates expressions that come from deployed models, with the variables it is given.

**Testing framework** ([fluxnova-testing-framework](https://github.com/finos/fluxnova-testing-framework)). Maven libraries and an archetype for testing BPMN models and scripts. Tests deploy models into an in-memory engine and produce process and script coverage reports. It runs only in the developer's build or CI, never in a production engine. ([README](https://github.com/finos/fluxnova-testing-framework/blob/main/README.md))

**Demo deployment** ([fluxnova-deploy](https://github.com/finos/fluxnova-deploy)). Helm charts that maintainers use to run the public demo at [demo.fluxnova.finos.org](https://demo.fluxnova.finos.org/). They deploy an engine image with a PostgreSQL database (credentials taken from a Kubernetes secret) and the Control Center image, both behind an nginx ingress with TLS from cert-manager. GitHub Actions workflows in the repository deploy them to an AWS EKS cluster.

## External Actors

**Embedding application.** A Java application (plain Java, Spring, Spring Boot, Quarkus or Jakarta EE) that creates and owns the process engine. It has full access through the Java API, decides which plugins, REST API and web apps are enabled, and provides delegate code. Engine authorization checks only apply if it sets an authenticated user ([Embedded Process Engine]({{< relref "/introduction/architecture.md#embedded-process-engine" >}})).

**REST clients.** Any HTTP client, such as a custom application, Control Center, the Modeler or a script, that uses the REST API. What it can do depends on the authentication configured and on the authorizations of its user.

**External task workers.** Separate processes that fetch and lock [external tasks]({{< relref "/user-guide/process-engine/external-tasks.md" >}}) over REST, do the work outside the engine, and report completion, failure or BPMN errors. They usually use the [Java external task client]({{< relref "/user-guide/ext-client/_index.md" >}}).

**MCP clients.** AI assistants or agents, for example Claude Desktop, a custom LLM agent or MCP Inspector. They connect to the MCP server plugin, list the available tools and call them, which starts processes.

**LLM providers.** Model APIs (hosted or self-hosted) that the agentic subprocess plugins call through Spring AI. Their responses decide which BPMN activities run next.

**Identity providers.** Systems that authenticate users:
* the engine's own database-backed identity service, or an LDAP directory through the LDAP plugin, for REST Basic authentication and web app login;
* an OIDC provider for Control Center login and, optionally, for JWT validation in the REST API (through its JWKS URL);
* an OIDC provider used by the Modeler when a deployment endpoint is set to OIDC;
* an OAuth2 provider for applications that use the [Spring Security OAuth2 integration]({{< relref "/user-guide/spring-boot-integration/spring-security.md" >}}).

**Database.** The relational database where the engine stores definitions, runtime state, history, users and authorizations ([Database]({{< relref "/user-guide/process-engine/database/_index.md" >}})). Anyone with direct write access to it can bypass all engine checks.

**External services.** Systems that processes call, through Connect connectors, delegate code, scripts or external task workers.

**Observability back end.** An optional OpenTelemetry collector that receives traces, metrics and logs from Control Center.

**CI and release pipeline.** GitHub Actions workflows in each repository build and test changes. Release workflows, triggered by maintainers, publish signed Maven artifacts to Maven Central, Docker images to Docker Hub (and GHCR for `main` builds), Modeler installers and plugin bundles to GitHub Releases, and Javadoc and OpenAPI files to GitHub Pages. Users then pull these artifacts into their own deployments.


# Actions

<table class="table table-striped">
  <tr>
    <th>Actor</th>
    <th>Action</th>
    <th>Component</th>
    <th>Interface</th>
    <th>Details</th>
  </tr>
  <tr>
    <td><strong>Process designer</strong></td>
    <td>Create and edit BPMN, DMN and form models, including scripts, MCP and agent attributes</td>
    <td>Modeler, Modeler plugins</td>
    <td>Desktop UI, local files</td>
    <td><a href="{{< relref "/modeler/_index.md" >}}">Modeler</a></td>
  </tr>
  <tr>
    <td><strong>Process designer, developer</strong></td>
    <td>Deploy models and start process instances</td>
    <td>Engine</td>
    <td>REST (<code>/deployment/create</code>, <code>/process-definition/{id}/start</code>) from the Modeler or other clients</td>
    <td><a href="{{< relref "/reference/rest/_index.md" >}}">REST API</a>, <a href="{{< relref "/user-guide/process-engine/deployments.md" >}}">Deployments</a></td>
  </tr>
  <tr>
    <td><strong>Developer, embedding application</strong></td>
    <td>Embed and configure the engine, register plugins, run all engine services</td>
    <td>Engine</td>
    <td>Java API, configuration</td>
    <td><a href="{{< relref "/introduction/public-api.md" >}}">Public API</a>, <a href="{{< relref "/user-guide/process-engine/process-engine-bootstrapping.md" >}}">Bootstrapping</a>, <a href="{{< relref "/user-guide/process-engine/process-engine-plugins.md" >}}">Engine plugins</a></td>
  </tr>
  <tr>
    <td><strong>Developer</strong></td>
    <td>Provide code that the engine runs (delegates, listeners, scripts, expressions)</td>
    <td>Engine</td>
    <td>Java SPI, deployment resources</td>
    <td><a href="{{< relref "/user-guide/process-engine/delegation-code.md" >}}">Delegation Code</a>, <a href="{{< relref "/user-guide/process-engine/securing-custom-code.md" >}}">Securing Custom Code</a></td>
  </tr>
  <tr>
    <td><strong>Developer</strong></td>
    <td>Test models and scripts against an in-memory engine</td>
    <td>Testing framework</td>
    <td>Maven, JUnit</td>
    <td><a href="{{< relref "/user-guide/testing/_index.md" >}}">Testing</a>, <a href="https://github.com/finos/fluxnova-testing-framework/blob/main/README.md">framework README</a></td>
  </tr>
  <tr>
    <td><strong>Operator</strong></td>
    <td>Search instances, incidents, jobs, batches and deployments; retry, modify, migrate, suspend or delete them</td>
    <td>Engine</td>
    <td>Cockpit UI or Control Center UI, which call REST</td>
    <td><a href="{{< relref "/webapps/cockpit/_index.md" >}}">Cockpit</a>, <a href="{{< relref "/webapps/control-center/_index.md" >}}">Control Center</a></td>
  </tr>
  <tr>
    <td><strong>Administrator</strong></td>
    <td>Manage users, groups, tenants and authorizations</td>
    <td>Engine identity and authorization services</td>
    <td>Admin UI, REST, Java API</td>
    <td><a href="{{< relref "/user-guide/process-engine/authorization-service.md" >}}">Authorization Service</a>, <a href="{{< relref "/webapps/admin/_index.md" >}}">Admin</a></td>
  </tr>
  <tr>
    <td><strong>Administrator</strong></td>
    <td>Configure authentication, TLS, database, LDAP or OIDC, and deployment</td>
    <td>Engine host, Control Center</td>
    <td>Configuration files, environment variables</td>
    <td><a href="{{< relref "/user-guide/security.md" >}}">Security Instructions</a>, <a href="{{< relref "/user-guide/process-engine/multi-tenancy.md" >}}">Multi-Tenancy</a></td>
  </tr>
  <tr>
    <td><strong>Task user</strong></td>
    <td>List, claim, complete and delegate tasks; start processes</td>
    <td>Engine</td>
    <td>Tasklist UI, REST</td>
    <td><a href="{{< relref "/webapps/tasklist/_index.md" >}}">Tasklist</a></td>
  </tr>
  <tr>
    <td><strong>REST client</strong></td>
    <td>Any operation in the REST reference, limited by authentication and authorizations</td>
    <td>Engine</td>
    <td>REST (Basic, JWT or none)</td>
    <td><a href="{{< relref "/reference/rest/_index.md" >}}">REST API</a>, <a href="{{< relref "/reference/rest/overview/authentication.md" >}}">Configure Authentication</a></td>
  </tr>
  <tr>
    <td><strong>Control Center BFF</strong></td>
    <td>Forward UI requests, check user authorizations, select engine and tenant</td>
    <td>Engine</td>
    <td>REST, <code>x-fxn-engine</code> header</td>
    <td><a href="https://github.com/finos/fluxnova-control-center/blob/develop/docs/reference/authentication.md">Control Center authentication</a></td>
  </tr>
  <tr>
    <td><strong>External task worker</strong></td>
    <td>Fetch and lock, complete, fail or raise a BPMN error for external tasks</td>
    <td>Engine</td>
    <td>REST</td>
    <td><a href="{{< relref "/user-guide/process-engine/external-tasks.md" >}}">External Tasks</a>, <a href="{{< relref "/user-guide/ext-client/_index.md" >}}">External Task Client</a></td>
  </tr>
  <tr>
    <td><strong>Job executor</strong></td>
    <td>Run timers, asynchronous continuations, batch jobs and agentic turns</td>
    <td>Engine</td>
    <td>Internal (database job table)</td>
    <td><a href="{{< relref "/user-guide/process-engine/the-job-executor.md" >}}">The Job Executor</a></td>
  </tr>
  <tr>
    <td><strong>Engine (Connect, delegates, scripts)</strong></td>
    <td>Call external HTTP or SOAP services</td>
    <td>External services</td>
    <td>HTTP or SOAP</td>
    <td><a href="{{< relref "/user-guide/process-engine/connectors.md" >}}">Connectors</a></td>
  </tr>
  <tr>
    <td><strong>Engine</strong></td>
    <td>Read and write all process state</td>
    <td>Database</td>
    <td>JDBC</td>
    <td><a href="{{< relref "/user-guide/process-engine/database/_index.md" >}}">Database</a></td>
  </tr>
  <tr>
    <td><strong>Engine (LDAP plugin), REST API (JWT)</strong></td>
    <td>Look up users and groups, validate tokens</td>
    <td>Identity provider</td>
    <td>LDAP, HTTPS (JWKS)</td>
    <td><a href="{{< relref "/user-guide/process-engine/identity-service.md" >}}">Identity Service</a></td>
  </tr>
  <tr>
    <td><strong>MCP client</strong></td>
    <td>List tools; call a tool, which starts a process and returns the declared variables</td>
    <td>MCP server plugin, Engine</td>
    <td>MCP (Spring AI transport)</td>
    <td><a href="https://github.com/finos/fluxnova-plugins/blob/main/agentic/mcp-server-plugin/README.md">MCP server plugin README</a></td>
  </tr>
  <tr>
    <td><strong>Agentic subprocess plugins</strong></td>
    <td>Send prompt, context and tool catalogue to an LLM; start the activities it selects</td>
    <td>LLM provider, Engine</td>
    <td>Spring AI <code>ChatModel</code>, Java API</td>
    <td><a href="https://github.com/finos/fluxnova-plugins/blob/main/agentic-subprocess/README.md">agentic-subprocess README</a></td>
  </tr>
  <tr>
    <td><strong>DMN engine</strong></td>
    <td>Evaluate FEEL expressions</td>
    <td>FEEL engine</td>
    <td>Java/Scala library call</td>
    <td><a href="{{< relref "/user-guide/dmn-engine/feel/_index.md" >}}">FEEL Engine</a></td>
  </tr>
  <tr>
    <td><strong>Backward compatibility plugin</strong></td>
    <td>Rewrite Camunda references in scripts before they run</td>
    <td>Engine scripting</td>
    <td>Script preprocessor SPI</td>
    <td><a href="https://github.com/finos/fluxnova-plugins/blob/main/fluxnova-backward-compatibility-plugin/README.md">README</a></td>
  </tr>
  <tr>
    <td><strong>Maintainer, CI and release pipeline</strong></td>
    <td>Build, test, sign and publish artifacts</td>
    <td>All repositories</td>
    <td>GitHub Actions, Maven Central, Docker Hub, GitHub Releases</td>
    <td><a href="{{< relref "/security/_index.md" >}}">Security Guide</a></td>
  </tr>
  <tr>
    <td><strong>Maintainer, CI</strong></td>
    <td>Deploy or upgrade the public demo</td>
    <td>Demo deployment</td>
    <td>GitHub Actions, Helm, kubectl</td>
    <td><a href="https://github.com/finos/fluxnova-deploy">fluxnova-deploy</a></td>
  </tr>
</table>


# Trust Boundaries

* **Browser to server.** The web apps and Control Center UIs run in the user's browser. The server side (the web app back end or the Control Center BFF) holds the session and enforces authentication.
* **Client to REST API.** Everything that is not in the engine's JVM reaches the engine through the REST API, or through the MCP endpoint when that plugin is installed. REST authentication is off by default and must be enabled in production ([Security Instructions]({{< relref "/user-guide/security.md#enabling-authentication-for-the-rest-api" >}})).
* **In-process code.** The embedding application, engine plugins, delegate code and deployed scripts all run inside the engine JVM with full engine access. Engine authorization checks do not restrict them.
* **Engine to external systems.** The database, identity providers, LLM providers and external services are outside the Fluxnova code base. The operator is responsible for securing them.
* **Supply chain.** Users trust artifacts published by the release pipeline. See the [Security Guide]({{< relref "/security/_index.md" >}}) for the security policy and how to report vulnerabilities.
