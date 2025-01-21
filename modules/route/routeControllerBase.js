export class RouteControllerBase {
  _app;
  constructor(app) {
    if (this.constructor == RouteControllerBase)
      throw new Error("Abstract classes can't be instantiated.");
    this._app = app;
    this._init();
  }
  _init() {}
}
