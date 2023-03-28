# Envirodash
## Hosting
### Software
Everything below is running on a server running Proxmox Hypervisor, mostly inside of one Debian VM running Docker. 

The backend is hosted inside of a Docker container using a [Node image](https://hub.docker.com/_/node) running in a VM, just running normally with ports forwarded through the container. This connects to a MariaDB instance, again, running inside of a Docker container running on a separate VM. 

The frontend is hosted inside of an [Nginx docker image](https://hub.docker.com/_/nginx) with ports forwarded. Nothing special here, just static files to be served, built with details below.

Both the frontend and backend containers are created through use of Docker compose.
### Networking
Everything above is routed to using a separate instance of Nginx running in Docker on a separate VM. This uses LetsEncrypt issued SSL certificates and uses Dynu for dynamic DNS. 
## Code
Regular, modern format frontend + API website
#### Root Files
- `docker-compose.yml` docker compose config file
- `environment.env` environment variables passed through docker compose
### Frontend
Uses [Svelte](https://svelte.dev/) frontend framework with [Rollup](https://rollupjs.org/) module bundler to build into static code.
#### File Structure
I haven't included all files here, but the most notable ones are listed.
- `public/` build folder (also includes static assets)
- `scripts/` static scripts (none of my code...)
- `Dockerfile` Docker image config
- `src/` source code
	- `main.js` entrypoint
	- `App.svelte` basically index.html
	- `components/` components of site (sections in this case)

### Backend
Uses Node.js with [Express.js](https://expressjs.com/) as a basic web server. Connects to a [MariaDB](https://mariadb.org/) through the use of the [Sequelize](https://sequelize.org/) library (specific details mentioned in [hosting section](#hosting)).
#### File Structure
- `config/` config files such as database connection
- `models/` models for database tables
- `index.js` entrypoint
- `Dockerfile` Docker image configuration
