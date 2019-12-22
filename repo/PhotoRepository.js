class PhotoRepository {

    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS photo (id INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, photo TEXT, CONSTRAINT photo_fk_user FOREIGN KEY (id_user) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE)';
        return this.dao.run(sql);
    }

    create(userId, photo) {
        return this.dao.run('INSERT INTO photo (id_user, photo) VALUES (?, ?)', [userId, photo]);
    }
}

module.exports = PhotoRepository;
