import test from 'node:test';
import assert from 'node:assert/strict';
import { isDrawable } from './drawOnRule.js';

/* A stroked path, the ordinary case everything else deviates from. */
const path = {
  tagName: 'path',
  stroke: 'rgb(0, 0, 0)',
  strokeWidth: '1.5px',
  strokeDasharray: 'none',
  measurable: true,
};

test('a stroked, measurable shape is drawn', () => {
  assert.equal(isDrawable(path), true);
});

test('text fades, however it is stroked', () => {
  assert.equal(isDrawable({ ...path, tagName: 'text' }), false);
});

test('an unstroked or hairless shape fades', () => {
  assert.equal(isDrawable({ ...path, stroke: 'none' }), false);
  assert.equal(isDrawable({ ...path, strokeWidth: '0px' }), false);
});

/* The one that would quietly ruin the artwork: overwriting an authored dash
   pattern with the draw-on offset wipes the pattern out. */
test('an authored dash pattern is left alone', () => {
  assert.equal(isDrawable({ ...path, strokeDasharray: '4px 6px' }), false);
});

test('a shape with no length to walk fades', () => {
  assert.equal(isDrawable({ ...path, measurable: false }), false);
});
