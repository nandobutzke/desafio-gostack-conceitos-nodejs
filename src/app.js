const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

const repositories = [];
let like = 1;

app.use(express.json());
app.use(cors());

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).error({ error: "Invalid uuid" });
  }

  return next();
  
}

app.use("/repositories/:id", validateProjectId);

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;
  
  
  const repository = {
    id: uuid(),
    title,
    url,
    likes: 0,
    techs
  }
  
  repositories.push(repository);

  return response.status(200).json(repository);

});

const likesUpdate = 1;
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs, likes } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Bad request" })
  }

  const repository = {
    id,
    title,
    url,
    likes: likesUpdate,
    techs
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository); 

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0 ) {
    return response.status(400).json({ error: "Bad request" })
  }


  repositories.splice(repositoryIndex, 1);

  return response.status(204).json([]);


});


app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const {title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Bad request" })
  }
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes: like,
  }

  like++;

  //like++;
  
  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

module.exports = app;
