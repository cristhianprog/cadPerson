const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.use(express.json());

let people = [
  { id: 1, name: 'Paul', age: 30 },
  { id: 2, name: 'Ana', age: 25 },
];

app.get('/api/people', (req, res) => {
  res.json(people);
});

app.get('/api/person/:id', (req, res) => {
    const id = parseInt(req.params.id); 
    const dado = people.find((dado) => dado.id === id); 

    if (!dado) {
      return res.status(404).json({ message: 'Person not found.' }); 
    }
  
    res.json(dado);
});
  

app.post('/api/person', (req, res) => {
  const { name, age } = req.body;
  const newId = people.length > 0 ? Math.max(...people.map(p => p.id)) + 1 : 1;

  const newPerson = {
    id: newId, 
    name,
    age,
  };
  
  people.push(newPerson);
  res.status(201).json(newPerson);
});

app.delete('/api/person/:id', (req, res) => {
    const id = parseInt(req.params.id); 
    const index = people.findIndex((dado) => dado.id === id);
  
    if (index === -1) {
      return res.status(404).json({ message: 'Person not found.' });
    }
  
    people.splice(index, 1);
    res.status(200).json({ message: 'Person deleted successfully.' });
});

app.put('/api/person/:id', (req, res) => {
    const id = parseInt(req.params.id); 
    const index = people.findIndex((person) => person.id === id);

  
    if (index === -1) {
      return res.status(404).json({ message: 'Person not found.' });
    }
  
    const dadoEditado = { ...people[index], ...req.body }; 
    people[index] = dadoEditado;
    res.status(200).json(dadoEditado); 
});

app.listen(port, () => {
  console.log(`Server running on the port http://localhost:${port}`);
});