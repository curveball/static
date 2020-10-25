Curveball Static File Middleware
=====================

This package is a middleware for [Curveball][1]. It serves static files from a directory.

Installation
------------

    npm install @curveball/static


Getting started
---------------

```typescript
import { Application } from '@curveball/core';
import serveFiles from '@curveball/static';

const app = new Application();
app.use(
    serveFiles({
        // Absolute path to assets directory
        staticDir: `${process.cwd()}/assets`,
    })
);
```


Serving files from a different directory
---------------
It is possible to serve files from a directory that doesn't math your request path.


For example:
| Static Dir          | Request URI       |
|---------------------|-------------------|
| `/home/app/static`  | `/assets/app.css` |

You would configure it like this:
```typescript
import { Application } from '@curveball/core';
import serveFiles from '@curveball/static';

const app = new Application();
app.use(
    serveFiles({
        // Absolute path to assets directory
        staticDir: `${process.cwd()}/static`,
        pathPrefix: '/assets',
    })
);
```

API
---

The default export for this package is the `serveFiles` function. When called, this
function returns a middleware. It accepts a dictionary of configuration options.

### Options
- `staticDir`: Absolute path to assets directory. Assets cannot be served above this directory
- `pathPrefix`: Request path to match if it differs from the static directory

[1]: https://github.com/curveball/
