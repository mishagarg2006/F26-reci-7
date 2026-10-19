import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { mergeIntervals, type Interval } from '../src/intervals';

// Recitation Part 2 (groups) and problem set Task 2.
// Read the spec in src/intervals/mergeIntervals.ts, then check your progress
// with `npm run mutants:intervals`.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The output is sorted.
// (invariant, algebraic, metamorphic, differential, or conditional)

// A first attempt at a generator. It has a problem: run the tests and read
// the counterexample.
const interval: fc.Arbitrary<Interval> = fc.tuple(fc.integer(), fc.nat()).map(([first, offset]) => [first, first + offset + 1] as Interval);
const intervalList = fc.array(interval);

describe('mergeIntervals', () => {
  // Pattern: invariant. Every input interval lies inside some output interval.
  it('every input interval lies inside some output interval', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        const uncovered = xs.filter(([s, e]) => !out.some(([a, b]) => a <= s && e <= b));
        expect(uncovered).toEqual([]);
      }),
    );
  });

  // Add your properties here. Aim for at least one of each pattern:
  // invariant, algebraic, metamorphic, differential, conditional.

  // Pattern: invariant. The output is increasingly sorted. 
  it('the output is increasingly sorted', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        for (let i = 0; i < out.length - 1; i++) {
          expect(out[i][0]).toBeLessThan(out[i][1]);
          expect(out[i + 1][0]).toBeLessThan(out[i + 1][1]);
          expect(out[i][0]).toBeLessThan(out[i + 1][0]);
          expect(out[i][0]).toBeLessThan(out[i + 1][1]);
          expect(out[i][1]).toBeLessThan(out[i + 1][0]);
          expect(out[i][1]).toBeLessThan(out[i + 1][1]);
        }
      }),
    );
  });

  // Pattern metamorphic. Duplicating the input intervals should not change the output.
  


});
