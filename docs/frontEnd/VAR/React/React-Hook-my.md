# useReducer
```js
/**
 * useReducer: (reducer, state) => [state, dispatch]
 * reducer: (state, action) => nextState
 * initialState: state
 * action: {type: string, ...others}
 * */
function useMyReducer(reducer, initialState) {
    const [state, setState] = useState(initialState)
    const dispatch = action => {
        setState(s => reducer(s, action))
    }
    return [state, dispatch]
}
```
