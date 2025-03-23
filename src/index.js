const http = require("node:http")
const io  = require("./utensils/io")
const Todos = new io ("./database/todos.json")
const Todo = require("./model/to_do_model")
const parser = require("./utensils/parse")


const server = async (req, res) =>  {
    res.setHeader("Content-Type", "application/json")

    if (req.url == "/todos" && req.method == "GET"){
        const todos = await Todos.read()
        res.writeHead(200)
        return res.end(JSON.stringify(todos))
    }
    if (req.url == "/todos/getWithTitle" && req.method == "GET"){
        const {title} = await parser(req)
        const todos = await Todos.read()
        const toDoWithTitle = todos.find((todo) => todo.title === title)

        if (!toDoWithTitle) {
            res.writeHead(404)
            return res.end(JSON.stringify({ message: "Todo not found" }))
        }

        res.writeHead(200)
        res.end(JSON.stringify(toDoWithTitle))
    }
    if (req.url == "/todos/post" && req.method == "POST"){
        const {title, description} = await parser(req)
        const todos = await Todos.read()
        const id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1
        const newTodo = new Todo(id, title, description, false);
        const data = todos.length ? [...todos, newTodo] : [newTodo]
        res.writeHead(201)
        await Todos.write(data)
        return res.end(JSON.stringify({message : "Successfully added!"}))
    }
    if (req.url == "/todos/edit" && req.method == "PUT"){
        const { title, description } = await parser(req);
        const todos = await Todos.read()
        const updatedTodos = todos.map((todo) => todo.title === title ? { ...todo, title, description } : todo)
        await Todos.write(updatedTodos)
        res.writeHead(200)
        return res.end(JSON.stringify({ message: "Successfully edited" }))
    }
    if (req.url === "/todos/complete" && req.method === "PUT") {
        const { title, isCompleted } = await parser(req);
        const todos = await Todos.read()
        const updatedTodos = todos.map((todo) => todo.title === title ? { ...todo, isCompleted } : todo)
        await Todos.write(updatedTodos)
        res.writeHead(200)
        return res.end(JSON.stringify({ message: "Todo status updated successfully!" }))
    }
    if (req.url === "/todos/delete" && req.method === "DELETE") {
        const { title } = await parser(req)
        const todos = await Todos.read()
        const filteredTodos = todos.filter((todo) => todo.title !== title)
        await Todos.write(filteredTodos)
        res.writeHead(200)
        return res.end(JSON.stringify({ message: "Successfully deleted" }))
      } else {
        res.writeHead(404)
        return res.end(JSON.stringify({ message: "Route not found" }))
      }
}

http.createServer(server).listen((7777), () => {
    console.log("Server running on port 7777");
})