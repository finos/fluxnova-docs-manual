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

console.log('[INIT] Project Initializer Script Loaded');

const BPMN_TEMPLATES = {
    'generic': genericBpmn,
    'leave-approval': leaveBpmn,
    'invoice-approval': invoiceBpmn,
    'employee-onboarding': onboardingBpmn
};
const previewSection = document.getElementById('previewSection');

console.log('[INIT] BPMN Templates Registered:', Object.keys(BPMN_TEMPLATES));

// DOM Node Selectors
const form = document.getElementById('initializerForm');
const projectNameInput = document.getElementById('projectName');
const groupIdInput = document.getElementById('groupId');
const artifactIdInput = document.getElementById('artifactId');
const javaPackageInput = document.getElementById('javaPackage');
const submitBtn = document.getElementById('submitBtn');
const globalError = document.getElementById('globalError');

console.log('[INIT] DOM Elements Resolved');

/**
 * Recalculates and displays the derived Java package name
 */
function updateDerivedFields() {
    console.log('[PACKAGE] Recalculating derived fields...');

    const groupId = groupIdInput.value;
    const artifactId = artifactIdInput.value;

    const cleanArtifactPart = artifactId.replace(/-/g, '').toLowerCase();
    const packageName = `${groupId}.${cleanArtifactPart}`;

    javaPackageInput.value = packageName;

    console.log('[PACKAGE] Updated:', {
        groupId,
        artifactId,
        cleanArtifactPart,
        packageName
    });
}

// Event Listeners

projectNameInput.addEventListener('input', (e) => {
    console.log('[INPUT] Project Name Changed:', e.target.value);

    const artifactSlug = e.target.value
        .toLowerCase()
        .replace(/\s+/g, '-');

    artifactIdInput.value = artifactSlug;

    console.log('[INPUT] Auto-generated ArtifactId:', artifactSlug);

    updateDerivedFields();
renderPreview();
});

groupIdInput.addEventListener('input', () => {
    console.log('[INPUT] GroupId Changed:', groupIdInput.value);
    updateDerivedFields();
    renderPreview();
});

artifactIdInput.addEventListener('input', () => {
    console.log('[INPUT] ArtifactId Changed:', artifactIdInput.value);
    updateDerivedFields();
    renderPreview();
});

// Initial calculation
console.log('[INIT] Executing Initial Package Calculation');
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

    console.log('====================================');
    console.log('[SUBMIT] FORM SUBMIT DETECTED');
    console.log('====================================');

    e.preventDefault();

    globalError.textContent = '';

    console.log('[SUBMIT] Clearing previous errors');

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

    console.log('[VALIDATION] Validation Passed');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Generating...';

    console.log('[UI] Generate Button Disabled');

    try {

        console.log('[GENERATION] Starting Project Build');

        await generateProjectInBrowser(config);

        console.log('[GENERATION] Project Build Finished Successfully');

    } catch (err) {

        console.error('[GENERATION] Build Failed');
        console.error(err);

        globalError.textContent =
            'Failed to generate project archive.';

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = 'Generate Project';

        console.log('[UI] Generate Button Restored');
    }
});

/**
 * Browser Compilation Logic
 */
async function generateProjectInBrowser(config) {

    console.log('====================================');
    console.log('[GENERATOR] PROJECT GENERATION START');
    console.log('====================================');

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

    console.log('[GENERATOR] Derived Values:', {
        packageName,
        packagePath,
        mainClassName,
        delegateClassName,
        processId
    });

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

    console.log('[GENERATOR] Enriched Config Created');

    const zip = new JSZip();

    console.log('[ZIP] JSZip instance created');

    const root = `${artifactId}/`;

    console.log('[ZIP] Root Folder:', root);

    console.log('[ZIP] Adding pom.xml');
    zip.file(
        `${root}pom.xml`,
        mustache.render(pomTemplate, enrichedConfig)
    );

    console.log('[ZIP] Adding application.yml');
    zip.file(
        `${root}src/main/resources/application.yml`,
        mustache.render(appYmlTemplate, enrichedConfig)
    );

    const selectedBpmnContent =
        BPMN_TEMPLATES[bpmnTemplate] || genericBpmn;

    console.log('[ZIP] Selected BPMN Template:', bpmnTemplate);

    zip.file(
        `${root}src/main/resources/processes/${processId}.bpmn`,
        mustache.render(selectedBpmnContent, enrichedConfig)
    );

    console.log('[ZIP] BPMN File Added:', `${processId}.bpmn`);

    const javaSrcDir =
        `${root}src/main/java/${packagePath}`;

    console.log('[ZIP] Java Source Directory:', javaSrcDir);

    zip.file(
        `${javaSrcDir}/${mainClassName}.java`,
        mustache.render(javaTemplate, enrichedConfig)
    );

    console.log('[ZIP] Added Main Application Class');

    zip.file(
        `${javaSrcDir}/delegate/${delegateClassName}.java`,
        mustache.render(sampleDelegateTemplate, enrichedConfig)
    );

    console.log('[ZIP] Added Sample Delegate');

    

    const javaTestDir =
        `${root}src/test/java/${packagePath}`;

    zip.file(
        `${javaTestDir}/${mainClassName}Tests.java`,
        mustache.render(testTemplate, enrichedConfig)
    );

    console.log('[ZIP] Added Test Class');

    if (features.docker) {

        console.log('[ZIP] Docker Enabled');

        zip.file(
            `${root}Dockerfile`,
            mustache.render(dockerfileTemplate, enrichedConfig)
        );
    }

    

    zip.file(
        `${root}README.md`,
        mustache.render(readmeTemplate, enrichedConfig)
    );

    console.log('[ZIP] README.md Added');

    zip.file(
        `${root}.gitignore`,
        mustache.render(gitignoreTemplate, enrichedConfig)
    );

    console.log('[ZIP] .gitignore Added');

    console.log('[ZIP] Starting ZIP Blob Generation');

    const content = await zip.generateAsync({
        type: 'blob'
    });

    console.log('[ZIP] ZIP Blob Generated Successfully');
    console.log('[ZIP] Blob Size:', content.size, 'bytes');

    const link = document.createElement('a');

    console.log('[DOWNLOAD] Anchor Element Created');

    link.href = URL.createObjectURL(content);

    console.log('[DOWNLOAD] Object URL Created');
    console.log('[DOWNLOAD] URL:', link.href);

    link.download = `${artifactId}.zip`;

    console.log('[DOWNLOAD] Download Filename:', link.download);

    document.body.appendChild(link);

    console.log('[DOWNLOAD] Anchor Attached To DOM');

    console.log('====================================');
    console.log('[DOWNLOAD] TRIGGERING DOWNLOAD NOW');
    console.log('====================================');

    link.click();

    console.log('[DOWNLOAD] link.click() Executed');

    document.body.removeChild(link);

    console.log('[DOWNLOAD] Anchor Removed From DOM');

    console.log('====================================');
    console.log('[GENERATOR] PROJECT GENERATION COMPLETE');
    console.log('====================================');
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

    if (config.features.docker) {
        tree.children.splice(
            tree.children.length - 2,
            0,
            {
                name: 'Dockerfile'
            }
        );
    }

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

projectNameInput.addEventListener('input', (e) => {

    artifactIdInput.value =
        e.target.value
            .toLowerCase()
            .replace(/\s+/g, '-');

    handleFormChange();
});

groupIdInput.addEventListener(
    'input',
    handleFormChange
);

artifactIdInput.addEventListener(
    'input',
    handleFormChange
);

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