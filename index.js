import express from "express";
import * as Sentry from "@sentry/node";
import errorHandler from './middleware/errorHandler.js';
import log from './middleware/logMiddleware.js';
import 'dotenv/config';
import loginRouter from './routes/login.js';
import amenitiesRouter from './routes/amenities.js';
import bookingsRouter from './routes/bookings.js';
import hostsRouter from './routes/hosts.js';
import reviewsRouter from './routes/reviews.js';
import propertiesRouter from './routes/properties.js';
import usersRouter from './routes/users.js';


const app = express();

Sentry.init({
  dsn: "https://332605fdf3cd36da8d0760da756dc1aa@o4506520569249792.ingest.sentry.io/4506637226409984",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Controllers
app.use(express.json());

app.use('/login', loginRouter);
app.use('/amenities', amenitiesRouter);
app.use('/bookings', bookingsRouter);
app.use('/hosts', hostsRouter);
app.use('/properties', propertiesRouter);
app.use('/reviews', reviewsRouter);
app.use('/users', usersRouter);


app.use(log);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});