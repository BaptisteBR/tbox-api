var md5 = require('../node_modules/md5');

class UserRepository {

    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT, picture TEXT)';
        return this.dao.run(sql);
    }

    create(username, email, password, picture) {
        return this.dao.run('INSERT INTO user (username, email, password, picture) VALUES (?, ?, ?, ?)', [username, email, md5(password), picture]);
    }

    getByUsernameAndPassword(username, password) {
        return this.dao.get('SELECT * FROM user WHERE username = ? AND password = ?', [username, md5(password)]);
    }
}

module.exports = UserRepository;
