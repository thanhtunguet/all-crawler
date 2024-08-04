#!/usr/bin/env bash

source .env
yarn typeorm-model-generator -e mysql -h $DB_HOST -p $DB_PORT -u $DB_USERNAME -x $DB_PASSWORD -d $DB_DATABASE
rm -rf src/entities/
mv output/entities/ src/entities/
rm -rf output/
yarn node-index update src/entities/
yarn eslint --fix


