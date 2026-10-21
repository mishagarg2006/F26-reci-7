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
const interval: fc.Arbitrary<Interval> = fc.tuple(fc.integer({min: -10, max: 0}), fc.nat({min:0, max: 10})).map(([first, offset]) => [first, first + offset + 1] as Interval);
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

  // Pattern: invariant. The input is unchanged.
  it('the input is unchanged', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const original = xs.map(([start, end]) => [start, end]);
        const out = mergeIntervals(xs);
        expect(xs).toEqual(original);
      }),
    );
  });

  // Pattern differential. The input covers point p when the merged output covers p. 
  const covers = (xs: Interval[], p: number): boolean => xs.some(([start, end]) => start <= p && p <= end);
  it('the input covers point p when the merged output covers p', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const merged = mergeIntervals(xs);
        for (let p = -15; p <= 15; p++) {
          expect(covers(xs, p)).toEqual(covers(merged, p));
        }
        for (let i = 1; i < xs.length; i++) {
          xs[i][0] = xs[i - 1][1];
          xs[i][1] = xs[i - 1][1] + 5;
        }
        const merged_touching = mergeIntervals(xs);
        for (let p = -15; p <= 15; p++) {
          expect(covers(xs, p)).toEqual(covers(merged_touching, p));
        }
      }),
    );
  });

  // Pattern metamorphic. Duplicating the input intervals should not change the output.
  it('duplicating the input intervals should not change the output', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        const duplicate = [...xs, ...xs];
        const duplicate_out = mergeIntervals(duplicate);
        expect(out).toEqual(duplicate_out);
      }),
    );
  });

  // Pattern algebraic. merging a merged interval should not change the output.
  it('merging a merged interval should not change the output', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        expect(mergeIntervals(mergeIntervals(xs))).toEqual(mergeIntervals(xs));
      }),
    );
  });

  // Pattern conditional. If the input intervals do not overlap or touch, the output should be the same as the input.
  it('if the input intervals do not overlap or touch, the output should be the same as the input', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        for (let i = 1; i < xs.length; i++) {
          xs[i][0] = xs[i - 1][1] + 1;
          xs[i][1] = xs[i - 1][1] + 5;
        }
        expect(mergeIntervals(xs)).toEqual(xs);
      }),
    );
  });

});
