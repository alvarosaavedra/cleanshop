import App from './App';
import {containerConfigurator} from "../inversify.config";

const app = new App(3001, [containerConfigurator]);

app.listen();

export default app;