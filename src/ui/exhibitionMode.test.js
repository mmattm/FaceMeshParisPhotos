import test from 'node:test';
import assert from 'node:assert/strict';
import { setupExhibitionMode } from './exhibitionMode.js';

function browser(search) {
  const classes = new Set();
  return { location: { search }, document: { body: { classList: {
    add: (...values) => values.forEach(value => classes.add(value))
  } } }, console: { warn() {} }, classes };
}

test('exhibition hides interface and suppresses blocking dialogs without approving actions', () => {
  const target = browser('?exhibition=1');
  assert.equal(setupExhibitionMode(target), true);
  assert.equal(target.classes.has('interface-hidden'), true);
  assert.doesNotThrow(() => target.alert('camera error'));
  assert.equal(target.confirm('delete animation?'), false);
  assert.equal(target.prompt('copy visitor ID'), null);
});

test('ordinary operator mode keeps dialogs and interface unchanged', () => {
  const target = browser('');
  const original = () => true;
  target.confirm = original;
  assert.equal(setupExhibitionMode(target), false);
  assert.equal(target.classes.size, 0);
  assert.equal(target.confirm, original);
});
