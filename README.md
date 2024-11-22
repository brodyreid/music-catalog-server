# music-catalog-server
## I will forget these commands... so I've documented some examples here.

`npx db-migrate create add-projects`
_(Use option `--sql-file` to generate raw sql migrations.)_

`npx db-migrate up`

`npx db-migrate down -c 1`
_rollback 1 step_

`npx db-migrate create:seed initial_seed`

`npx db-migrate up:seed` or `npm run migrate:dev` or `npm run migrate:sandbox`
