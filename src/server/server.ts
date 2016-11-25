import * as express from 'express';
import * as path from 'path';
import * as stormpath from 'express-stormpath';

const app = express();

/**
 * The 'trust proxy' setting is required if you will be deploying your
 * application to Heroku, or any other environment where you will be behind an
 * HTTPS proxy.
 */
app.set('trust proxy', true);

/*
 We need to setup a static file server that can serve the assets for the
 angular application.  We don't need to authenticate those requests, so we
 setup this server before we initialize Stormpath.
 */
app.use('/', express.static(path.join(__dirname, '..'), {redirect: false}));

// Request logging
app.use(function (req, res, next) {
  console.log(new Date, req.method, req.url);
  next();
});

/**
 * Now we initialize Stormpath, any middleware that is registered after this
 * point will be protected by Stormpath.
 */
console.log('Initializing Stormpath');

app.use(stormpath.init(app, {
  application: {
    href: "https://api.stormpath.com/v1/applications/2gt0hZE4kPzmIrXPi2A1lb"
  },
  apiKey: {
    id: process.env.STORMPATH_CLIENT_APIKEY_ID,
    secret: process.env.STORMPATH_CLIENT_APIKEY_SECRET
  },
  web: {
    spa: {
      enabled: true,
      view: path.join(__dirname, '..', 'index.html')
    },
    me: {
      expand: {
        customData: true,
        groups: true
      }
    }
  }
}));

/**
 * Now that our static file server and Stormpath are configured, we let Express
 * know that any other route that hasn't been defined should load the Angular
 * application.  It then becomes the responsibility of the Angular application
 * to define all view routes, and redirect to the home page if the URL is not
 * defined.
 */
app.route('/*')
  .get(function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });

/**
 * Start the web server.
 */
app.on('stormpath.ready', function () {
  console.log('Stormpath Ready');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Application running at http://localhost:' + port);
});
