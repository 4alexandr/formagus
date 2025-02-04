import React from 'react';
import {observer} from 'mobx-react';
import {useField} from './useField';
import type {FieldProps} from './Field.types';

export const Field = observer((props: FieldProps) => {
  const {isReady, formagus} = useField(props);

  if (!isReady) {
    return <></>;
  }

  const hasAdapterComponent = 'adapter' in props && props.adapter !== undefined;

  if (hasAdapterComponent) {
    const Adapter: any = props.adapter;
    return <Adapter formagus={formagus} {...props.adapterProps} />;
  } else {
    return props.children!({formagus: formagus!});
  }
});

(Field as any).displayName = 'FormagusField';
