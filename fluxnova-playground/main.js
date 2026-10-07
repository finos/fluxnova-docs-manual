
import CamundaBpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import lintModule from 'bpmn-js-bpmnlint';

import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';

import bpmnlintConfig from './bundled-config'
import propPanelExtensionModule from './features/properties-panel-extension';
import bpmnFormExtensionProviderModule from './features/properties-panel-form-group';


let xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:fluxnova="http://fluxnova.finos.org/schema/1.0/bpmn" xmlns:modeler="http://fluxnova.finos.org/schema/modeler/1.0" id="Definitions_0x56uyl" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Fluxnova Modeler" exporterVersion="1.2.0" modeler:executionPlatform="Fluxnova Platform" modeler:executionPlatformVersion="2.0.0">
  <bpmn:process id="Process_03m1par" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_03m1par">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="182" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;


let modeler;
async function renderModeler(){
    modeler = new CamundaBpmnModeler({
        container: '#canvas',
 
  propertiesPanel: {
    parent: '#properties'
  },
 
  additionalModules: [propPanelExtensionModule,
        bpmnFormExtensionProviderModule,
    lintModule
  ],
  
  moddleExtensions: {   
      camunda: camundaModdleDescriptor
    },

 
  linting: {
    bpmnlint: bpmnlintConfig
  }


});


 modeler.on('commandStack.changed', function () {
        hasRunExecuted = false;
    });

    await modeler.importXML(xml);
    
hasRunExecuted = false;

    modeler.get('canvas').zoom('fit-viewport');
    

    const commandStack = modeler.get('commandStack');

    document.addEventListener('keydown', (event) => {
        // Ctrl + Z → Undo
        if (event.ctrlKey && event.key === 'z') {
            event.preventDefault();
            commandStack.undo();
        }

        // Ctrl + Y → Redo
        if (event.ctrlKey && event.key === 'y') {
            event.preventDefault();
            commandStack.redo();
        }
    });


    listenToProblems();
}
renderModeler();

/* ==========================================================================
   Camunda Real-Time Problems Panel Listener Connected to Tab2
   ========================================================================== */
let hasLintingErrors = false;

function listenToProblems() {
 if (!modeler) return;

modeler.on('linting.completed', function (event) {

  const outputEl = document.getElementById('Tab2');

  if (!outputEl) return;

  outputEl.innerHTML = '';

  const issuesByElement = event.issues || {};

  const allIssues = [];

  Object.keys(issuesByElement).forEach((elementId) => {

    issuesByElement[elementId].forEach((issue) => {

      allIssues.push({
        id: elementId,
        category: issue.category,
        message: issue.message
      });

    });

  });

const errorCount = allIssues.filter(i => i.category === 'error').length;
  const warnCount = allIssues.filter(i => i.category === 'warn').length;

  hasLintingErrors = errorCount > 0; 


  if (allIssues.length === 0) {
    outputEl.innerHTML =
      '<div style="padding:10px;color:green;">No problems found.</div>';
    return;
  }

  allIssues.forEach((issue) => {

    const row = document.createElement('div');

    row.style.padding = '8px';
    row.style.cursor = 'pointer';
    row.style.borderBottom = '1px solid #ddd';
    row.style.fontSize = '15px';

    
    if (
      issue.category === 'error' 
    ) {
      row.style.color = '#b00020';
      row.style.backgroundColor = '#fdecea';
    } else if (issue.category === 'warn') {
      row.style.color = '#b26a00';
      row.style.backgroundColor = '#fff4e5';
    } else {
      row.style.color = '#333';
    }

    
    const safeMessage = issue.message
  .replace(/zeebe:/g, '')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

    
    row.innerHTML = `
      <strong>[${issue.category.toUpperCase()}]</strong> 
      ${issue.id} - ${safeMessage}
    `;

    row.addEventListener('click', () => {
      focusProblemElement(issue.id);
    });

    outputEl.appendChild(row);
    

  });

});};
function focusProblemElement(elementId) {
 
  if (!modeler) return;
 
  const elementRegistry = modeler.get('elementRegistry');
  const canvas = modeler.get('canvas');
  const selection = modeler.get('selection');
 
  const element = elementRegistry.get(elementId);
 
  if (!element) return;
 
  canvas.scrollToElement(element);
  selection.select(element);
};
 


