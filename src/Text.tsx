import { GrafanaTheme, PanelData, textUtil } from '@grafana/data';
import { InfoBox, useTheme } from '@grafana/ui';
import { css } from 'emotion';
import Handlebars from 'handlebars';
import MarkdownIt from 'markdown-it';
import React from 'react';
import { registerHelpers } from './helpers';

registerHelpers(Handlebars);

export interface TextProps {
  data: PanelData;
  code: string;
  content: string;
  defaultContent: string;
}

export const Text = React.memo(({ data: panelData, code, content, defaultContent }: TextProps) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  try {
    let renderedContent;
    if (panelData.series?.length) {
      let data: Record<string, any> = {};
      panelData.series.forEach((s, i) => {
        data[s.refId || `${i}`] = s.fields.reduce((out, { config, name, values }) => {
          values.toArray().forEach((v, i) => {
            out[i] = { ...out[i], [config.displayName || name]: v };
          });
          return out;
        }, [] as Array<Record<string, any>>);
      });
      if (code) {
        const f = new Function('data,panelData', code);
        data = f(data, panelData) as Record<string, any>;
      } else {
        data = { data: Object.values(data)[0] };
      }
      renderedContent = (
        <div className={styles.frame} dangerouslySetInnerHTML={{ __html: generateHtml(data, content) }} />
      );
    } else {
      renderedContent = (
        <div className={styles.frame} dangerouslySetInnerHTML={{ __html: generateHtml({}, defaultContent) }} />
      );
    }

    return <div style={{ flexGrow: 1, overflow: 'auto' }}>{renderedContent}</div>;
  } catch (e) {
    return (
      <div
        className={css`
          padding: ${theme.spacing.sm};
        `}
      >
        <InfoBox title="Couldn't build text from template" severity="error">
          <p>
            Please make sure the your text content is a valid{' '}
            <a href="https://handlebarsjs.com/" target="_blank" rel="noreferrer">
              Handlebars
            </a>{' '}
            template.
          </p>
          <pre>{e instanceof Error ? e.message : e}</pre>
        </InfoBox>
      </div>
    );
  }
});
Text.displayName = 'Text';

const generateHtml = (data: Record<string, any>, content: string): string => {
  const md = new MarkdownIt({ html: true });

  const template = Handlebars.compile(content);
  const markdown = template(data);
  const html = md.render(markdown);
  const sanitizedHtml = textUtil.sanitize(html);

  return sanitizedHtml;
};

const getStyles = (theme: GrafanaTheme) => ({
  frame: css`
    border-bottom: 1px solid ${theme.colors.panelBorder};
    margin-bottom: 1rem;
    padding: ${theme.spacing.sm};

    &:last-child {
      margin-bottom: 0;
      border-bottom: 0;
    }

    li {
      margin-left: ${theme.spacing.md};
    }

    table {
      border-collapse: collapse;

      th,
      td {
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        border-top: 1px solid ${theme.colors.border2};
        border-left: 1px solid ${theme.colors.border2};
      }

      th {
        font-weight: ${theme.typography.weight.semibold};
        background: ${theme.colors.bg2};
      }

      border-bottom: 1px solid ${theme.colors.border2};
      border-right: 1px solid ${theme.colors.border2};
    }

    blockquote {
      margin: ${theme.spacing.md} 0;
      border-left: 5px solid ${theme.colors.border3};
      padding: ${theme.spacing.sm};
      padding-left: ${theme.spacing.md};

      p {
        font-size: ${theme.typography.size.base};
        color: ${theme.colors.textSemiWeak};
      }
    }
  `,
});
