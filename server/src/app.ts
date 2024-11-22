import { Hono } from 'hono'
import "reflect-metadata"
import { AppDataSource } from './data-source'
import routes from './routes'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

AppDataSource.initialize().then(async () => {
  console.log('====================================\n');
  console.log("Server is running");
  console.log('====================================\n');

}).catch(error => console.log(error))

routes.forEach(({ path, route }) => {
  console.log(path);
  app.route(path, route);
});


export default {
  port: 5000,
  fetch: app.fetch,
};