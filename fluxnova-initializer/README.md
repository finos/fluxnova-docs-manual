# Fluxnova Initializer

Fluxnova Initializer is a modern web-based project generator that creates fully configured **FluxNova Spring Boot Workflow Applications** with a single click.

Instead of manually creating project structures, configuring dependencies, setting up workflow templates, and preparing application configuration files, users can enter their project requirements through an intuitive interface and download a ready-to-run project as a ZIP archive.

---

## Features

- Generate complete Spring Boot workflow applications
- Support multiple Fluxnova framework versions
- Support for Java 17 and Java 21
- BPMN workflow template generation
- Database configuration support:
  - H2
  - MySQL
  - PostgreSQL
- Optional Web Application support
- Optional REST API support
- Optional Docker configuration
- Custom administrator credentials
- Live project structure preview
- Download generated projects as ZIP archives

---

## Prerequisites

Before building the application, ensure the following are installed:

- Node.js 24
- npm
- Hugo

Verify the installation:

```bash
node --version
npm --version
hugo version
```

---

## Building the Initializer

### 1. Navigate to the project directory

```bash
cd fluxnova-initializer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the application

```bash
npm run build
```

Wait for the build process to complete successfully.

### 4. Return to the repository root

```bash
cd ..
```

---

## Running the Documentation Site

Start the Hugo development server:

```bash
hugo server --baseURL="http://localhost"
```

After the server starts, open:

```text
http://localhost:1313
```

The site will automatically reload when changes are detected.

---

## Documentation

For additional setup instructions and project documentation, refer to the root repository documentation:

```text
../README.md
```

