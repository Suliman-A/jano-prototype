# How AI was used

## Tools

**Claude Code** (Opus), in a single session, for the whole build: planning,
code, tests and docs. No other AI tooling.

## Roughly how much of the code it wrote

Most of the typing — call it 85–90% of the lines. Close to none of the
decisions. The plan was argued out before any code existed, and the shape of
the thing (what goes in `src/core/`, the order of the pass checks, no state
library, what the QR carries) came out of that argument rather than out of the
model's first suggestion.

Doing it this way is faster at producing plausible code and *slower* at
producing correct code, because the plausible version arrives first and has to
be read properly before it is kept.

## Where I corrected or rejected what it gave me

### 1. A test that passed for the wrong reason

It wrote a check-in test called "should fail when the booth is closed for
maintenance" whose assertion was `PASS_UNKNOWN` — because a booth in
maintenance cannot be booked, so no pass for it ever exists, so the call failed
earlier for a completely different reason. The test was green and the name was
a lie.

Rejected and rewritten: the test now writes a booking, visit and unused pass
into the store through its normal commit path, so the maintenance rule is the
only thing that can refuse the scan. See
`src/api/__tests__/checkIn.test.ts`, "should fail when the booth went into
maintenance after the booking".

This is the failure mode worth watching with generated tests — they are written
to pass, not to discriminate.

### 2. Reaching for libraries the job did not need

The first plan had TanStack Query for data and a bottom-sheet library for the
slot picker. Neither earned its place: the data is local, so the store already
*is* the cache, and the "no manual refresh" requirement turned into
emitter-to-`invalidateQueries` plumbing that `useSyncExternalStore` does for
free. Both were cut. The same went for a QR signature — it was in the design
until it became clear nothing in the brief needed one, and that the key would
have shipped in the app bundle anyway.

### 3. `rangeStatus` fixes that papered over the type errors

Asked to fix the provided file, the first attempt kept the `!` non-null
assertions and added `?? 0` in a couple of places. That silences the type
checker and preserves the bug: a `null` weight becomes `0`, which is still
"below range" — exactly the defect being fixed.

Rewritten to narrow properly (`typeof reading.value === 'number'`), to pick the
latest reading by *date* rather than array position, and to return `none` — "I
cannot say" — instead of guessing. Reverting the file to the original now turns
10 of its 16 tests red, which is the actual check that the fixes mean
something.

### 4. A hook that returned a cleanup function from the wrong place

A generated `useQueryOnce` returned its cancellation cleanup out of a
`useCallback` and cast the result to make TypeScript stop complaining. It
typechecked and would have leaked a stale `setState` on every unmount. Replaced
with a plain effect keyed on a counter.

## What AI was genuinely good at

Mechanical breadth: writing six screens' worth of `StyleSheet.create` blocks
from a described layout, filling out a test suite once the first few cases set
the pattern, and keeping JSDoc consistent across forty files. That is the work
that would otherwise have eaten the time budget, and it is also the work where
a mistake is cheap and visible.
