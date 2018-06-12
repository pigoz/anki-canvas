import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as styles from './styles';
import { redraw, load } from './touch';
import { CANVAS_SIZE, RESULT_SIZE } from './constants';

const RATIO = RESULT_SIZE / CANVAS_SIZE;

class Result extends React.Component {
  componentDidMount() {
    const c = document.getElementsByTagName('canvas')[0];
    redraw(
      c,
      load().map(l => l.map(z => ({ x: z.x * RATIO, y: z.y * RATIO }))),
      { lineWidth: 3 },
    );
  }

  render() {
    return (
      <React.Fragment>
        <canvas
          style={styles.result}
          width={RESULT_SIZE}
          height={RESULT_SIZE}
        />
      </React.Fragment>
    );
  }
}

ReactDOM.render(<Result />, document.getElementById('result'));
