# Edu.Chat Style Guide

## Introduction

This document lays out the basics of coding style for JavaScript and JSX code written for Edu.Chat.
It was assembled and adapted from multiple sources, using the best judgements of the author based
on our chosen tools and workflow. JavaScript code checked in to an Edu.Chat project should follow
this guide without solid reasoning otherwise.

## The Basics

We use the following basic conventions and tools for all code:
* Line length limit of 100 columns
* Indentation in increments of two spaces (NOT tab characters)

All JavaScript code is compiled with Babel using the `ES2017` preset plus
`transform-class-properties` and `transform-decorators-legacy`. When writing JSX code,
appropriate additional plugins may be used. Due to limitations in debugging tools,
some plugins may be disabled for development builds if the relevant features are supported by
modern browsers.

## JavaScript Style

Our JavaScript style is adapted from the [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html).
Refer to that document and adhere to its policies on all points not explicitly overridden below:
* Ignore parts about Google's internal systems for `import` statements and type checking.
  We use ES2015 module syntax and optional Flow type annotations where they improve readability.
* Filenames should be all lowercase and separated by hyphens (ex: `some-file.js`).
* Do **not** use trailing commas.

  ```jsx
  // Bad
  someFunctionCall(arg1, arg2,);

  // Good
  someFunctionCall(arg1, arg2);
  ```

* Nested destructuring is **allowed** due to the shape of several APIs we use.

  ```jsx
  // This is okay
  const {foo: {bar}} = someApiCall();
  ```

* If you make an enum, it should be wrapped in `Object.freeze()`.

  ```jsx
  // Bad
  const SomeEnum = {
    ONE: 1,
    TWO: 2
  };

  // Good
  const SomeEnum = Object.freeze({
    ONE: 1,
    TWO: 2
  });
  ```

* Class properties should be declared using ESNext property initializer syntax.
	Do this even if the property has no initial/default value as it does allow the
	JS engine to optimize the class more. Class properties should always be followed
	by a semicolon.

  ```jsx
  // Bad
  class Foo {
    constructor(x) {
      this.baz = undefined;
      this.quux = 3;
      this.x = x;
    }
  }

  // Very Bad
  class Foo {
    constructor(x) {
      // baz only created later
      this.quux = 3;
      this.x = x;
    }
  }

  // Good
  class Foo {
    baz;
    quux = 3;
    x;

    constructor(x) {
      this.x = x;
    }
  }
  ```

* Mixins are not forbidden. However, they should be declared as decorators.

  ```jsx
  // Avoid this unless it's not a class or you need the undecorated version
  class Foo {
    // ...
  }
  export default mixin(Foo);

  // Good
  @mixin
  export default class Foo {
    // ...
  }
  ```

* As we are not using Google's compiler, computed properties aren't as bad a thing, but you
	should still have good reason before using them.
* Definitely prefer arrow functions to use of `Function#bind()`. Especially in the case of
	React component methods, in which case they should be assigned as a
	property initializer, as this is more memory efficient due to React internals.

  ```jsx
  // Bad
  class Foo extends Component {
    someMethod() {
      // ...
    }

    render() {
      return <SomeElement handler={this.someMethod.bind(this)}/>;
    }
  }

  // Good
  class Foo extends Component {
    someMethod: () => {
      // ...
    };

    render() {
      return <SomeElement handler={this.someMethod}/>;
    }
  }
  ```

* Use double quotes instead of single quotes as this is more consistent with other C-family
	languages, as well as with JSON notation.

  ```jsx
  // Bad
  'This is a string'

  // Good
  "This is a string"
  ```

