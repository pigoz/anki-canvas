import * as React from 'react';
import { CANVAS_SIZE, RESULT_SIZE, HDPI_FACTOR } from './constants';

export const canvas: React.CSSProperties = {
  height: CANVAS_SIZE / HDPI_FACTOR,
  width: CANVAS_SIZE / HDPI_FACTOR,
  border: '2px solid #ddd',
  background: '#fff',
  backgroundImage:
    'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="#ddd" stroke-width="0.2"><line x1="50" y1="0" x2="50" y2="100" /><line x1="0" y1="50" x2="100" y2="50" /></g><g stroke="#bbb" stroke-width="0.2"><line x1="0" y1="100" x2="100" y2="0" /><line x1="0" y1="0" x2="100" y2="100" /></g></svg>\')',
};

export const result: React.CSSProperties = {
  height: RESULT_SIZE / HDPI_FACTOR,
  width: RESULT_SIZE / HDPI_FACTOR,
  border: '1px solid #ddd',
  backgroundImage:
    'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="#ddd" stroke-width="0.2"><line x1="50" y1="0" x2="50" y2="100" /><line x1="0" y1="50" x2="100" y2="50" /></g><g stroke="#bbb" stroke-width="0.2"><line x1="0" y1="100" x2="100" y2="0" /><line x1="0" y1="0" x2="100" y2="100" /></g></svg>\')',
};

export const actions: React.CSSProperties = {};

export const action: React.CSSProperties = {
  background: 'transparent',
  fontSize: '22px',
  border: 'none',
  outline: 'none',
};
