import "dotenv/config";
import express from "express";
import morgan from "morgan";
import logger from "./logger.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

// Middleware to log requests
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Application code
let teaData = [];
let nextId = 1;

app.post('/tea', (req, res) => {
  const { name, price } = req.body;
  const newTea = {
    id: nextId++,
    name,
    price,
  };
  teaData.push(newTea);
  res.status(201).json(newTea);
});

app.get('/tea', (req, res) => {
  res.status(200).json(teaData);
});

app.get('/tea/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tea = teaData.find((tea) => tea.id === id);

  if (!tea) {
    res.status(404).json({ error: 'Tea not found' });
    return;
  }
  
  res.status(200).json(tea);
});

app.put('/tea/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tea = teaData.find((tea) => tea.id === id);

  if (!tea) {
    res.status(404).json({ error: 'Tea not found' });
    return;
  }

  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;

  res.status(200).json(tea);
});

app.delete('/tea/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const teaIndex = teaData.findIndex((tea) => tea.id === id);

  if (teaIndex === -1) {
    res.status(404).json({ error: 'Tea not found' });
    return;
  }
  
  teaData.splice(teaIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
