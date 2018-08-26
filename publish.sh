tsc src/index.ts --outFile build/tmp.js
uglifyjs --compress --mangle -o "build/index.js" -- "build/tmp.js"
rm -f "build/tmp.js"
