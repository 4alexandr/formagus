import React from 'react';
import type {FieldValidationState, FormMeta} from '../FormController';

export type ValidationFunction =
  | ((value: any, values?: any) => FieldValidationState)
  | ((value: any, values?: any) => Promise<FieldValidationState>);

export type FieldAdapter = React.ComponentClass<AdapterProps> | React.FC<AdapterProps>;

export interface FieldMeta {
  errors: any | null;
  initialValue: any;
  isDirty: boolean;
  isTouched: boolean;
  isChanged: boolean;
  isActive: boolean;
  isValidating: boolean;
  isRegistered: boolean;
  customState: Record<string, any>;
  form: FormMeta;
}

export type AdapterRenderProps = Required<AdapterProps>;

export type AdapterProps = {
  formagus?: {
    name: string;
    meta: FieldMeta;
    value: any;
    setCustomState: (key: string, value: any) => void;
    onChange: (value: any) => void;
    onFocus: () => void;
    onBlur: () => void;
    validate: () => void;
  };
};

export type FormatterFunction = (value: any) => any;
export type EqualityCheckFunction = (newValue: any, oldValue: any) => boolean;

type FieldCommonProps = {
  name: string;
  defaultValue?: any;
  onValidate?: ValidationFunction;
  onFormat?: FormatterFunction;
  onEqualityCheck?: EqualityCheckFunction;
  onInit?: Function;
  persist?: boolean;
};

export type FieldProps<T = any> = FieldCommonProps & {
  children?: (injectedAdapterProps: AdapterRenderProps) => JSX.Element;
  adapter?: React.ComponentClass<AdapterProps & T> | React.FC<AdapterProps & T>;
  adapterProps?: any;
};
