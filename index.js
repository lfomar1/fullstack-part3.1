const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(cors());
app.use(morgan(":method :url :status - :type :response-time ms"));

app.use(express.json());
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/api/info", (request, response) => {
  const length = persons.length;

  const day = new Date();
  response.send(`<p>Phonebook has info for ${length} people</p><p>${day}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (!person) {
    return response.status(404).json({ error: "Person not found" });
  }
  response.json(person);
});
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  console.log(maxId);
  return maxId + 1;
};
app.post("/api/persons", (request, response) => {
  const body = request.body;
  const name = persons.find((p) => p.name === body.name);
  if (!body.name || !body.number) {
    return response.status(404).json({
      error: "content missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  if (name) {
    return response.status(404).json({
      error: "name already exists",
    });
  }
  persons = persons.concat(person);

  response.json(person);
});

morgan.token("type", function (req, res) {
  return req.headers["content-type"];
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
