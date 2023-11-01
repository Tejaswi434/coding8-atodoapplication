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
const hasstatusandpriority = (requestquery) => {
  return (
    requestquery.status !== undefined && requestquery.priority !== undefined
  );
};
const hascategoryandpriority = (requestquery) => {
  return (
    requestquery.category !== undefined && requestquery.priority !== undefined
  );
};
const hasstatusandcategory = (requestquery) => {
  return (
    requestquery.category !== undefined && requestquery.status !== undefined
  );
};
const hasstatus = (requestquery) => {
  return requestquery.status !== undefined;
};
const haspriority = (requestquery) => {
  return requestquery.priority !== undefined;
};
const hascategory = (requestquery) => {
  return requestquery.category !== undefined;
};

app.get("/todos/", async (request, response) => {
  let data;
  let { status, priority, search_q = "", category } = request.query;
  switch (true) {
    case hasstatusandpriority(request.query):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        if (
          priority === `HIGH` ||
          priority === `MEDIUM` ||
          priority === `LOW`
        ) {
          data = `select id,todo,priority,status,category,due_date as dueDate from todo where todo like '%${search_q}%' and status='${status}' and priority='${priority}';`;
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    case hascategoryandpriority(request.query):
      if (
        category === `WORK` ||
        category === `HOME` ||
        category === "LEARNING"
      ) {
        if (
          priority === `HIGH` ||
          priority === `MEDIUM` ||
          priority === `LOW`
        ) {
          data = `select id,todo,priority,status,category,due_date as dueDate from todo where todo like '%${search_q}%' and category='${category}' and priority='${priority}';`;
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;
    case hasstatus(request.query):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        data = `select id,todo,priority,status,category,due_date as dueDate from todo where todo like '%${search_q}%' and status='${status}';`;
        break;
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    case hasstatusandcategory(request.query):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        if (
          category === `WORK` ||
          category === `HOME` ||
          category === "LEARNING"
        ) {
          data = `select id,todo,priority,status,category,due_date as dueDate from todo where todo like '%${search_q}%' and status='${status}' and category='${category}';`;
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    case haspriority(request.query):
      if (priority === `HIGH` || priority === `MEDIUM` || priority === `LOW`) {
        data = `select id,todo,priority,status,category,due_date as dueDate from todo where todo like '%${search_q}%' and priority='${priority}';`;
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;
    case hascategory(request.query):
      if (
        category === `WORK` ||
        category === `HOME` ||
        category === "LEARNING"
      ) {
        data = `select id,todo,priority,status,category,due_date as dueDate from todo where todo like '%${search_q}%' and category='${category}';`;
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;
    default:
      data = `select id,todo,priority,status,category,due_date as dueDate from todo where todo like '%${search_q}%';`;
  }
  value = await db.all(data);
  response.send(value);
});

/*second*/
app.get("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  const data = `select id,todo,priority,status,category,due_date as dueDate from todo where todo.id='${todoId}';`;
  data_2 = await db.get(data);
  response.send(data_2);
});

app.get("/agenda/", async (request, response) => {
  let { date } = request.query;
  const data = `select * from todo where date='${date}';`;
  data_2 = await db.get(data);
  response.send(data_2);
});

app.post("/todos/", async (request, response) => {
  let { id, todo, priority, status, category, dueDate } = request.body;
  const data = `insert into todo (id,todo,priority,status,category,due_date)values('${id}', '${todo}', '${priority}', '${status}', '${category}', '${dueDate}');`;
  const value = await db.run(data);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  const hasstatus = (requestbody) => {
    return requestbody.status !== undefined;
  };
  const haspriority = (requestbody) => {
    return requestbody.priority !== undefined;
  };
  const hastodo = (requestbody) => {
    return requestbody.todo !== undefined;
  };
  const hascategory = (requestbody) => {
    return requestbody.category !== undefined;
  };

  const hasdueDate = (requestbody) => {
    return requestbody.dueDate !== undefined;
  };
  let value = null;
  let word = "";
  switch (true) {
    case hasstatus(request.body):
      value = `update todo set status=${status} where todo.id='${todoId}';`;
      word = "Status";
      break;
    case haspriority(request.body):
      value = `update todo set priority=${status} where todo.id='${todoId}';`;
      word = "Priority";
      break;
    case hastodo(request.body):
      value = `update todo set todo=${todo} where todo.id='${todoId}';`;
      word = "Todo";
      break;
    case hascategory(request.body):
      value = `update todo set category=${category} where todo.id='${todoId}';`;
      word = "Category";
      break;
    default:
      value = `update todo set dueDate=${dueDate} where todo.id='${todoId}';`;
      word = "Due Date";
  }
  await db.run(value);
  response.send(`${word} Updated`);
});
/*fifith*/
app.delete("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  const query_fetching = `delete from todo where todo.id='${todoId}';`;
  await db.run(query_fetching);
  response.send("Todo Deleted");
});

module.exports = app;
