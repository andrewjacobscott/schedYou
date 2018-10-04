Download nodejs
nodejs.org/en/download

Run command:
npm i -D electron@latest
npm install

npm start to open app, package.json has the dependencies

index.js is the current "main" of the program

currently loads index.html for the window.



Create executable:

npm install electron-packager -g
electron-packager <sourcedir> <myappname> (will auto search platform 
info)

Will place create new folder in <sourcedir> to hold the executable.
