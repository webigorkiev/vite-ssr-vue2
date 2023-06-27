<p align="center">
  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://vitejs.dev/logo.svg" alt="Vite logo">
  </a>
</p>

# vite-ssr-vue2
> For building powerful Server Side Rendering APP with **Vite** ⚡(Next Generation Frontend Tooling)


## Features

- Fast HMR with vite
- Easy development start
- Small library size
- Compatible with Vite's plugin
- Flexible configuration and full control
- Support `shouldPreload` and `shouldPrefetch`

## Documentation

https://webigorkiev.github.io/vite-ssr-vue2/

## Installation

Create a normal Vite project for Vue2. (see tests/playground)

## Usage

```typescript
// entry-client.ts
import ssr from "vite-ssr-vue2/client";
import App from "./App.vue";

export default ssr(App);
```

```typescript
// entry-server.ts
import ssr from "vite-ssr-vue2/server";
import App from "./App.vue";

export default ssr(App);
```


There can be only one entry point for the server and for the client. Plugin automatically changes alias for SSR. If for some reason you need separate entry points, then specify the server side in the **ssr** parameter

<details><summary>Available options for Vite plugin</summary>
<p>

- `name`: plugin name (default: vite-ssr-vue2)
- `ssr`: server entry point

</p>
</details>

<details><summary>Available options for Vite plugin</summary>
<p>

- `created`: ({app, url, isClient, initialState}) - Hook that is called before each request, can be async. May return {router, store, head}
- `serializer`: Custom function for serialization initial state
- `shouldPreload`: shouldPreload aka [shouldPreload](https://ssr.vuejs.org/api/#shouldpreload)
- `shouldPrefetch`: shouldPrefetch aka [shouldPrefetch](https://ssr.vuejs.org/api/#shouldprefetch)
- `mount`: mount options for client side
- `rootProps`: root props

</p>
</details>

## Accessing context, res and req objects

In the built-in dev server, context, req, res objects are passing to created hook.
In production, you must pass these objects to the rendering function in order to have them available.

```typescript

({html} = await entry(url, {
    manifest,
    res,
    req,
    context
}));
```

## Redirect

The **redirect** method add to **res** object for development, and requires implementation in production.

## ClientOnly

Aka vite-ssr, vite-ssr-vue2 exports ClientOnly component that renders its children only in the browser:

```vue

import { ClientOnly } from "vite-ssr-vue2"

<div>
  <ClientOnly>
      <!--- your code  --->
  </ClientOnly>
</div>

```

## Production

Run `vite build` for buildling your app. This will create 2 builds (client and server) that you can import and use from your Node backend.

