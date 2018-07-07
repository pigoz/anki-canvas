import {
  CANVAS_SIZE_RESOLUTION_INDEPENDENT,
  RESULT_SIZE_RESOLUTION_INDEPENDENT,
} from './constants';

export const canvas = {
  height: `${CANVAS_SIZE_RESOLUTION_INDEPENDENT}px`,
  width: `${CANVAS_SIZE_RESOLUTION_INDEPENDENT}px`,
  border: '2px solid #ddd',
  background: '#fff',
  'background-image':
    'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="#ddd" stroke-width="0.2"><line x1="50" y1="0" x2="50" y2="100" /><line x1="0" y1="50" x2="100" y2="50" /></g><g stroke="#bbb" stroke-width="0.2"><line x1="0" y1="100" x2="100" y2="0" /><line x1="0" y1="0" x2="100" y2="100" /></g></svg>\')',
};

export const result = {
  display: 'inline-block',
  height: `${RESULT_SIZE_RESOLUTION_INDEPENDENT}px`,
  width: `${RESULT_SIZE_RESOLUTION_INDEPENDENT}px`,
  border: '1px solid #ddd',
  'background-image':
    'url(\'data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="#ddd" stroke-width="0.2"><line x1="50" y1="0" x2="50" y2="100" /><line x1="0" y1="50" x2="100" y2="50" /></g><g stroke="#bbb" stroke-width="0.2"><line x1="0" y1="100" x2="100" y2="0" /><line x1="0" y1="0" x2="100" y2="100" /></g></svg>\')',
};

export const actions = {};

export const action = {
  background: 'transparent',
  'font-size': '22px',
  border: 'none',
  outline: 'none',
};
