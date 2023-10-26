const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
const haspriorityandstatus = (requestquery) => {
  return (
    requestquery.priority !== undefined && requestquery.status !== undefined
  );
};
const hasstatus = (requestquery) => {
  return requestquery.status !== undefined;
};
const haspriority = (requestquery) => {
  return requestquery.priority !== undefined;
};
app.get("/todos/", async (request, response) => {
  let data = null;
  let { status, priority, search_q = "" } = request.query;

  switch (true) {
    case haspriorityandstatus(request.query):
      data = `select * from todo where todo like '%${search_q}%' and status='${status}' and priority='${priority}';`;
      break;
    case hasstatus(request.query):
      data = `select * from todo where status='${status}' and todo like '%${search_q}%';`;
      break;
    case haspriority(request.query):
      data = `select * from todo where priority='${priority}' and todo like '%${search_q}%';`;
      break;
    default:
      data = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%';`;
  }
  solution = await db.all(data);
  response.send(solution);
});
app.get("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  const data = `select * from todo where todo.id='${todoId}';`;
  solution = await db.get(data);
  response.send(solution);
});

app.post("/todos/", async (request, response) => {
  let { id, todo, priority, status } = request.body;

  data = `insert into todo(id,todo,priority,status)values('${id}','${todo}','${priority}','${status}');`;
  solution = await db.run(data);
  response.send("Todo Successfully Added");
});

/* updating todo*/
app.put("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  let { status, priority, todo } = request.body;
  const istodopresent = (requestbody) => {
    return requestbody.todo !== undefined;
  };
  const ispripresent = (requestbody) => {
    return requestbody.priority !== undefined;
  };
  const isstatuspresent = (requestbody) => {
    return requestbody.status !== undefined;
  };
  let data = null;
  let updatedcolumn = "";
  switch (true) {
    case istodopresent(request.body):
      data = `update todo set todo='${todo}' where todo.id='${todoId}';`;
      updatedcolumn = "Todo";
      break;
    case ispripresent(request.body):
      data = `update todo set priority='${priority}' where todo.id='${todoId}'`;
      updatedcolumn = "Priority";
      break;
    case isstatuspresent(request.body):
      data = `update todo set status='${status}' where todo.id='${todoId}'`;
      updatedcolumn = "Status";
      break;
  }
  solution = await db.run(data);
  response.send(`${updatedcolumn} Updated`);
});

/*fifth*/
app.delete("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  const data = `delete from todo where todo.id='${todoId}';`;
  solution = await db.run(data);
  response.send("Todo Deleted");
});

module.exports = app;
