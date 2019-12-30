class TaskRepository {

    constructor(dao) {
        this.dao = dao;
    }

    createTable() {
        return this.dao.run(
            'CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, note TEXT, status INTEGER, CONSTRAINT task_fk_user FOREIGN KEY (id_user) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE)'
        );
    }

    create(userId, note) {
        return this.dao.run('INSERT INTO task (id_user, note, status) VALUES (?, ?, ?)', [userId, note, 0]);
    }

    update(id, status) {
        return this.dao.run('UPDATE task SET status = ? WHERE id = ?', [status, id]);
    }

    getByUserId(userId) {
        return this.dao.all('SELECT * FROM task WHERE id_user = ?', [userId]);
    }
}

module.exports = TaskRepository;
