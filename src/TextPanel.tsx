import { GrafanaTheme, PanelProps } from '@grafana/data';
import { stylesFactory, useTheme } from '@grafana/ui';
import { css, cx } from 'emotion';
import React from 'react';
import { TextOptions } from 'types';
import { Text } from './Text';

interface Props extends PanelProps<TextOptions> {}

export const TextPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        width: ${width}px;
        height: ${height}px;
      `}
    >
      <div
        className={cx(
          styles.root,
          css`
            flex-grow: 1;
            overflow: auto;
          `
        )}
      >
        <Text
          data={data}
          code={options.code ?? ''}
          content={options.content ?? ''}
          defaultContent={options.defaultContent ?? ''}
        />
      </div>
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => ({
  root: css`
    display: flex;
    flex-direction: column;
  `,
  frameSelect: css`
    padding: ${theme.spacing.sm};
  `,
}));
