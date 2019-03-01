import * as hs from 'hyperscript';
import { saveunsafe } from '../src/app';
import { renderdom } from '../src/render';
import { ryuu } from './fixtures/ryuu';

const buttons: { [x: string]: unknown } = {
  ryuu,
};

const h = hs.context();
const fixtures = h('div');

Object.keys(buttons).forEach(key => {
  const button = h('button', {}, key);

  button.addEventListener(
    'click',
    () => {
      saveunsafe(buttons[key]);
      location.reload();
    },
    false,
  );

  fixtures.appendChild(button);
});

renderdom('ac-fixtures', fixtures);
