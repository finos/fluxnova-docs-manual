import { isUndefined, isDefined } from 'min-dash';

import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';

import { TextFieldEntry, isTextFieldEntryEdited, SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';

import { BpmnFormTypeProps } from './BpmnFormTypeProps';

import {
  useService
} from 'bpmn-js-properties-panel';


export function FormProps(props) {
  const {
    element
  } = props;

  if (!isFormSupported(element)) {
    return [];
  }

  const formType = getFormType(element),
        bindingType = getFormRefBinding(element);

  // (1) display form type select
  const entries = [
    ...BpmnFormTypeProps({ element })
  ];

  // (2) display form properties based on type
  if (formType === 'formKey') {
    entries.push({
      id: 'formKey',
      component: FormKey,
      isEdited: isTextFieldEntryEdited
    });
  } else if (formType === 'formRef') {
    entries.push({
      id: 'formRef',
      component: FormRef,
      isEdited: isTextFieldEntryEdited
    }, {
      id: 'formRefBinding',
      component: Binding,
      isEdited: isSelectEntryEdited
    });

    if (bindingType === 'version') {
      entries.push({
        id: 'formRefVersion',
        component: Version,
        isEdited: isTextFieldEntryEdited
      });
    }
  }

  return entries;
}

function FormKey(props) {
  const { element } = props;

  const debounce = useService('debounceInput');
  const modeling = useService('modeling');
  const translate = useService('translate');

  const businessObject = getBusinessObject(element);

  const getValue = () => {
    return businessObject.get('camunda:formKey');
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      'camunda:formKey': isUndefined(value) ? '' : value
    });
  };

  return TextFieldEntry({
    element,
    id: 'formKey',
    label: translate('Form key'),
    getValue,
    setValue,
    debounce
  });
}

function FormRef(props) {
  const { element } = props;

  const debounce = useService('debounceInput');
  const modeling = useService('modeling');
  const translate = useService('translate');

  const businessObject = getBusinessObject(element);

  const getValue = () => {
    return businessObject.get('camunda:formRef');
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      'camunda:formRef': isUndefined(value) ? '' : value
    });
  };

  return TextFieldEntry({
    element,
    id: 'formRef',
    label: translate('Form reference'),
    getValue,
    setValue,
    debounce
  });
}

function Binding(props) {
  const { element } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');

  const getValue = () => {
    return getFormRefBinding(element);
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      'camunda:formRefBinding': value
    });
  };

  // Note: default is "latest",
  const getOptions = () => {

    const options = [
      { value: 'deployment', label: translate('deployment') },
      { value: 'latest', label: translate('latest') },
      { value: 'version', label: translate('version') }
    ];

    return options;
  };

  return SelectEntry({
    element,
    id: 'formRefBinding',
    label: translate('Binding'),
    getValue,
    setValue,
    getOptions
  });
}

function Version(props) {
  const { element } = props;

  const debounce = useService('debounceInput');
  const modeling = useService('modeling');
  const translate = useService('translate');

  const businessObject = getBusinessObject(element);

  const getValue = () => {
    return businessObject.get('camunda:formRefVersion');
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      'camunda:formRefVersion': value
    });
  };

  return TextFieldEntry({
    element,
    id: 'formRefVersion',
    label: translate('Version'),
    getValue,
    setValue,
    debounce
  });
}

export function getFormRefBinding(element) {
  const businessObject = getBusinessObject(element);

  return businessObject.get('camunda:formRefBinding') || 'latest';
}

export function getFormType(element) {
  const businessObject = getBusinessObject(element);

  if (isDefined(businessObject.get('camunda:formKey'))) {
    return 'formKey';
  } else if (isDefined(businessObject.get('camunda:formRef'))) {
    return 'formRef';
  }
}

export function isFormSupported(element) {
  return (is(element, 'bpmn:StartEvent') && !is(element.parent, 'bpmn:SubProcess'))
    || is(element, 'bpmn:UserTask');
}