window.initTabs = function () {
  document.addEventListener('click', function (event) {
    const button = event.target.closest('.tab-btn');
    if (!button) return;

    const container = button.closest('.tab-container');
    if (!container) return;

    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    container.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

   
    button.classList.add('active');

  
    const targetId = button.getAttribute('data-tab');
    const targetContent = container.querySelector(`#${targetId}`);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
};


window.initTabs();


window.clearDiagram = function () {
  if (!modeler) return;

  modeler.importXML(xml)
    .then(() => {
      modeler.get('canvas').zoom('fit-viewport');
    });
};
window.scrollToTab = function (div_id) {
  const tab = document.getElementById(div_id);
  if (tab) {
    tab.scrollIntoView({
      behavior: "smooth",   // smooth scroll
      block: "start"        // align to top
    });
  }
};
window.viewXml = function () {
  if (!modeler) return;

  modeler.saveXML({ format: true })
    .then(({ xml }) => {
      if (xml.includes('camunda:historyTimeToLive')) {
  // Replace existing value (e.g., 1 → 30)
  xml = xml.replace(
    /camunda:historyTimeToLive="[^"]*"/,
    'camunda:historyTimeToLive="1"'
  );
} else {
  // Add attribute to <bpmn:process>
  xml = xml.replace(
    '<bpmn:process id="',
    '<bpmn:process camunda:historyTimeToLive="1" id="'
  );
}
      const modal = document.getElementById("xmlModal");
      const textarea = document.getElementById("xmlContent");

      textarea.value = xml;
      modal.style.display = "flex";
    })
    .catch(err => {
      console.error("Error:", err);
    });
};
window.closeXmlModal = function () {
  document.getElementById("xmlModal").style.display = "none";
};

window.copyXml = function () {
  const textarea = document.getElementById("xmlContent");
  textarea.select();
  document.execCommand("copy");
  
};

window.uploadBpmn = function () {
  document.getElementById("fileInput").click();
};

window.handleFileUpload = function (event) {
  const file = event.target.files[0];

  if (!file || !modeler) {
    console.error("No file or modeler missing");
    return;
  }

  file.text()
    .then(xml => modeler.importXML(xml))
    .then(() => {
      modeler.get('canvas').zoom('fit-viewport');
    })
    .catch(() => {
      alert("Invalid BPMN/XML file");
    });

  event.target.value = ""; 
};
let temp;
window.downloadXml = function () {
  if (!modeler) {
    console.error("Modeler not initialized");
    return;
  }

  modeler.saveXML({ format: true })
    .then(({ xml }) => {
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.bpmn";

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error("Download failed:", err);
    });
};

let hasRunExecuted = false;

function showRunProgress(message) {
  const outputEl = document.getElementById("Tab1");
  if (!outputEl) return;

  outputEl.innerHTML = `
    <div class="run-progress" role="status" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true"></span>
      <span>${message}</span>
    </div>`;
}

window.runProcess = async function (fromuser={}) {
  
  if (!modeler) {
    return;
  }

hasRunExecuted = false;
document.getElementById("defaultOpen")?.click();
showRunProgress("Checking the process before deployment...");

const linting = modeler.get("linting");
linting.update();

await new Promise(resolve => setTimeout(resolve, 200));


if (hasLintingErrors) {

  console.error(" Deployment blocked due to errors");

  const outputEl = document.getElementById("Tab1");

if (outputEl) {
  outputEl.innerHTML = `
    <div class="output error">
      <h5><strong>DEPLOYMENT BLOCKED</strong></h5>
      <h7>Please resolve the existing <strong>ERRORS</strong> in the Problems tab and try again. </h7>
    </div>`;
    scrollToTab("Tab1");
}

  
  document.querySelector('[data-tab="Tab2"]')?.click();

  return;
}
  try {

    // 1. Get BPMN XML
    let { xml } = await modeler.saveXML({ format: true });
    if (xml.includes('camunda:historyTimeToLive')) {
  // Replace existing value (e.g., 1 → 30)
  xml = xml.replace(
    /camunda:historyTimeToLive="[^"]*"/,
    'camunda:historyTimeToLive="1"'
  );
} else {
  // Add attribute to <bpmn:process>
  xml = xml.replace(
    '<bpmn:process id="',
    '<bpmn:process camunda:historyTimeToLive="1" id="'
  );
}
    // 2. Create form data
    const blob = new Blob([xml], { type: "text/xml" });
    const formData = new FormData();
    formData.append("data", blob, "diagram.bpmn");

    showRunProgress("Deploying process...");

    // 3. Deploy process
    const deployResponse = await fetch(
      "https://demo.fluxnova.finos.org/engine-rest/deployment/create",
      {
        method: "POST",
        body: formData
      }
    );
  
    const deployJson = await deployResponse.json();
    temp = deployJson;

    const definitions = deployJson.deployedProcessDefinitions;

    const processKey = definitions
      ? Object.values(definitions)[0].key
      : null;

    // If deployment failed or no process
    if (!processKey) {

      const outputEl = document.getElementById("Tab1");
      if (outputEl) {
        outputEl.textContent = JSON.stringify(deployJson, null, 2);
      }

      return;
    }

    showRunProgress("Process deployed. Starting it now...");

    //Start process instance
    const startResponse = await fetch(
      `https://demo.fluxnova.finos.org/engine-rest/process-definition/key/${processKey}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "variables": fromuser
        })
      }
    );

    const startJson = await startResponse.json();
    //Combine result
    let finalOutput = `Deployment successful and process started`;

if (startJson.ended === true) {
  finalOutput += ", process ended successfully";
} else {
  finalOutput += ", view process on Fluxnova monitoring.";
}


    //Show output in UI
    const outputEl = document.getElementById("Tab1");
    
if (outputEl) {
  outputEl.innerHTML = `
    <span class="status-success">Deployment successful and process started</span>
    ${startJson.ended
      ? `<span class="status-end"> and ended successfully.</span>`
      : `, <a href="#" class="status-link" onclick="openCockpit()">
             View process on Fluxnova Monitoring
           </a>`
    }
  `;
}


  } catch (error) {
    console.error("Error:", error);

    const outputEl = document.getElementById("Tab1");
    if (outputEl) {
      outputEl.textContent = "Error: " + error.message;
    }
    scrollToTab("Tab1");
    return;
  }
  
  hasRunExecuted = true;

};

const sampleFiles = [
  { name: "Condition Task", path: "/samples/condition_task.bpmn" },
  { name: "User Task", path: "/samples/user_task.bpmn" },
  { name: "Script Task", path: "/samples/script_task.bpmn" }
];

window.initSampleDropdown = function () {
  const dropdown = document.getElementById("sampleDropdown");

  // clear existing options
  dropdown.innerHTML = "";

  // add default option
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select Sample";
  defaultOption.value = "";
  dropdown.appendChild(defaultOption);

  // add file options
  sampleFiles.forEach(file => {
    const option = document.createElement("option");
    option.value = file.path;
    option.textContent = file.name;
    dropdown.appendChild(option);
  });

  // handle selection
  dropdown.addEventListener("change", async function () {
    const filePath = this.value;

    if (!filePath || !modeler) return;

    try {
      const response = await fetch(filePath);
      const xml = await response.text();

      await modeler.importXML(xml);

      modeler.get('canvas').zoom('fit-viewport');


    } catch (err) {
      console.error("Failed to load sample:", err);
      alert("Error loading sample file");
    }
  });
};

window.initSampleDropdown();

window.openCockpit = function () {
if (!hasRunExecuted) {

    console.error("Run not executed yet");

    const outputEl = document.getElementById("Tab1");
    if (outputEl) {
      outputEl.innerHTML = `
        <div class="output error">
          <h5><strong>CANNOT OPEN FlUXNOVA MONITORING</strong></h5>
          <h7>Please click <strong>Run</strong> before opening Fluxnova Monitoring.</h7>
        </div>`;
        scrollToTab("Tab1");
    }

    document.querySelector('[data-tab="Tab2"]')?.click();

    return; 
  }

if (hasLintingErrors) {
    console.error("Cannot open cockpit: fix errors first");

    const outputEl = document.getElementById("Tab1");
    if (outputEl) {
      
 outputEl.innerHTML = `
    <div class="output error">
      <h5><strong>CANNOT OPEN FlUXNOVA MONITORING</strong></h5>
      <h7>
        Please resolve the existing <strong>ERRORS</strong> in the Problems tab and try again.
      </h7>
    </div>`;
    scrollToTab("Tab1");

    }

    document.querySelector('[data-tab="Tab2"]')?.click();
    
    return;
  }

  const obj=temp.deployedProcessDefinitions;
  const firstKey = Object.keys(obj)[0];
  window.cockpitUrl = `https://demo.fluxnova.finos.org/default/process-definitions/${firstKey}`;
  if (!window.cockpitUrl) {
    console.error("cockpitUrl not defined");
    return;
  }

  window.open(window.cockpitUrl, "_blank");
};

//popup
 window.dialog = window.document.getElementById("myDialog");
  
  // Define the function on the window object so the HTML link can call it
  window.showTextbox = function() {
    const inputBox = document.getElementById("inputBox");
    const inputError = document.getElementById("inputError");
    inputBox.value = "";
    inputBox.removeAttribute("aria-invalid");
    inputError.textContent = "";
    window.dialog.showModal();
    inputBox.focus();
  };

  // Keep your existing close button listener
  window.document.getElementById("closeBtn").addEventListener("click", () => {
    window.dialog.close();
  });

  window.currentExample = "condition"; // default

  window.examples = {
  condition: {
    title: "Condition Task",
    description: "This example shows how the process chooses one path or another based on data.",
    data: '{ "input": { "value": 15 } }',
    result: "Goes to the Yes task because the value is greater than 10.",
    path: "/samples/condition_task.bpmn"
  },
  user: {
    title: "User Task Example",
    description: "This example shows how the process waits for a person to complete a task.",
    data: '{ "requestId": { "value": "REQ-1001" } }',
    result: "The process pauses until the user task is claimed and completed.",
    path: "/samples/user_task.bpmn"
  },
  script: {
    title: "Script Task Example",
    description: "This example shows how the process executes a Groovy script.",
    data: '{ "name": { "value": "your_name" } }',
    result: "The process prints a message for the user.",
    path: "/samples/script_task.bpmn"
  }
};

window.sampleItems = document.querySelectorAll(".sample-item");

window.renderExample = function (key) {
  const ex = window.examples[key];
  window.currentExample = key; 
  document.getElementById("sampleTitle").textContent = ex.title;
  document.getElementById("sampleDescription").innerHTML = ex.description;
  document.getElementById("sampleData").textContent = ex.data;
  document.getElementById("sampleResult").textContent = ex.result;

  window.sampleItems.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.sample === key)
  );
};

