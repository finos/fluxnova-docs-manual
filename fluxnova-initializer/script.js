import JSZip from 'jszip';
import mustache from 'mustache';

// 1. Asset Text Bundles (Injected as raw strings by Vite at compile time)
import pomTemplate from './templates/pom.xml.mustache?raw';
import appYmlTemplate from './templates/application.yml.mustache?raw';
import javaTemplate from './templates/WorkflowApplication.java.mustache?raw';
import sampleDelegateTemplate from './templates/SampleDelegate.java.mustache?raw';
import testTemplate from './templates/WorkflowApplicationTests.java.mustache?raw';
import dockerfileTemplate from './templates/Dockerfile.mustache?raw';
import readmeTemplate from './templates/README.md.mustache?raw';
import gitignoreTemplate from './templates/gitignore.mustache?raw';

import genericBpmn from './templates/bpmn/generic.bpmn.mustache?raw';
import leaveBpmn from './templates/bpmn/leave-approval.bpmn.mustache?raw';
import invoiceBpmn from './templates/bpmn/invoice-approval.bpmn.mustache?raw';
import onboardingBpmn from './templates/bpmn/employee-onboarding.bpmn.mustache?raw';

const BPMN_TEMPLATES = {
    'generic': genericBpmn,
    'leave-approval': leaveBpmn,
    'invoice-approval': invoiceBpmn,
    'employee-onboarding': onboardingBpmn
};
const previewSection = document.getElementById('previewSection');

// DOM Node Selectors
const form = document.getElementById('initializerForm');
const projectNameInput = document.getElementById('projectName');
const groupIdInput = document.getElementById('groupId');
const artifactIdInput = document.getElementById('artifactId');
const javaPackageInput = document.getElementById('javaPackage');
const submitBtn = document.getElementById('submitBtn');
const globalError = document.getElementById('globalError');

/**
 * Recalculates and displays the derived Java package name
 */
function updateDerivedFields() {
    const groupId = groupIdInput.value;
    const artifactId = artifactIdInput.value;

    const cleanArtifactPart = artifactId.replace(/-/g, '').toLowerCase();
    const packageName = `${groupId}.${cleanArtifactPart}`;

    javaPackageInput.value = packageName;

}

// Event Listeners

// Initial calculation
updateDerivedFields();
renderPreview();

/**
 * Form Submission
 */
const fluxnovaVersionSelect = document.getElementById('fluxnovaVersion');
const springBootVersionInput = document.getElementById('springBootVersion');

const versionMap = {
    "2.0.0": "3.4.4",
    "3.0.0": "4.0.5"
};

fluxnovaVersionSelect.addEventListener('change', () => {
    springBootVersionInput.value =
        versionMap[fluxnovaVersionSelect.value];
});

// Set initial value on page load
springBootVersionInput.value =
    versionMap[fluxnovaVersionSelect.value];
