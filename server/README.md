# AFUP Scans Server Side

This is a Symfony 2 project that will save scans into a database.

## Install

Download [composer](http://getcomposer.org/download) and run

```
$ ./composer.phar install
```

to install the project

## Database

To install the database, simply run the following commands :

```bash
./app/console doctrine:database:create
./app/console doctrine:schema:update --force
```

## Security

The request security is handled via a single `X-Afup-Token` request header that
will be read in the `RequestListener` class : fast and simple.

The token security value is set in the `parameters.yml` file.

