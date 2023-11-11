const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('암호화할 문자열을 입력해주세요: ', function(input) {
    bcrypt.hash(input, 10, function(err, hash) {
        if (err) {
            console.error('암호화 도중 오류가 발생했습니다: ', err);
            return;
        }
        console.log('암호화된 문자열: ', hash);
        rl.close();
    });
});