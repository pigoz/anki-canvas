import { options } from './options';

export const canvas = {
  height: `${options.frontCanvasSize}px`,
  width: `${options.frontCanvasSize}px`,
  border: '2px solid #ddd',
  background: '#fff',
};

export const result = {
  display: 'inline-block',
  height: `${options.backCanvasSize}px`,
  width: `${options.backCanvasSize}px`,
  border: '1px solid #ddd',
};

export const wrapper = {
  'text-align': 'center',
};

export const actions = {};

export const action = {
  'font-size': '22px',
  border: 'none',
  'border-radius': '50%',
  outline: 'none',
  background: '#ddd',
  display: 'inline-flex',
  width: '44px',
  height: '44px',
  padding: '0',
  'align-items': 'center',
  'justify-content': 'center',
  margin: '0 5px',
};
