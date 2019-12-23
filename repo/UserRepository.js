var sha256 = require('js-sha256');

class UserRepository {

    constructor(dao) {
        this.dao = dao;
        this.hash = sha256.create();
    }

    createTable() {
        return this.dao.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT, picture TEXT)');
    }

    create(username, email, password, picture) {
        return this.dao.run('INSERT INTO user (username, email, password, picture) VALUES (?, ?, ?, ?)', [username, email, this.hash.update(password).hex(), picture]);
    }

    getByUsernameAndPassword(username, password) {
        return this.dao.get('SELECT * FROM user WHERE username = ? AND password = ?', [username, this.hash.update(password).hex()]);
    }
}

module.exports = UserRepository;
