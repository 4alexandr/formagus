import React, {useState} from 'react';
import {render} from '@testing-library/react';
import {FormController, Field} from '../../src';
import {TestForm} from '../components/TestForm';
import {InputAdapter} from '../components/InputAdapter';
import {createInputAdapterDriver} from '../components/InputAdapter/InputAdapter.driver';
import {createTestFormDriver} from '../components/TestForm.driver';
import {waitFor} from '../helpers/conditions';
import {fireEvent} from '@testing-library/react';
import {cleanup} from '@testing-library/react';

describe('Field interactions', () => {
  afterEach(() => {
    return cleanup();
  });

  it('should keep value if "persist=true"', () => {
    const FormWithHiddenField = () => {
      const [hiddenField, setHiddenField] = useState(false);

      return (
        <TestForm>
          {!hiddenField && <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} persist={true} />}
          <button
            type="button"
            data-hook="toggle-field"
            onClick={() => {
              setHiddenField(!hiddenField);
            }}
          >
            Toggle Field
          </button>
        </TestForm>
      );
    };

    const wrapper = render(<FormWithHiddenField />).container;
    const formDriver = createTestFormDriver({wrapper});
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const toggleField = wrapper.querySelector(`[data-hook="toggle-field"]`)!;

    fieldDriver.when.change('batman');

    fireEvent.click(toggleField);

    expect(formDriver.get.values()[TestForm.FIELD_ONE_NAME]).toBeUndefined();

    fireEvent.click(toggleField);

    expect(fieldDriver.get.value()).toBe('batman');
  });

  it('should not keep value', () => {
    class StatefulForm extends React.Component<{props: null}, {hiddenField: boolean}> {
      state = {
        hiddenField: false,
      };

      render() {
        return (
          <TestForm>
            {!this.state.hiddenField && <Field name={TestForm.FIELD_ONE_NAME} adapter={InputAdapter} />}
            <button
              type="button"
              data-hook="toggle-field"
              onClick={() => {
                this.setState((state) => {
                  return {
                    hiddenField: !state.hiddenField,
                  };
                });
              }}
            >
              Toggle Field
            </button>
          </TestForm>
        );
      }
    }

    const wrapper = render(<StatefulForm props={null} />).container;
    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});
    const toggleField = wrapper.querySelector(`[data-hook="toggle-field"]`)!;
    const NEW_VALUE = 'batman';

    fieldDriver.when.change(NEW_VALUE);

    fireEvent.click(toggleField);
    fireEvent.click(toggleField);

    expect(fieldDriver.get.value()).toBe('');
  });

  it('set custom state', async () => {
    const formController = new FormController({});

    expect(formController.API.getFieldMeta(TestForm.FIELD_ONE_NAME).customState).toEqual({});

    const wrapper = render(
      <TestForm>
        <Field name={TestForm.FIELD_ONE_NAME}>
          {(formagusProps) => (
            <InputAdapter
              {...formagusProps}
              customState={{
                customProperty: 'custom value',
              }}
            />
          )}
        </Field>
      </TestForm>,
    ).container;

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: TestForm.FIELD_ONE_NAME});

    fieldDriver.when.setCustomState();

    await waitFor(wrapper)(() => {
      return fieldDriver.get.meta('customState:customProperty') === 'custom value';
    });
  });

  it('set nested value', async () => {
    const NESTED_FIELD_NAME = `${TestForm.FIELD_ONE_NAME}[0].nested`;
    const NEW_VALUE = 'batman';
    const formController = new FormController({});

    const wrapper = render(
      <TestForm controller={formController}>
        <Field name={NESTED_FIELD_NAME} adapter={InputAdapter} />
      </TestForm>,
    ).container;

    const fieldDriver = createInputAdapterDriver({wrapper, dataHook: NESTED_FIELD_NAME});

    fieldDriver.when.change(NEW_VALUE);

    await waitFor(wrapper)(() => {
      return formController.API.values[TestForm.FIELD_ONE_NAME][0].nested === NEW_VALUE;
    });
  });
});
