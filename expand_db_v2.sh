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
   -v      Verbose
EOF
}

DBNAME=
USER=
PASSWD=
VERBOSE=
while getopts “hb:u:p:v” OPTION
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
mysql -u root -p $DBNAME < library.sql


echo "Database $DBNAME and user $USER created with a password $PASSWD"


cat > configDB.js <<EOF
var configDB = {};

configDB.host = 'localhost';
configDB.user ='$USER';
configDB.password = '$PASSWD';
configDB.database = '$DBNAME';

module.exports = configDB;
EOF