form.addEventListener('submit', async (e) => {

    e.preventDefault();

    globalError.textContent = '';

    document.querySelectorAll('.error')
        .forEach(el => el.style.display = 'none');

    const springBootVersionMap = {
    "2.0.0": "3.4.4",
    "3.0.0": "4.0.5"
};

const fluxnovaVersion = document.getElementById('fluxnovaVersion').value;



    const config = {
        projectName: projectNameInput.value.trim(),
        groupId: groupIdInput.value.trim(),
        artifactId: artifactIdInput.value.trim(),
        fluxnovaVersion: fluxnovaVersion,
        springBootVersion: springBootVersionMap[fluxnovaVersion],
        javaVersion: '21',
        buildTool: 'maven',
        database: document.querySelector('input[name="database"]:checked').value,
        adminUser: document.getElementById('adminUser').value.trim(),
        adminPassword: document.getElementById('adminPassword').value.trim(),
        bpmnTemplate: document.getElementById('bpmnTemplate').value,
        features: {
            cockpit: document.getElementById('feat-cockpit').checked,
            restApi: document.getElementById('feat-restApi').checked,
            docker: document.getElementById('feat-docker').checked,
            
        }
    };


    let hasErrors = false;

    ['projectName', 'groupId', 'artifactId', 'adminUser', 'adminPassword']
        .forEach(field => {

            if (!config[field]) {
                console.warn(`[VALIDATION] Missing Required Field: ${field}`);

                document.getElementById(`err-${field}`).style.display = 'inline';
                hasErrors = true;
            }
        });

    if (hasErrors) {
        console.error('[VALIDATION] Form Validation Failed');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Generating...';

    try {

        await generateProjectInBrowser(config);

    } catch (err) {

        console.error('[GENERATION] Build Failed');
        console.error(err);

        globalError.textContent =
            'Failed to generate project archive.';

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = 'Generate Project';

    }
});

/**
 * Browser Compilation Logic
 */
async function generateProjectInBrowser(config) {

    const { artifactId, features, database, bpmnTemplate } = config;

    const cleanArtifactPart =
        artifactId.replace(/-/g, '').toLowerCase();

    const packageName =
        `${config.groupId}.${cleanArtifactPart}`;

    const packagePath =
        packageName.replace(/\./g, '/');

    const pascalArtifact = artifactId
        .split('-')
        .map(word =>
            word.charAt(0).toUpperCase()
            + word.slice(1))
        .join('');

    const mainClassName =
        `${pascalArtifact}Application`;

    const delegateClassName =
        `SampleDelegate`;

    const processId =
        config.projectName
            .toLowerCase()
            .replace(/\s+/g, '-');

    const enrichedConfig = {
        ...config,
        packageName,
        packagePath,
        mainClassName,
        delegateClassName,
        processId,
        isH2: database === 'h2',
        isMysql: database === 'mysql',
        isPostgresql: database === 'postgresql',
        isSpring2: false
    };

    const zip = new JSZip();

    const root = `${artifactId}/`;
    zip.file(
        `${root}pom.xml`,
        mustache.render(pomTemplate, enrichedConfig)
    );

    zip.file(
        `${root}src/main/resources/application.yml`,
        mustache.render(appYmlTemplate, enrichedConfig)
    );

    const selectedBpmnContent =
        BPMN_TEMPLATES[bpmnTemplate] || genericBpmn;

    zip.file(
        `${root}src/main/resources/processes/${processId}.bpmn`,
        mustache.render(selectedBpmnContent, enrichedConfig)
    );

    const javaSrcDir =
        `${root}src/main/java/${packagePath}`;

    zip.file(
        `${javaSrcDir}/${mainClassName}.java`,
        mustache.render(javaTemplate, enrichedConfig)
    );

    zip.file(
        `${javaSrcDir}/delegate/${delegateClassName}.java`,
        mustache.render(sampleDelegateTemplate, enrichedConfig)
    );

    const javaTestDir =
        `${root}src/test/java/${packagePath}`;

    zip.file(
        `${javaTestDir}/${mainClassName}Tests.java`,
        mustache.render(testTemplate, enrichedConfig)
    );

    if (features.docker) {

        zip.file(
            `${root}Dockerfile`,
            mustache.render(dockerfileTemplate, enrichedConfig)
        );
    }

    zip.file(
        `${root}README.md`,
        mustache.render(readmeTemplate, enrichedConfig)
    );

    zip.file(
        `${root}.gitignore`,
        mustache.render(gitignoreTemplate, enrichedConfig)
    );

    const content = await zip.generateAsync({
        type: 'blob'
    });

    const link = document.createElement('a');

    link.href = URL.createObjectURL(content);

    link.download = `${artifactId}.zip`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}


function getCurrentConfig() {
    return {
        projectName: projectNameInput.value.trim(),
        groupId: groupIdInput.value.trim(),
        artifactId: artifactIdInput.value.trim(),
        bpmnTemplate: document.getElementById('bpmnTemplate').value,
        features: {
            docker: document.getElementById('feat-docker').checked
        }
    };
}

function buildFolderTree(config) {

    const cleanArtifactPart =
        config.artifactId.replace(/-/g, '').toLowerCase();

    const packageName =
        `${config.groupId}.${cleanArtifactPart}`;

    const packagePath =
        packageName.replace(/\./g, '/');

    const processId =
        config.projectName
            .toLowerCase()
            .replace(/\s+/g, '-');

    const rootName =
        config.artifactId || 'workflow-engine';

    const tree = {
    name: `${rootName}/`,
    children: [

        {
            name: 'pom.xml'
        },

        {
            name: 'README.md'
        },

        {
            name: '.gitignore'
        },

        ...(config.features.docker
            ? [{ name: 'Dockerfile' }]
            : []),

        {
            name: 'src/',
            children: [
                {
                    name: 'main/',
                    children: [
                        {
                            name: 'java/',
                            children: [
                                {
                                    name: `${packagePath}/`,
                                    children: [

                                        {
                                            name: `${config.artifactId
                                                .split('-')
                                                .map(word =>
                                                    word.charAt(0).toUpperCase() +
                                                    word.slice(1))
                                                .join('')}Application.java`
                                        },

                                        {
                                            name: 'delegate/',
                                            children: [
                                                {
                                                    name: 'SampleDelegate.java'
                                                }
                                            ]
                                        }

                                    ]
                                }
                            ]
                        },

                        {
                            name: 'resources/',
                            children: [
                                {
                                    name: 'application.yml'
                                },

                                {
                                    name: 'processes/',
                                    children: [
                                        {
                                            name: `${processId || 'process'}.bpmn`
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },

                {
                    name: 'test/',
                    children: [
                        {
                            name: 'java/',
                            children: [
                                {
                                    name: `${packagePath}/`,
                                    children: [
                                        {
                                            name: `${config.artifactId
                                                .split('-')
                                                .map(word =>
                                                    word.charAt(0).toUpperCase() +
                                                    word.slice(1))
                                                .join('')}ApplicationTests.java`
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

    return tree;
}

function generateTree(node, prefix = '', isLast = true) {

    let result =
        prefix +
        (prefix ? (isLast ? '└── ' : '├── ') : '') +
        node.name +
        '\n';

    if (node.children && node.children.length) {

        const childPrefix =
            prefix +
            (isLast ? '    ' : '│   ');

        node.children.forEach((child, index) => {
            result += generateTree(
                child,
                childPrefix,
                index === node.children.length - 1
            );
        });
    }

    return result;
}

function renderPreview() {

    const config = getCurrentConfig();

    const tree = buildFolderTree(config);

    const pre = document.createElement('pre');
    pre.className = 'folder-tree';
    pre.textContent = generateTree(tree);
    previewSection.replaceChildren(pre);
}

function handleFormChange() {
    updateDerivedFields();
    renderPreview();
}

projectNameInput.addEventListener('input', (event) => {
    artifactIdInput.value = event.target.value
        .toLowerCase()
        .replace(/\s+/g, '-');
    handleFormChange();
});

groupIdInput.addEventListener('input', handleFormChange);
artifactIdInput.addEventListener('input', handleFormChange);

document
    .getElementById('bpmnTemplate')
    .addEventListener(
        'change',
        renderPreview
    );

document
    .getElementById('feat-docker')
    .addEventListener(
        'change',
        renderPreview
    );