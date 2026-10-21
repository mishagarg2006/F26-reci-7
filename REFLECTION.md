# Reflection

**Name / Andrew ID:** Misha Garg (mishag)

**Recitation group members (Task 2):** Sissi Zhen

---

### 1. Valid but weak

Pick a property you wrote that passes on the correct implementation but
kills few or no mutants. Why is it still a *valid* property? Describe a
concrete bug (not one of our mutants) that it *would* catch.

A property I wrote that passes on the correct implementation but kills no mutatants is that duplicating the input intervals should not change the output. This is still a valid property as duplicated intervals are completely overlapping and, thus, should be merged in the output. It would catch implementations that do not merge intervals that are the exact same (maybe it only merges them if one interval is a strict subset of the other). 

### 2. A generator problem, not a property problem

Describe a mutant, from either task, that survived or was flaky because of
your **generator** rather than your property. What did the generator fail to
produce? How did you fix it? Paste the runner output from before and after.

A mutant that was flaky because of my generator, rather than my property was touchingNotMerged. The generator failed to produce touching intervals. I fixed it by ensuring that the generator always produces overlapping intervals by narrowing the range of possible intervals that could be chosen and making it so no matter what the first point is in each interval is, the offset is always large enough that they overlap. 

Before output:
~ touchingNotMerged       flaky: killed in 1/5 runs  by: the output is increasingly sorted
    Counterexample: [[[-2147483635,-10],[-10,-9]]]
    AssertionError: expected -10 to be less than -10

After output:
✔ touchingNotMerged       killed  by: the output is increasingly sorted
    Counterexample: [[[-8,0],[0,1]]]
    AssertionError: expected 0 to be less than 0
### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the *specification* why that input
exposes the bug.

✔ dropsLast               killed  by: every input interval lies inside some output interval; the input covers point p when the merged output covers p; merging a merged interval should not change the output; if the input intervals do not overlap or touch, the output should be the same as the input
    Counterexample: [[[0,1]]]
    AssertionError: expected [ [ +0, 1 ] ] to deeply equal []

This input exposes the bug in the implementation because there is only one interval in the input so an implementation that just drops the last interval would return no intervals. This is an incorrect output based on the specification as mergeIntervals should return a list of intervals with overlapping ones merged together, but this interval was just completely deleted. 

### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.

One function in my team's project that would benefit from property-based testing is evaluate in /workspaces/fall-26-opencode-team-c1/packages/opencode/src/permission/index.ts.
Property 1 (Differential): Compare its result with a simple reference implementation that scans rules and selects the last match.
Property 2 (Metamorephic): Appending a nonmatching rule cannot change the result.
Generator: The generator should have overlapping wildcard rules and duplicate matches. The generated inputs should be designed to match zero, one, or several rules. A naive generator would create purely random strings which would rarely match the rules. 