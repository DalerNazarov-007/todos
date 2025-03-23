class Todo {
    constructor(id, title, description, isCompleted = false){
        this.id = id;
        this.title = title;
        this.description = description;
        this.isCompleted = isCompleted;
    }
}

module.exports = Todo;