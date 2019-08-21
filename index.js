const express = require("express");

const server = express();

server.use(express.json());

let numberOfRequests = 0;

const projects = [
  //database fixo
  {
    id: "1",
    title: "Arrumar a casa",
    tasks: ["Arrumar a cama", "Lavar a louça", "Limpar o chão"]
  },
  {
    id: "2",
    title: "Fazer café",
    tasks: ["Ferver a água", "Colocar o pó no filtro", "Coar o café"]
  }
];

function checkProjectExists(req, res, next) {
  // checagem da existencia do projeto
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

function logRequests(req, res, next) {
  //contagem de Requests
  numberOfRequests++;

  console.log(`Número de requisição: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

server.get("/projects", logRequests, (req, res) => {
  return res.json(projects); //Ver todos os projetos
});

server.post("/projects", logRequests, (req, res) => {
  //Criar um novo Projeto
  const { id } = req.body;
  const { title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectExists, logRequests, (req, res) => {
    //Nova Tarefa
    const { id } = req.params;
    const { title } = req.body;
    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
  }
);

server.put("/projects/:id", checkProjectExists, logRequests, (req, res) => {
  //Editar o titulo do projeto
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, logRequests, (req, res) => {
  //Deletar um projeto
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);
