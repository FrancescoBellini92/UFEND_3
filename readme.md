## Udacity Front End ND project 3

This repo contains a simple web page for taking notes about weather-related feelings

BEM methodoloy has been applied to promote DRY code and style encapsulation, and a mobile-first approach was followed to good cross-device user experience.

API calls with sensitive data (i.e, API key) are done on the backend via a node-express server. This same server serves all assets to clients.

Client-side, js handles requests to-from the backend and UI update logic. Performance impact is kepts low by caching elements. Logic runs in an enclosed main function to avoid exposing global variables.


Project is deployed at https://ufend-weather-journal.herokuapp.com/

## Dependencies
Please refer to package.json for dependencies


## How to run
npm start will run the server, which is providing a small API as well as serving the main page
