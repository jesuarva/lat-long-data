# LAT-LONG-DATA

An App to gather data and build stats for geo-coordinates.
Modular, scalable and able to process large data-sets from Api responses without blocking the main thread.

# To run the App

```bash
yarn
yarn dev
```

# Architecture

Base around the Module and Mediator pattern.
All modules are build with a loose-coupling approach.

### Modules

- Services
- Data
- Stats

### Mediator (App-Core)

- App.js
- controllers

## Services

Allows modularity and to facilitate incorporate new features.

`ServiceManager.js` is highly reusable.

The design consider a `controller` for each Service

## Data (database)

Store all data related to the geo-coordinates.
Allows to replace the current implementation with a connection to a DB.

## Stats

Stores possible statistics related to the geo-coordinates.
Allows to replace the current implementation with a connection to a DB.

## Controllers

Are the core of the App, orchestrated by `App.js`.
