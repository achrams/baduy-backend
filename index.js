const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 40001;
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const SECRET = process.env.SECRET || "goabaduy";
const uuid = v4;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World", data: null });
});

app.post("/user/login", (req, res) => {
  const { username, password } = req.body;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const founded = db.user.username === username;
    if (!founded)
      return res
        .status(403)
        .json({ message: "User/Password Incorrect", data: null });

    if (db.user.password !== password)
      return res
        .status(403)
        .json({ message: "User/Password Incorrect", data: null });
    else
      return res.status(201).json({
        message: "Logged In.",
        data: null,
        token: jwt.sign({ username }, SECRET),
      });
  });
});

app.get("/articles", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    return res.status(200).json({ message: "Success", data: db.articles });
  });
});

app.get("/articles/:id", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const articles = db.articles;
    const result = articles.find((el) => el.id === req.params.id);
    if (!result)
      return res.status(404).json({ message: "Article not found.", data: {} });

    return res.status(200).json({ message: "Success", data: result });
  });
});

app.post("/articles", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const newArticle = {
      id: uuid(),
      title: req.body.title,
      contents: req.body.contents,
      image: req.body.image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.articles.push(newArticle);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      return res
        .status(201)
        .json({ message: "Article created", data: newArticle });
    });
  });
});

app.put("/articles/:id", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const articleIndex = db.articles.findIndex((el) => el.id === req.params.id);
    if (articleIndex === -1)
      return res.status(404).json({ message: "Article not found", data: {} });
    db.articles[articleIndex] = {
      ...db.articles[articleIndex],
      title: req.body.title,
      contents: req.body.contents,
      image: req.body.image,
      updatedAt: new Date(),
    };
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      return res
        .status(200)
        .json({ message: "Article updated", data: db.articles[articleIndex] });
    });
  });
});

app.delete("/articles/:id", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");

    const db = JSON.parse(data);
    const id = req.params.id; // jangan convert, biarin string dulu

    const articleIndex = db.articles.findIndex((el) => String(el.id) === id);

    if (articleIndex === -1) {
      return res.status(404).json({ message: "Article not found", data: {} });
    }

    // hapus artikel pakai splice (hapus berdasarkan index)
    db.articles.splice(articleIndex, 1);

    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");

      return res.status(200).json({ message: "Article deleted", data: null });
    });
  });
});

app.get("/resorts", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    return res.status(200).json({ message: "Success", data: db.resorts });
  });
});

app.post("/resorts", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const newResort = {
      id: uuid(),
      name: req.body.name,
      image: req.body.image,
      price: req.body.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.resorts.push(newResort);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      return res
        .status(201)
        .json({ message: "Resort created", data: newResort });
    });
  });
});

app.put("/resorts/:id", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const resortIndex = db.resorts.findIndex((el) => el.id === req.params.id);
    if (resortIndex === -1)
      return res.status(404).json({ message: "Resort not found", data: {} });
    db.resorts[resortIndex] = {
      ...db.resorts[resortIndex],
      name: req.body.name,
      image: req.body.image,
      price: req.body.price,
      updatedAt: new Date(),
    };
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      return res
        .status(200)
        .json({ message: "Resort updated", data: db.resorts[resortIndex] });
    });
  });
});

app.delete("/resorts/:id", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    const resortIndex = db.resorts.findIndex((el) => el.id === req.params.id);
    if (resortIndex === -1)
      return res.status(404).json({ message: "Resort not found", data: {} });

    const result = db.resorts.filter((el, id) => {
      id !== resortIndex;
    });

    db.resorts = result;
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      return res.status(201).json({ message: "Resort deleted", data: null });
    });
  });
});

app.get("/landing", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    return res.status(200).json({ message: "Success", data: db.landing });
  });
});

app.post("/landing", (req, res) => {
  const { title, contents, info } = req.body;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file");
    const db = JSON.parse(data);
    db.landing = {
      title,
      contents,
      info,
    };

    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).send("Error writing file");
      return res.status(201).json({ message: "Success", data: db.landing });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