window.initSampleListeners = function () {
  window.sampleItems.forEach(item => {
    item.addEventListener("click", () => {
      window.renderExample(item.dataset.sample);
    });
  });

  document.getElementById("loadExampleBtn").addEventListener("click", async () => {
  try {
    // ✅ get current example key
    const key = window.currentExample;

    // ✅ get path from examples object
    const path = window.examples[key].path;


    // ✅ fetch the BPMN file
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error("Failed to load file");
    }

    const bpmnXML = await response.text();
    await modeler.importXML(bpmnXML);
    modeler.get('canvas').zoom('fit-viewport');


    

  } catch (error) {
    console.error(error);
    alert("Error loading BPMN file");
  }

  scrollToTab("canvas");
});
};

// initialize everything
window.initSamples = function () {
  window.sampleItems = document.querySelectorAll(".sample-item");
  window.initSampleListeners();
  window.renderExample("condition");
};

// run after DOM loads
window.addEventListener("DOMContentLoaded", () => {
  window.initSamples();
});

let stepIndex = 0;

const guideSteps = [
  {
    element: ".uploadbpmn",
    text: "Click here to upload your BPMN file."
  },
  {
    element: "#canvas",
    text: "Your diagram will appear here."
  },
  {
    element: ".dropbtn",
    text: "Click Run to execute the process."
  }
];

function startGuide() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("guideBox").style.display = "block";
  showStep();
}

function showStep() {
  const step = guideSteps[stepIndex];
  const el = document.querySelector(step.element);
  const box = document.getElementById("guideBox");

  // remove old highlight
  document.querySelectorAll(".highlight").forEach(e => e.classList.remove("highlight"));

  // highlight current element
  el.classList.add("highlight");

  // position box
  const rect = el.getBoundingClientRect();
  box.style.top = rect.bottom + 10 + "px";
  box.style.left = rect.left + "px";

  document.getElementById("guideText").innerText = step.text;
  


  // scrollToTab("guideBox");
}

function nextStep() {
  stepIndex++;

  if (stepIndex >= guideSteps.length) {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("guideBox").style.display = "none";
    document.querySelectorAll(".highlight").forEach(e => e.classList.remove("highlight"));
    return;
  }

  showStep();
}

window.onload = function () {
  startGuide();   // ✅ ADD THIS LINE
};
