var sha256 = require('js-sha256');

class UserRepository {

    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        return this.dao.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT, picture TEXT)');
    }

    create(username, email, password, picture) {
        var hash = sha256.create();
        return this.dao.run('INSERT INTO user (username, email, password, picture) VALUES (?, ?, ?, ?)', [username, email, hash.update(password).hex(), picture]);
    }

    getByUsernameAndPassword(username, password) {
        var hash = sha256.create();
        return this.dao.get('SELECT * FROM user WHERE username = ? AND password = ?', [username, hash.update(password).hex()]);
    }
}

module.exports = UserRepository;
