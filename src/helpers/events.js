import memoize from "./memoize";

export const onEnterKey = memoize(fn => ev => ev.key === "Enter" && fn(ev));

export const withDefaultPrevented = memoize(fn => ev => {
  ev.preventDefault();
  fn(ev);
});

export const withPropagationStopped = memoize(fn => ev => {
  ev.stopPropagation();
  fn(ev);
});

export const stopAndPrevent = memoize(fn => ev => {
  ev.stopPropagation();
  ev.preventDefault();
  fn(ev);
});

export const withTargetValue = memoize(fn => ev => fn(ev.target.value));
