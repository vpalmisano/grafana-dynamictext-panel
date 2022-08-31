import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { CodeEditor } from '@grafana/ui';

interface Props extends StandardEditorProps<string, any, any> {}

export const PanelOptionCode: React.FC<Props> = ({ value, item, onChange }) => {
  if (typeof value !== 'string') {
    value = JSON.stringify(value, null, 2);
  }
  return (
    <CodeEditor
      language={item.settings?.language}
      showLineNumbers={true}
      value={value || ''}
      width="100%"
      height={item.settings?.height || '200px'}
      onBlur={(code) => {
        onChange(code);
      }}
    />
  );
};
