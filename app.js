const express = require('express');
const request = require('request');
const path = require('path');
const app = express();
const port = 80;
app.use(express.json());

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const exchange = async (code) => {
    const options = {
        uri: 'https://oauth2.googleapis.com/token',
        method: 'POST',
        form: {
            client_id: '409609436792-bqv7lk3l8t21bdjm7hesbt9gkab00se1.apps.googleusercontent.com',
            client_secret: 'wRKTVLvhZ-vZqCejCD3ZBbJt',
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://test.kweboauth.kro.kr:80/auth'
        }
    }
    console.log(code);
    request.post(options, (err, res) => {
        if (err) {
            console.log(err);
        }
        else {
            let token = JSON.parse(res.body).access_token
            exchange.result = token;
            console.log(exchange.result);
        }
    });
    await sleep(500);
    return exchange.result;
};
const Profile = async (token) => {
    const options = {
        uri: "https://www.googleapis.com/oauth2/v2/userinfo",
        qs: {
            access_token: await token
        }
    };
    console.log(options);
    request(options, (err, res) => {
        Profile.result = res.body;
    });
    await sleep(500);
    console.log(Profile.result);
    return JSON.parse(Profile.result);
};
app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');
app.get('/', (req, res) => {
    let link = "https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile%20openid&openid.realm&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=http%3A//test.kweboauth.kro.kr%3A80/auth&client_id=409609436792-bqv7lk3l8t21bdjm7hesbt9gkab00se1.apps.googleusercontent.com";
    res.render('index.ejs', { link: link });
});
app.get('/auth', async (req, res) => {
    let token = exchange(req.query.code);
    let data = await Profile(token);
    res.render("profile.ejs", { data: data });
});
app.listen(port, () => console.log(`Server listening on port ${port}`));