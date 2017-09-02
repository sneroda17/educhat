import memoize from "./memoize";

const makeOnChange = memoize((ctx, key) => ev => ctx.setState({[key]: ev.target.value}));

export default function bindState(ctx, key) {
  return {
    value: ctx.state[key],
    onChange: makeOnChange(ctx, key)
  };
}
