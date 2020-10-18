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
import { serveFiles } from '@curveball/static';

const app = new Application();
app.use(
    serveFiles({
        // Absolute path to assets directory
        staticDir: `${process.cwd()}/assets`,
    })
);
```

API
---

The default export for this package is the `serveFiles` function. When called, this
function returns a middleware. It accepts a dictionary of configuration options.

### Options
- `staticDir` Absolute path to assets directory