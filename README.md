# StorageManager

A little way to control Cookies, LocalStorage and SessionStorage without tears

## Using

```javascript
import StorageManage from "./src/es6-code.js"

const storage = new StorageManage(); // if not pass, works with cookies
// new StorageManage('c') || new StorageManage('cookie') or new StorageManage() works with cookies
// new StorageManage('l') || new StorageManage('localstorage') works with LocalStorage
// new StorageManage('s') || new StorageManage('sessionstorage') or new StorageManage() works with SessionStorage

let test = {
    simple: if you pass a object, StorageManage automatically convert to string with JSON.stringify(),
    verySimple: if you try recover object, StorageManage automatically convert to object with JSON.parse()
}

let numericArray = [1,2,3,4,5,6,7,8,9,0] // if you use cookies, this transform in string
let users = [
    {username:"foo", repo :"bar"},
    {username:"bar", repo :"foo"},
] // if array[0] equals a object, StorageManage convert to Json string with JSON.stringify()

// Setting keys:values
storage.set("one","1"); // just set Cookie/LocalStorage/SessionStorage
storage.set("numbers",numericArray); // just set Cookie/LocalStorage/SessionStorage
storage.set("awesome", test) // set test object as string
storage.set("users", users) // set test object as string

storage.get("one") // return 1
storage.get("test") // return test as Json object (using JSON.parse())
storage.get("test", 'raw') // return string of test object (same as storage in Cookie/LocalStorage/SessionStorage)
// You can use 'raw' or 'r'
storage.get("users") // return Json object
storage.get("numbers") // return string
storage.get("numbers", "array") // return array (split with ',')
// You can use 'array' or 'a'

storage.unset("users") // delete key:value of 'users' in Cookies/LocalStorage/SessionStorage

storage.clean() // clean all keys:values in Cookies/LocalStorage/SessionStorage
```

## TODO List

- Generate automatic test
- Generate es5 or commonJs code
- Publish on NPM
## References
- [My testimonial in pt-br, on my blog](https://vandalvnl.github.io/developer/2018/03/28/storage-manage.html)
- [js-cookie/js-cookie](https://github.com/js-cookie/js-cookie)
- [RFC 6265](https://tools.ietf.org/html/rfc6265)
