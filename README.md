# BookingHub development scaffold

BookingHub adds a React remote and a NestJS service to the existing shell and virtualization application.

## Requirements

Use Node.js 22.12+ or Node.js 24 and npm. The scaffold was built with Node.js 24.

## Install and start

From the repository root, run the following commands.

```sh
npm run setup
npm run dev
```

Open [BookingHub in the shell](http://localhost:5173/bookings) or [Virtualization](http://localhost:5173/).

The root development command builds both remotes first, then starts their build watchers and preview servers, the NestJS watcher, and the shell. Ctrl+C stops the child process groups. A child process exiting stops the remaining development processes.

| Application | Local URL |
| --- | --- |
| Shell | http://localhost:5173 |
| Virtualization remote | http://localhost:3001 |
| BookingHub remote | http://localhost:3002 |
| Booking service health | http://localhost:5001/api/bookings/health |
| Demo events | http://localhost:5001/api/bookings/events |

Shell navigation uses ordinary links. The shell lazy-loads the remote for the current path and provides a Suspense fallback and an error boundary.

The existing Express service remains available through its own commands in `server`. Start it separately with `npm --prefix server run dev` when needed. BookingHub uses the NestJS service on port 5001.

## Module Federation development

OriginJS supports the host through the Vite development server. Remotes generate `assets/remoteEntry.js` during a Vite build. The integrated workflow serves those built files with `vite preview` and rebuilds them with `vite build --watch`. Refresh the browser after a remote rebuild. Standalone Vite development provides the usual frontend HMR.

Both remotes and the shell share `react` and `react-dom`. All three packages use matching React version ranges.

See the [OriginJS development documentation](https://github.com/originjs/vite-plugin-federation#vite-dev-mode).

## Standalone BookingHub

Run the following commands in separate terminals.

```sh
npm --prefix services/booking-service run start:dev
```

```sh
npm --prefix apps/booking-hub run dev
```

Open http://localhost:3002. Stop the integrated development command before using the standalone frontend because both modes use port 3002.

## Request path

```text
Browser at localhost:5173/bookings
  Shell loads BookingHub from localhost:3002/assets/remoteEntry.js
  RTK Query requests /api/bookings/events on localhost:5173
  Shell Vite proxy forwards to localhost:5001/api/bookings/events
  EventsController calls EventsService
  Service returns two explicitly marked in-memory demo events
```

The BookingHub standalone development server and preview server also proxy `/api/bookings` to the NestJS service. The API base URL stays relative to the browser origin.

## Environment configuration

Defaults work without `.env` files. Copy an example into `.env` in the same directory when overriding defaults.

| File | Variable | Default |
| --- | --- | --- |
| `apps/shell/.env` | `VITE_VIRTUALIZATION_REMOTE_URL` | `http://localhost:3001/assets/remoteEntry.js` |
| `apps/shell/.env` | `VITE_BOOKING_HUB_REMOTE_URL` | `http://localhost:3002/assets/remoteEntry.js` |
| `apps/shell/.env` | `BOOKING_SERVICE_URL` | `http://localhost:5001` |
| `apps/booking-hub/.env` | `BOOKING_SERVICE_URL` | `http://localhost:5001` |
| `services/booking-service/.env` | `PORT` | `5001` |
| `services/booking-service/.env` | `MONGO_ENABLED` | `false` |
| `services/booking-service/.env` | `MONGO_URI` | Optional while MongoDB is disabled |

Vite reads remote URLs when it starts or builds. Restart Vite after editing its environment files. Rebuild the shell when changing remote URLs in a built shell. If changing the NestJS port, update `BOOKING_SERVICE_URL` in both frontend configurations.

NestJS validates the port and MongoDB environment settings at startup. Setting `MONGO_ENABLED=true` enables the prepared Mongoose connection and requires `MONGO_URI` and a running MongoDB instance. The initial scaffold starts with MongoDB disabled.

`server/.env` belongs to the existing Express service. BookingHub reads its own service environment file. `VITE_` values are public browser configuration.

## Build and check

```sh
npm run build
npm test
```

The build command typechecks and builds both remotes, the shell, and the NestJS service. The Jest tests initialize the NestJS application with MongoDB disabled and exercise health, demo events, and the missing booking-creation route. HTTP tests require permission to bind a local port.

With development servers running, check the proxy and both remote entries.

```sh
curl http://localhost:5001/api/bookings/health
curl http://localhost:5173/api/bookings/events
curl http://localhost:3002/api/bookings/events
curl -I http://localhost:3001/assets/remoteEntry.js
curl -I http://localhost:3002/assets/remoteEntry.js
```

For a built backend, run `npm --prefix services/booking-service run start:prod` after building. Vite preview supports local verification of built frontends. Production deployment needs an HTTP server configured to serve the shell routes and forward `/api/bookings` to the service.

## Learning work

The empty `dto`, `schemas`, `features/bookings`, and frontend `components` directories are reserved for your exercises.

Booking creation, transactions, authentication, idempotency, and MongoDB persistence are unimplemented. The demo event response exists only to exercise the frontend-to-controller-to-service path. Global `ValidationPipe` is ready for the DTOs you add.
