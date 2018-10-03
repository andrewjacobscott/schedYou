# electron-middle

electron-middle is a way to add middleware behaviour to electron apps

To install, run `npm install electron-middle`


## Example usage

This example will open a window that displays "Hello, world!"
```javascript
// index.js
// Run this file with electron:
//   electron index.js
const middle = require('electron-middle')

// This is where the magic happens
middle.get((file, cb) => {
  if (file === "/index.html") {
    // Calling cb with a string or a buffer will behave as if a file was
    // found with that string or buffer as its contents
    cb("<p>Hello, world!</p>")
  } else {
    // Calling cb with no parameters will pass the buck to the next
    // middleware, and if there is none, the default file fetcher will
    // simply try to load a local file
    cb()
  }
})


function createWindow () {
  let win = new BrowserWindow({width: 800, height: 600})
  
  win.loadURL(url.format({
    pathname: 'index.html',
    protocol: 'file:',
    slashes: true
  }))
}
```

## Usage

`middle.get()` takes a function with two arguments, `file` and `cb`.  
`file` is the path to the file that electron is trying to access. (As you can see in the example above, the file doesn't need to actually exist).  
`cb` is a function you must call exactly once, call it with a string or a [Buffer](https://nodejs.org/api/buffer.html) if successful, or empty to let the next, or default handler deal with the request.

## Example implementation

Here is the main code for [electron-middle-pug](https://github.com/Bradshaw/electron-middle-pug), a middleware to compile `.pug` files to `.html`

```javascript
// electron-middle-pug: index.js
const middle = require('electron-middle')
const pug = require('pug')
const fs = require('fs')
const path = require('path')

middle.get((file, cb) => {
  let ext = path.extname(file);
  if (ext == '.html') {
    let pugfile = file.replace('.html', '.pug')
    fs.access(pugfile, err => {
      if (err) {
        cb()
      } else {
        compilePug(pugfile, cb)
      }
    })
  } else {
    cb()
  }
})

function compilePug(pugfile, cb) {
  fs.readFile(pugfile, (err, data) => {
    if (err) {
      cb()
    } else {
      let fn = pug.compile(data.toString(), {})
      let html = fn({})
      cb(html)
    }
  })
}
```