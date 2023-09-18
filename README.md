# StorageManager

A little way to control Cookies, LocalStorage and SessionStorage without tears

## Install

```bash
npm install storage-manager-js
# or
yarn add storage-manager-js
# or
pnpm add storage-manager-js
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

type MyCookieStorage = {}

// get all cookies as object
Cookie.json<T>()

// check if key exist in cookies
Cookie.has("token")

// delete one cookie by key
Cookie.delete("token")

// delete all cookies
Cookie.deleteAll()
```

# Example using `LocalStorage`. The same can be done using `SessionStorage`

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
- `json<T>(parse: boolean = false): T`: get all storage as object. You can pass a boolean to parse or not your content using `JSON.parse` on your storage. Cookie manager always parse your content.
- `set(key: string, object: any, parameters?: CookieSettings): void`: save `key` with `value` in your current storage. Note for Cookie:
- `listener(listener: (storage: any) => void): void`: A function that takes the entire storage as parameters and will be called after each change in your storage
- `clearListener(): void`: clear all listeners at your storage

```typescript
// Cookie.set has this optional arguments
export type SetCookies = Partial<{
    domain: string; // the domain of cookies
    expires: CookieAge; // expires in
    maxAge: CookieAge; // maxAge of cookie
    multiDomain?: boolean; // apply multi domain logic
    partitioned: boolean; // 
    path: string; // the path that cookie will be used
    sameSite: "strict" | "lax" | "none" | ""; // same site rules
    useSecure: boolean; // http or https accepted
}>;
```

## References

* Inspired on my experience on using [js-cookie/js-cookie](https://github.com/js-cookie/js-cookie)
* [RFC 6265](https://tools.ietf.org/html/rfc6265)
