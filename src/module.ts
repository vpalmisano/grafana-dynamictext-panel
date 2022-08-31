import { PanelPlugin } from '@grafana/data';
import { TextPanel } from './TextPanel';
import { TextOptions } from './types';

import { PanelOptionCode } from './PanelOptionCode';

export const plugin = new PanelPlugin<TextOptions>(TextPanel).setNoPadding().setPanelOptions((builder) => {
  return builder
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
    })
    .addBooleanSwitch({
      path: 'everyRow',
      name: 'Render template for every row',
      defaultValue: true,
    });
});
