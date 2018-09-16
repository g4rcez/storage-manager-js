tsc
cat "build/index.js" > "build/tmp.js"
uglifyjs --compress --mangle -o "build/index.js" -- "build/tmp.js"
rm -f "build/tmp.js"
