const {app, protocol} = require('electron')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const tryEach = require('async').tryEach


function electronMiddle(){
  function getPath (url) {
    let parsed = require('url').parse(url)
    let result = decodeURIComponent(parsed.pathname)

    // Local files in windows start with slash if no host is given
    if (process.platform === 'win32' && !parsed.host.trim()) {
      result = result.substr(1)
    }

    return result
  }

  function defaultFileGet (file, cb) {
    fs.readFile(file, function handleFile (err, result) {
      if (err) {
        cb()
      } else {
        cb(result)
      }
    })
  }

  function createCallbackWrapper (file) {
    return function wrapCallback (fn) {
      return function wrappedCallback (cb) {
        fn(file
          ,function attemptCallback (data) {
            if (data) {
              cb(null, data)
            } else {
              cb(file+' not found')
            }
          }
        )
      }
    }
  }

  function createFetcher (file, callback) {
    return function fetcher (err, result) {
      if (!err){
        if (typeof result == 'string'){
          result = new Buffer(result)
        }
        callback({data: result, mimeType: mime.lookup(path.extname(file))})
      } else {
        console.error('MIDDLE: File not found: '+file)
      }
    }
  }
  
  function getProtocolRegisterceptor(proto) {
    return function registerceptor (request, callback) {
      let file = getPath(request.url)
      let wrapper = createCallbackWrapper(file)
      let fetcher = createFetcher(file, callback)
      let tries = stacks[proto].concat([defaultFileGet]).map(wrapper)
      tryEach( tries
        , fetcher
      )
    }
  }

  function doRegisterceptBufferProtocol (proto) {
    let registerceptor = getProtocolRegisterceptor(proto)
    return function (){
      protocol.registerBufferProtocol(proto
        , registerceptor
        , function handleRegisterBufferProtocolError (regerror) {
          if (regerror){
            protocol.interceptBufferProtocol(proto
              , registerceptor
              , function handleInterceptBufferProtocolError (interror) {
                if (interror){
                  console.error(
                    'MIDDLE: registerception failed for "'+proto+'":\n'
                    ,regerror,'\n'
                    ,interror
                  )
                }
              }
            )
          }
        }
      )
    }
  }
  
  function getFile(fn) {
    get('file', fn)
  }
  
  function get(proto, fn) {
    if (!stacks.hasOwnProperty(proto)){
      stacks[proto] = []
      app.on('ready', doRegisterceptBufferProtocol(proto))
    }
    stacks[proto].push(fn)
  }

  let stacks = {
  }
  
  return {
    get: (p, f) => {
      if (typeof p == 'string'){
        get(p, f)
      } else {
        getFile(p)
      }
    },
    getFile: (f) => {
      get('file', f)
    }
  }
}

function init () {
  if (!app.hasOwnProperty('middle')){
    app.middle = electronMiddle();
  }
}

module.exports = {
  get: (p, fn) => app.middle.get(p, fn),
  getFile: fn => app.middle.getFile(fn)
}

init()