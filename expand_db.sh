#!/bin/bash
# Argument = -b dbname -u dbuser -p password -v

MYSQL=`which mysql`

usage()
{
cat << EOF
usage: $0 options

This script expand the database.

OPTIONS:
   -h      Show this message
   -b      Database name
   -u      DB username
   -p      DB user password
   -d   expand demo database (nonempty)
EOF
}

DBNAME=
USER=
PASSWD=
VERBOSE=
DBFILE='library.sql'
while getopts “hb:u:p:dv” OPTION
do
     case $OPTION in
         h)
             usage
             exit 1
             ;;
         b)
             DBNAME=$OPTARG
             ;;
         u)
             USER=$OPTARG
             ;;
         p)
             PASSWD=$OPTARG
             ;;
         d)
             DBFILE='./demo/demo.sql'
             cd ./public/img
             rm -rf books
             wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=0B2mfUDzNJYyfOHJ0dlpkNWhRYVk' -O books.zip
             unzip books.zip
             rm books.zip
             cd ../../
             ;;
         v)
             VERBOSE=1
             ;;
         ?)
             usage
             exit
             ;;
     esac
done

if [[ -z $DBNAME ]] || [[ -z $USER ]] || [[ -z $PASSWD ]]
then
     usage
     exit 1
fi

Q1="CREATE DATABASE IF NOT EXISTS $DBNAME;"
Q2="GRANT ALL ON *.* TO '$USER'@'localhost' IDENTIFIED BY '$PASSWD';"
Q3="FLUSH PRIVILEGES;"

SQL="${Q1}${Q2}${Q3}"

$MYSQL -uroot -p -e "$SQL"
mysql -u root -p $DBNAME < $DBFILE

cat > configDB.json <<EOF
{
    "host": "localhost",
    "user": "$USER",
    "password": "$PASSWD",
    "database": "$DBNAME"
}
EOF

cat > configAP.json <<EOF
{
    "username": "$USER",
    "password": "$PASSWD"
}
EOF
