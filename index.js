const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const dataFilePath = path.join(__dirname, 'hospitals.json');

// Middleware to parse JSON bodies
app.use(express.json());

// Read all hospitals
app.get('/hospitals', (req, res) => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const hospitals = JSON.parse(data);
    res.json(hospitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new hospital
app.post('/hospitals', (req, res) => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const hospitals = JSON.parse(data);
  
      const newHospital = {
        id: Date.now(), // Use timestamp as a simple unique ID
        name: req.body.name,
        patient_count: req.body.patient_count,
        location: req.body.location
      };
  
      hospitals.push(newHospital);
  
      fs.writeFileSync(dataFilePath, JSON.stringify(hospitals, null, 2));
      res.status(201).json(newHospital);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Update a hospital by ID
  app.put('/hospitals/:id', (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      const data = fs.readFileSync(dataFilePath, 'utf8');
      let hospitals = JSON.parse(data);
  
      const index = hospitals.findIndex(h => h.id === hospitalId);
      if (index !== -1) {
        hospitals[index] = {
          ...hospitals[index],
          ...req.body
        };
  
        fs.writeFileSync(dataFilePath, JSON.stringify(hospitals, null, 2));
        res.json(hospitals[index]);
      } else {
        res.status(404).json({ error: 'Hospital not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// Delete a hospital by ID
app.delete('/hospitals/:id', (req, res) => {
    try {
      const hospitalId = parseInt(req.params.id);
      const data = fs.readFileSync(dataFilePath, 'utf8');
      let hospitals = JSON.parse(data);
  
      const filteredHospitals = hospitals.filter(h => h.id !== hospitalId);
      if (filteredHospitals.length !== hospitals.length) {
        fs.writeFileSync(dataFilePath, JSON.stringify(filteredHospitals, null, 2));
        res.sendStatus(204); // No content
      } else {
        res.status(404).json({ error: 'Hospital not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

