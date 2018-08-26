tsc src/index.ts --module 'amd' --outFile build/tmp.js
uglifyjs --compress --mangle -o "build/index.js" -- "build/tmp.js"
rm -f "build/tmp.js"
