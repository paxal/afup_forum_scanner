# Afup QRCode Scanner

Cette application ionic permet de scanner les codes.

## Installation

Il vous faut installer npm (peut être fourni avec nodejs en fonction de la plateforme)

Clonez le projet et lancez les commandes :

```
# Installation de ionic
npm install -g ionic # sudo si besoin
# Installation de gulp
npm install -g gulp # sudo si besoin
# Installation de bower
npm install -g bower # sudo si besoin
# Installation des dépendances du projet
npm install && bower install
# Ajout de la plateforme browser pour pouvoir tester
ionic platform add browser
```

## Compilation du projet

Il suffit de lancer gulp :

```
# Compilation du projet
gulp
```

## Tester l'application

```
# Tester l'application
ionic run -l # puis lancez votre navigateur sur l'url
```

## Tester l'application sur son téléphone

```
ionic share <EMAIL>
```

Ou alors configurez-vous un compte ionic et faites

```
ionic upload
```

