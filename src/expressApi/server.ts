import App from './App';

import { ProductsController } from './services/products/ProductsController';

const app = new App(3000);

app.listen();

export default app;