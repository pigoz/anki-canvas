import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as styles from './styles';
import {
  handleStart,
  handleMove,
  handleEnd,
  handleCancel,
  clear,
  redraw,
  save,
} from './touch';
import { CANVAS_SIZE } from './constants';

export type Point = {
  x: number;
  y: number;
};

type Props = {
  undo: () => void;
  clear: () => void;
};

const Whiteboard: React.SFC<Props> = props => (
  <React.Fragment>
    <canvas style={styles.canvas} width={CANVAS_SIZE} height={CANVAS_SIZE} />
    <div style={styles.actions}>
      <button style={styles.action} onClick={props.undo}>
        ❌
      </button>
    </div>
  </React.Fragment>
);

save([]); // reset saved state on reinit
const state: Array<Point[]> = [];

class App extends React.Component {
  state = 0;
  c!: HTMLCanvasElement;

  handleUndo = () => {
    state.splice(-1, 1);
    redraw(this.c, state);
  };

  handleClear = () => {
    clear(this.c);
    state.splice(0, state.length); // empty the array
  };

  componentDidMount() {
    this.c = document.getElementsByTagName('canvas')[0];
    this.c.addEventListener('touchstart', handleStart(this.c), false);
    this.c.addEventListener('touchend', handleEnd(this.c, state), false);
    this.c.addEventListener('touchcancel', handleCancel(), false);
    this.c.addEventListener('touchmove', handleMove(this.c), false);
    this.c.addEventListener('click', e => e.preventDefault(), false);
    redraw(this.c, state);
  }

  render() {
    return (
      <Whiteboard
        undo={this.handleUndo}
        clear={this.handleClear}
        save={this.handleSave}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('whiteboard'));
