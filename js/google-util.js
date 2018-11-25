const {google} = require('googleapis');

const googleConfig = {
    clientId: '820720206308-m5f88ojdrnaqnbn01kkkbi7t06f4asd0.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: 'CBDnvrZ9juMf1cs9JvczwNpi', // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: 'http://localhost/index.html' // this must match your google api settings
};

const oauth2Client =  new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
);

const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

const plus = google.plus({
    version : 'v1',
    auth : 'AIzaSyCZgO37EJWquaPaqaLCiLYLRsuU0RA4-OY'
})
 
const url = oauth2Client.generateAuthUrl({
    access_type : 'offline',
    prompt : 'consent',
    scope : defaultScope
});


function urlGoogle() {
    var electron = require('electron');
    var wind = new electron.remote.BrowserWindow({width: 500, height: 600})
    wind.loadURL(url);
    wind.webContents.on('will-navigate', async function (event, newUrl) {
        if(newUrl.substring(0,27) === 'http://localhost/index.html'){
            wind.close();
            console.log(newUrl);
            var code = newUrl.substring(33);
            console.log(code);
            var dd = await getGoogleAccountFromCode(code);
            
            main()
        }
    });
}

async function getGoogleAccountFromCode(code) {
    const {tokens} = await oauth2Client.getToken(code);
    console.log(tokens.access_token);
    oauth2Client.setCredentials(tokens);
}

async function main(){
    const res = await plus.people.get({
        userId : 'me',
        auth : oauth2Client
    });
    console.log(res.data.name.givenName);
    localStorage.setItem('user', res.data.name.givenName);
    document.getElementById("send").click();
}


  