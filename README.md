# Preon2 app staging

- Run 'yarn install' in the root of the project to install and build all packages
- cd into the dev-frontend folder and run yarn start to get the frontend working
- If any changes are made in lib-ethers, lib-base or lib-react packages, we'll need to run yarn prepare:<package_name> in the root of the project for that package to reflect changes in the frontend
