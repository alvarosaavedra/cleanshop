import App from './expressApi/App';
import {containerConfiguratorUseCases} from "./UseCases/inversify.config";
import {containerConfiguratorRepositories} from "./repositories/inversify.config";
import {containerConfiguratorApi} from "./expressApi/inversify.config";

const configurators = [
    containerConfiguratorUseCases,
    containerConfiguratorRepositories,
    containerConfiguratorApi
]

const app = new App(3001, configurators);

app.listen();

export default app;