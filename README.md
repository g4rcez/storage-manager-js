# StorageManager

A little way to control Cookies, LocalStorage and SessionStorage without tears

## Install

```bash
npm install storage-manager-js
# or
yarn add storage-manager-js
```

## Using

*Cookie, LocalStorage and SessionStorage has the same API, both implement [TypeStorage](https://github.com/g4rcez/storage-manager-js/blob/master/src/types.ts#L9)*

Using with cookies/document.cookie

```typescript
import { Cookie } from "storage-manager-js"


// get object or string from cookies
const token = Cookie.get("token") // at this moment, is undefined

// Learn more about cookies here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
// and here for useSecure/sameSite: https://www.chromestatus.com/feature/5088147346030592
// and here too https://www.chromium.org/updates/same-site
Cookie.set("token", token, { useSecure: false })


// get all cookies as object
Cookie.json()

// check if key exist in cookies
Cookie.has("token")

// delete one cookie by key
Cookie.delete("token")

// delete all cookies
Cookie.deleteAll()
```

```typescript
import { LocalStorage } from "storage-manager-js"


// get object or string from localStorage
const token = LocalStorage.get("token") // at this moment, is undefined

LocalStorage.set("token", token, { useSecure: false })

// get all storage
LocalStorage.json()

// check if key exist in storage
LocalStorage.has("token")

// delete one item by key
LocalStorage.delete("token")

// delete all items
LocalStorage.deleteAll()
```

## API Reference

- `delete(key: string): void`: Delete `key` from your current storage
- `deleteAll(): void`: Delete all keys from your current storage
- `get<T extends any>(key: string): T | string | undefined`: get the value of `key` from your current storage
- `has(key: string): boolean`: check if `key` exist in your current storage
- `json<T>(): T`: get all storage as object
- `set(key: string, object: any, parameters?: CookieSettings): void`: save `key` with `value` in your current storage. Note for Cookie:

```typescript
// Cookie.set has this optional arguments
{
	expires: number | string // when your cookie expires
	path: string // the path to save your cookie
	sameSite: "lax" | "strict" | "" // read more in https://www.chromestatus.com/feature/5088147346030592
	useSecure: boolean // read more in https://www.chromestatus.com/feature/5088147346030592
}
```

## References

* Inspired on my experience on using [js-cookie/js-cookie](https://github.com/js-cookie/js-cookie)
* [RFC 6265](https://tools.ietf.org/html/rfc6265)
