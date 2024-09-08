const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Mock data
const users = [
  { _id: '1', name: 'John Doe', work_start_time: '2024-01-01', sick_leave: 1, personal_leave: 2, vacation_leave: 3, other_leave: 0, out_of_area_work: 1, no_time_entry_explanation: '', total_work_days: 20, number_of_times: 5, number_of_explanations: 2, no_time_entry_dates: '["2024-01-05"]' }
];

// Endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.delete('/api/user/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(user => user._id === id);
  if (index !== -1) {
    users.splice(index, 1);
    res.status(200).send('User deleted');
  } else {
    res.status(404).send('User not found');
  }
});

app.get('/api/auth/validate', (req, res) => {
  // Mock validation
  const token = req.headers['authorization'];
  if (token === 'Bearer valid_token') {
    res.status(200).send('Token valid');
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Serve static files
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