* Without a custom compiler, subclassing Error can lead to unintentional issues.
	It is therefore allowed to throw non-Error objects **IF** they are **CONSISTENT**
	(the same function must always either throw Errors or non-Errors, and the same
	function's non-Error throws should have a similar form).
	Do **NOT** throw non-Objects (Arrays, strings, etc.).
  **PREFER** Errors to non-Errors when possible.

  ```jsx
  // Bad: Mixes Errors with non-errors
  function(x) {
    if (x) throw new Error("foo");
    else throw {bar: true};
  }

  // Also Bad: Thrown objects have unrelated form
  function(x) {
    if (x) throw {x: true};
    else throw {error: "x was false"};
  }

  // Still Bad: Thown value is not an object
  function(x) {
    if (x) throw "This is not an Object";
  }
  ```

* If you need to create a sentinal value (An exported constant that can be used to check a
	condition), use the pattern:

  ```jsx
  export const SOME_SENTINAL = {valueOf: () => "Some human-readable string"};
  ```

	This avoids the false-positives that arise from using plain strings or numbers.
* If notating a method or field as private, prefer `_name()` to `name_()`
* JSDoc is an admirable goal, but I've found that there are not yet any tools for it that
	can handle ES2015+ syntax well yet. So really just comment methods when you feel
	their purpose is not obvious
* Clarification of the rules for line-wrapping function arguments:

  ```jsx
  // Bad
  someFunction(longArg1, longArg2, longArg3,
    longArg4, longArg5);

  // Good (note that the start of the lines line up)
  // This is also the option that should be used for long parameter lists in function declarations
  someFunction(longArg1, longArg2, longArg3,
               longArg4, longArg5);

  // Also good (note that the list is indented two levels)
  someFunction(
      longArg1,
      longArg2,
      longArg3,
      longArg4,
      longArg5
  );
  ```

  Addintionally, if you find that you need to wrap a function call where one of the arguments is
  already a multi-line structure, prefer the last option.

  ```jsx
  // Bad
  someFunction(arg1, x => {
    // ...
  }, arg3, arg4, arg5,
  arg6, arg7);

  // Good
  someFunction(
      arg1,
      x => {
        // ...
      },
      arg3,
      arg4,
      arg5,
      arg6,
      arg7
  );
  ```

* It is acceptable to put the return statement of a bodiless arrow function on a new line, indented.
  If you do this with a callback, but the closing paren on a new line,
  as if the function had a body.

  ```jsx
  // This is okay
  const arrowFn = (...args) =>
    doSomethingLongWithArgs(...args);

  // Note the position of the closing paren
  someArray.map(el =>
    doSomethingLongWithEl(el)
  );
  ```

### Additional Rules

These are rules being *added* to the Google style guide. They pertain less to formatting and more
to language best practices and error prevention. All points listed here correspond directly to an
ESLint error that has been enabled.

* Functions should have consistent return statements. A function should either *always* return a
  value, or *never* do so.

  ```jsx
  // Bad
  function bad(x) {
    if (x) return 2;
    else return;
  }

  // Good
  function good(x) {
    if (x) return 2;
    else return 0;
  }

  // If you really need to return undefined, do it explicitly
  function okay(x) {
    if (x) return 2;
    else return undefined;
  }
  ```
* Comparisons **must** use `===` instead of `==`
* Do not use `alert`, `prompt`, or `confirm`
* Blocks condensed to a single line **must** be padded with spaces

  ```jsx
  // Bad
  if (foo) {bar();}

  // Good
  if (foo) { bar(); }
  ```

* Expressions broken up into multiple lines **must** put the operators on the beginnings of the
  lines

  ```jsx
  // Bad
  if (
    cond1 ||
    cond2
  )

  // Good
  if (
    cond1
    || cond2
  )
  ```

  The exceptions to this are the ternary operator and the assignment operator

  ```jsx
  // Ternaries should look like this
  const thing = cond ?
    foo :
    bar;

  // Not like this
  const thing = cond
    ? foo
    : bar;


  // Assignments with long values should look like this
  const foo =
    doSomethingReallyLong();

  // Not this
  const foo
    = doSomethingReallyLong();
  ```

## JSX Style

This portion of the style guide is adapted from the AirBnB JSX style. However there are many more
differences and therefore the entirety of the relevant points are reproduced below:

### Basic Rules

- Only include one React component per file.
    - However, multiple [Stateless, or Pure, Components](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions) are allowed per file.
- Always use JSX syntax.
- Do not use `React.createElement` unless you're initializing the app from a file that is not JSX.

### Component Declarations

Prefer stateless functions to full React components.

When declaring a stateful component, prefer the ES2015 class syntax.

```jsx
// Bad
React.createClass({
  render() {

  }
});

// Good
class SomeComponent extends Component {
  render() {

  }
}
```

When declaring a stateless component, prefer bodiless arrow functions

```jsx
// Bad
function SomeComponent({prop1, prop2}) {
  return (
    <div>
      {/* ... */}
    </div>
  );
}

// Good
const SomeComponent = ({prop1, prop2}) =>
  <div>
    {/* ... */}
  </div>;
```

Sometimes stateless components need to use the class syntax in order to bind callbacks.
In this case, extend `PureComponent` instead of `Component`.

### Use of Component State

In general, always prefer Redux state to component state (`setState`).
ESLint is configured to warn about the use of local state.
However, there are a limited set of circumstances in which it is simpler, and therefore allowed,
to use local state. Before doing this you should think if there is any elegant way to integrate the
data into Redux, and check with a team member if you are unsure.

With that said, you can use component state for values with ALL of the following properties:
* The state is completely internal.
  No other component should ever need or affect the value of the state.
  If another component needs the state, put it in Redux.
  If another component edits the state, it should either go in Redux or be passed in as a prop.
* The state is related only to the UI. That is to say, if the app were running without a UI, it
  would not be necessary.
  If the state is non-UI-related, it should go in the core Redux store.
* The state is not complex. This means that it is either a primitive value or an object of a
  non-container type that represents a single cohesive value.
  Complex values should go in the Redux store.

  ```jsx
  // These are all complex values

  // Container types are types that represent collections of one or more other values
  [1, 2, 3] // Array
  new Map([[1, "a"], [2, "b"], [3, "c"]]) // Map
  Immutable.List([1, 2, 3]) // List

  // Ex nihilo objects are also complex
  {
    anObjectWithArbitraryShape: true,
    andMultipleValues: true
  }


  // These are allowable (non-complex) object values
  fileInput.files[0] // An HTML File
  new Date() // A Date
  new ModelItem() // An existing class, imported from another file, representing one conceptual item
  ```

* The state cannot be derived from any other data. If it can be derived, it should be computed
  either as a computed property or a local variable (if it's derived from local component state), or
  inline within the call to `@connect` (if it's derived from Redux values).
* If the state were stored in Redux, it would only require a minimum of a single action
  to make sense. Convenience actions (such as "CLEAR" setting the value to `null`) do not count
  against this rule.

If you do, after considering all of these rules, wish to use local component state, place the
following comment directly before the class declaration:

`/* eslint-disable react/no-set-state */`

The state object should be initialized as a property initializer.
Individual fields can then be further set up in the constructor, if necessary.

```jsx
// Example of setting up state
export default class SomeComponent extends Component {
  state = {
    prop1: 0,
    prop2: false,
    prop3: null
  };

  constructor(props) {
    super(props);
    const {foo} = props;
    this.state.prop3 = foo;
  }
}
```

### Accessing Props

Always use destructuring to access props

```jsx
// Bad
render() {
  return <SomeComponent thing={this.props.foo} otherThing={this.props.bar}/>;
}

// Good
render() {
  // You should have a single destructuring declaration at the top of render()
  const {foo, bar} = this.props;
  return <SomeComponent thing={foo} otherThing={bar}/>;
}

// Bad
const SomePureComponent = (props) => <SomeComponent thing={props.foo} otherThing={props.bar}/>;

// Good
const SomePureComponent = ({foo, bar}) => <SomeComponent thing={foo} otherThing={bar}/>;
```

#### Exceptions

Bodiless arrow function methods in a class-style component

```jsx
export default class SomeComponent extends Component {
  // This is okay as long as, without the destructuring, the function has no body
  someCallback: () => this.props.actions.someAction(this.props.someValue);
}
```

You may also directly access values when you need to disambiguate between a state value and a prop
within the same scope

```jsx
someFunc()
{
  const {bar} = this.props;

  // This is okay
  doAThing(this.state.foo, this.props.foo);
  // Note that non-conflicting values should still be destructured
  doAnotherThing(bar);
}
```

### Naming

* All React components should be named in PascalCase, even if they are pure.
* When creating a higher-order component (a decorator designed for React components),
  set the component's `displayName` to `WrapperName(WrappedComponentName)`
* Don't declare props on a Component with the same names as DOM properties
* Always use camelCase for prop names

### Line Wrapping

If an element's props cannot fit on a single line, wrap the same way as a function call,
with the closing angle bracket on its own line and the props indented two levels.

```jsx
// Bad
<SomeComponent prop1="foo" prop2="bar"
  prop3="baz" prop4="quux">
  <button/>
</SomeComponent>

// Good
<SomeComponent
    prop1="foo"
    prop2="bar"
    prop3="baz"
    prop4="quux"
>
  <button/>
</SomeComponent>
```

### Spacing

* Do not add extra space before the closing angle bracket of a tag

  ```jsx
  // Bad
  <SomeComponent />

  // Good
  <SomeComponent/>
  ```

* Do not pad braces with spaces

  ```jsx
  // Bad
  <SomeComponent prop={ foo }/>

  // Good
  <SomeComponent prop={foo}/>
  ```

### Props

- Omit the value of the prop when it is explicitly `true`.

  ```jsx
  // bad
  <Foo hidden={true}/>

  // good
  <Foo hidden/>
  ```
- Always include an `alt` prop on `<img>` tags. If the image is presentational,
  `alt` can be an empty string or the `<img>` must have `role="presentation"`.

  ```jsx
  // bad
  <img src="hello.jpg"/>

  // good
  <img src="hello.jpg" alt="Me waving hello"/>

  // good
  <img src="hello.jpg" alt=""/>

  // good
  <img src="hello.jpg" role="presentation"/>
  ```

- Do not use words like "image", "photo", or "picture" in `<img>` `alt` props. eslint:
  [`jsx-a11y/img-redundant-alt`](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt.md)

  > Why? Screenreaders already announce `img` elements as images,
  > so there is no need to include this information in the alt text.

  ```jsx
  // bad
  <img src="hello.jpg" alt="Picture of me waving hello"/>

  // good
  <img src="hello.jpg" alt="Me waving hello"/>
  ```

- Avoid using an array index as `key` prop, prefer a unique ID. ([why?](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318))

  ```jsx
  // bad
  {todos.map((todo, index) =>
    <Todo
        {...todo}
        key={index}
    />
  )}

  // good
  {todos.map(todo =>
    <Todo
        {...todo}
        key={todo.id}
    />
  )}
  ```

- Always define propTypes for props
- Always define explicit defaultProps for all non-required props.

  > Why? propTypes are a form of documentation, and providing defaultProps means the reader of your
  > code doesn’t have to assume as much.
  > In addition, it can mean that your code can omit certain type checks.

  ```jsx
  // bad
  const SFC = ({foo, bar, children}) =>
    <div>{foo}{bar}{children}</div>;

  SFC.propTypes = {
    foo: PropTypes.number.isRequired,
    bar: PropTypes.string,
    children: PropTypes.node,
  };

  // good
  const SFC = ({foo, bar}) =>
    <div>{foo}{bar}</div>;

  SFC.propTypes = {
    foo: PropTypes.number.isRequired,
    bar: PropTypes.string,
  };
  SFC.defaultProps = {
    bar: '',
    children: null,
  };
  ```

### Refs

Always use ref callbacks.

> Why? String refs are a legacy/deprecated feature and will eventually be removed from React

```jsx
// bad
<Foo ref="myRef"/>

// good
<Foo ref={(ref) => this.myRef = ref}/>
```

### Parentheses

When returning multiple lines of JSX, always wrap it in parens.

```jsx
// bad
render() {
  return <MyComponent className="long body" foo="bar">
            <MyChild/>
          </MyComponent>;
}

// good
render() {
  return (
    <MyComponent className="long body" foo="bar">
      <MyChild/>
    </MyComponent>
  );
}

// good, when single line
render() {
  const body = <div>hello</div>;
  return <MyComponent>{body}</MyComponent>;
}
```

### Closing Tags

Always self-close tags that have no children.

```jsx
// bad
<Foo className="stuff"></Foo>

// good
<Foo className="stuff"/>
```

### Conditionals

* For all conditionals, put the condition on its own line and indent the content **unless** the
  entire expression can fit neatly on one line and returns elements with no children.
  If the indented conditional is surrounded by braces, the closing brace should be on its own line,
  like the closing brace of a block.

  ```jsx
  // Bad
  <div>
    {someBool ? <div className="foo"><span className="bar">{this.props.something}</span></div> :
    <i className="fa-spinner"/>}
  </div>

  // Good
  <div>
    {someBool ?
      <div className="foo">
        <span className="bar">{this.props.something}</span>
      </div>
      :
      <i className="fa-spinner"/>
    }
  </div>

  // Okay: Expression is short
  <div>
    {someBool && <SomeShortElement/>}
  </div>
  ```

* For conditionals without an "else" case, you *must* use `&&` instead of `?:`.

  ```jsx
  // Bad
  {someBool ? <MyComponent/> : ""}

  // Good
  {someBool && <MyComponent/>}
  ```

* For conditionals with an "else" clause, use the ternary operator. The colon should go on its own
  line, at the same indentation level as the content, to clearly separate the cases.

  ```jsx
  // Bad
  {someBool ?
    <div>
      <ABunchOfComplexMarkup/>
    </div> :
    <span>
      <SomethingElseEntirely/>
    </span>
  }

  // Good
  {someBool ?
    <div>
      <ABunchOfComplexMarkup/>
    </div>
    :
    <span>
      <SomethingElseEntirely/>
    </span>
  }
  ```

* Compound conditons (containing `&&` or `||`) **must** be surrounded in parentheses.
  Non-compond conditions **may** be surrounded by parentheses, but are not required to be.

  ```jsx
  // Bad: Might not even render correctly
  {bool1 && bool2 || bool3 &&
    <SomeStuff/>
  }

  // Good
  {(bool1 && bool2 || bool3) &&
    <SomeStuff/>
  }

  // Okay
  {(bool) &&
    <SomeStuff/>
  }
  ```

### Method Ordering for Component Classes

1. optional `static` methods
1. `constructor`
1. `getChildContext`
1. `componentWillMount`
1. `componentDidMount`
1. `componentWillReceiveProps`
1. `shouldComponentUpdate`
1. `componentWillUpdate`
1. `componentDidUpdate`
1. `componentWillUnmount`
1. *clickHandlers or eventHandlers* like `onClickSubmit()` or `onChangeDescription()`
1. *getter methods for `render`* like `getSelectReason()` or `getFooterContent()`
1. *optional render methods* like `renderNavigation()` or `renderProfilePicture()`
1. `render`

## Library Code

There are a couple of libraries in use for which conventions are useful to establish

### Redux/Immutable.JS/react-redux

* The Redux store should be shaped like the data it contains when at all possible.
  State that is purely UI related should be placed under a `ui` subkey (e.g., `state.ui.leftPanel`).
* All sections of the Redux store should be defined as an `Immutable.Record` class, which should
  be exported for sake of testing. The default value of the `state` argument to the reducer should
  be a new instance of this type.

  ```jsx
  // reducers/foo.js

  export const FooState = Immutable.Record({
    baz: null,
    quux: 0
  });

  export default function(state = new FooState(), action) {
    switch (action.type) {
      // ...
    }
  }
  ```

* All data saved to the Redux store should be converted into an `Immutable.JS` type unless it is
  incredibly impractical or impossible to do so.
* Use `Record` types over `Map`s whenever possible. Avoid designing the store in such a way that a
  component would have to know to call `.get()` outside of `@connect` on something that isn't
  obviously a `Map`.
* Actions should be defined in collections of named export functions that take arguments
  and output a simple object with a `type` field defined as a CONSTANT_CASE string.

  ```jsx
  // actions/foo.js

  export const fooAction = (arg1, arg2) => ({type: "FOO_ACTION", arg1, arg2});
  // ...
  ```

* `@connect` should be used with at minimum the first two arguments.
  Use a bodiless arrow function for the first argument if possible.

  ```jsx
  // Bad: Overly verbose
  @connect(function(state) {
    return {
      prop1: state.someSection.prop1,
      // ...
    }
  }, {
    action1,
    // ...
  })
  export default class SomeComponent extends Component {
    // ...
  }

  // Bad: Doesn't map actions (omits second argument)
  @connect(state => ({
    prop1: state.someSection.prop1,
    // ...
  }))
  export default class SomeComponent extends Component {
    // ...
  }

  // Good
  @connect(state => ({
    prop1: state.someSection.prop1,
    // ...
  }), {
    action1,
    // ...
  })
  export default class SomeComponent extends Component {
    // ...
  }
  ```

* Do not use `this.props.dispatch` inside a component. Use the second argument of `@connect`.

  ```jsx
  // Bad
  @connect(state => ({
    prop1: state.someSection.prop1,
    // ...
  }))
  export default class SomeComponent extends Component {
    handleEvent() {
      this.props.dispatch(someAction());
    }
  }

  // Good
  @connect(state => ({
    prop1: state.someSection.prop1,
    // ...
  }), {
    action1,
    // ...
  })
  export default class SomeComponent extends Component {
    handleEvent() {
      this.action1();
    }
  }
  ```

### Redux-Saga

* Prefer `call` to directly yielding a `Promise`, unless you are calling a function that is
  completely internal to the saga (like a method on an API object).
* Prefer `call` to directly yielding the result of calling another generator, unless it is
  completely internal to the saga (like a method on an API object). In this case, use `yield*`
  instead of `yield`.
* In situations where you are yielding multiple effects, check to see if they have a logical order
  between them. If the order is arbitrary, yield an array instead.
* Use `takeEvery` or `takeLatest` unless you have a good reason to write something more complex.
