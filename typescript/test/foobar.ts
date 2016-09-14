import IM = require('../im');

let im = IM({
    app: '56a86320e9db7300015438f7',
    key: 'bWU4SS1uUEx6Z3lqeGwzMVdhRXVrZw',
    region: 'uat'
});

im.admin().search().forUsers((err, users)=> {
    for (let user of users) {
        console.log('=> user: %s', JSON.stringify(user));
    }
});