import { PanelPlugin } from '@grafana/data';
import { TextPanel } from './TextPanel';
import { TextOptions } from './types';

import { PanelOptionCode } from './PanelOptionCode';

export const plugin = new PanelPlugin<TextOptions>(TextPanel).setNoPadding().setPanelOptions((builder) => {
  return builder
    .addCustomEditor({
      id: 'code',
      path: 'code',
      name: 'Code',
      description:
        'Allows to define a script for processing the data. It receives the `data` and `panelData` variables.',
      editor: PanelOptionCode,
      settings: {
        language: 'javascript',
        height: '50vh',
      },
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'content',
      path: 'content',
      name: 'Content',
      description: 'Supports Markdown and Handlebars',
      editor: PanelOptionCode,
      settings: {
        language: 'handlebars',
        height: '50vh',
      },
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'defaultContent',
      path: 'defaultContent',
      name: 'Default content',
      description: 'Displayed when query result is empty. Supports Markdown and Handlebars',
      editor: PanelOptionCode,
      settings: {
        language: 'handlebars',
        height: '20vh',
      },
      defaultValue: "The query didn't return any results.",
    });
});
