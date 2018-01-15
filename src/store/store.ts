export class Store {
  private subscribers: Function[];
  private reducers: { [key: string]: Function };

  /**
   * This is intentionally `any`
   * allows us to add any type to our state tree
   */
  private state: { [key: string]: any };

  constructor(reducers = {}, initialState = {}) {
    this.subscribers= []; //
    this.reducers = reducers;
    this.state = this.reduce(initialState, {});
  }

  get currentState() { return this.state; }

  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn];
    this.notify();
    // returns unsubscibe method
    return () => this.subscribers = this.subscribers.filter((sub => sub !== fn));
  }

  dispatch(action) {
    /**
     * We are updating our state by iterating over the reducers
     * passing in the state for any actions that have been dispatched
     * the reducers will then compose the new state that will be rebound `this.state`
     */
    this.state = this.reduce(this.state, action);
    this.notify();
  }

  private notify() { this.subscribers.forEach(fn => fn(this.currentState)); }

  private reduce(state, action) {
    const newState = Object.create(null);

    for (const prop in this.reducers) {
      /**
       * we pass in state[prop] rather than the entire state,
       * this ensures a reducer only has access to their slice of state
      */
      newState[prop] = this.reducers[prop](state[prop], action);
    }

    return newState;
  }

}
