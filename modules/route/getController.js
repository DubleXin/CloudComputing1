import { RouteControllerBase } from './routeControllerBase.js';

export class GetController extends RouteControllerBase {
  constructor(app) {
    super(app);
  }
  _init() {
    super._init();
    this._app.get('/', (_req, res) => {
      return res.render('index');
    });
    this._app.get('/test', (_req, res) => {
      return res.send('the get route "/test"');
    });
  }
}
