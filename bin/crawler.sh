#!/bin/sh

for YEAR in {2007..2015};
do
  for MONTH in {1..12};
  do
    FNAME=$YEAR-$MONTH-B1.html
    SJIS_PATH=../data/html/sjis/$FNAME
    UTF8_PATH=../data/html/utf8/$FNAME
    wget "http://somethinjazz.sakura.ne.jp/sche3/sche35.cgi?cm=&year=$YEAR&mon=$MONTH" -O $SJIS_PATH
    cat $SJIS_PATH | nkf -u > $UTF8_PATH

    FNAME=$YEAR-$MONTH-B2.html
    SJIS_PATH=../data/html/sjis/$FNAME
    UTF8_PATH=../data/html/utf8/$FNAME
    wget "http://somethinjazz.sakura.ne.jp/sche2/sche35.cgi?cm=&year=$YEAR&mon=$MONTH" -O $SJIS_PATH
    cat $SJIS_PATH | nkf -u > $UTF8_PATH

  done;
done;
