const Todo = require("../models/todoModel");
const User = require("../models/userModel");

// DESC     get only my todo
// METHOD   GET /api/v1/todo/fetch
// ACCESS   private
const getMyTodo = async (req, res) => {
  try {
    const todo = await Todo.find({ user: req.user.id }).sort({ $natural: -1 });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).send(error);
  }
};

// DESC     create a todo
// METHOD   POST /api/v1/todo/create
// ACCESS   private
const createTodo = async (req, res) => {
  if (!req.body.title || !req.body.description) {
    res.status(400).json({ message: "A value is missing" });
    return;
  }

  try {
    const todo = await Todo.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      user: req.user.id,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// DESC     delete my todo
// METHOD   DELETE /api/v1/todo/delete/:id
// ACCESS   private
const deleteTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(400).json({ message: "todo not found" });
    return;
  }

  const user = await User.findById(req.user.id); //find the logged in user from db

  // check for user
  if (!user) {
    res.status(401).send("user not found");
    return;
  }

  // compare the user who created the goal with the logged in user
  if (todo.user.toString() !== user.id) {
    res.status(401).send("Not Authorized");
    return;
  }

  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: "Could not delete todo" });
  }
};

// DESC     update my report
// METHOD   PUT /api/v1/todo/update/:id
// ACCESS   private
const updateTodo = async (req, res) => {
  if (!req.params.id) {
    res.send("No id sent");
    return;
  }

  const todo = await Todo.findById(req.params.id);
  // console.log(req.body);

  if (!todo) {
    res.status(400).json({ message: "Todo not found" });
    return;
  }

  const user = await User.findById(req.user.id); //find the logged in user from db

  // check for user
  if (!user) {
    res.status(401).send("user not found");
    return;
  }

  // compare the user who created the goal with the logged in user
  if (todo.user.toString() !== user.id) {
    res.status(401).send("Not Authorized");
    return;
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: "Could not update todo" });
  }
};

module.exports = {
  getMyTodo,
  updateTodo,
  createTodo,
  deleteTodo,
};
