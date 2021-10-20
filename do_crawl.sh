#!/bin/sh
cp merged.tsv merged_bak.tsv
node index.js
# node index_englishonly.js
node merge-editorial.js
node excel.js
diff -q -s merged.tsv merged_bak.tsv
