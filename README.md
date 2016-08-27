# library-portal
library portal helps admins to manage all readers and helps readers to see what books are available for them

## Authors

* Dmitriy Malyarenko (<dmitriy.malyarenko@gmail.com>)
* Alex Belokon (<info.tehnokot@gmail.com>)
* Konstantin Russo (<kstn.russo@gmail.com>)
* Serhii Kobzin (<serhii.kobzin@gmail.com>)
* Andrey Chudinovskyh (<andron989@gmail.com>)

## Getting Started

To get started with the library do the following steps:

#### Download

Clone the project, use the next command: 
```bash
git clone https://github.com/holateam/library-portal.git
```

#### Install dependencies

First, install nodejs if you had not already done. 
```bash
https://nodejs.org/en/
```

To install necessary packages open the root project folder in terminal, and use the next command:
```bash 
npm i 
```

#### Expand the database

To expand the database enter this command in the root of project:
```bash
sudo bash expand_db_v2.sh -b <library> -u <librarian> -p <password>
```


## What it takes to design the frontend?


#### 1. Install gulp globally:

__If you have previously installed a version of gulp globally, please run `npm rm --global gulp`
to make sure your old version doesn't collide with gulp-cli.__

```sh
$ npm install --global gulp-cli
```

#### 2. Enter the public directory and run the npm install:

```bash
cd public && npm install
```
#### 3. Install bower globally:

```sh
$ npm install -g bower
```

#### 4. install dependencies listed in bower.json:

```bash
$ bower install
```

#### 5. Run function gulp watch:

```bash
$ gulp watch
```
