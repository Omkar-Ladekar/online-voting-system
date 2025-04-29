const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (Make sure you have MongoDB installed and running, or use a cloud service like MongoDB Atlas)
mongoose.connect('mongodb://localhost:27017/votingSystem', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define the Candidate schema and model
const candidateSchema = new mongoose.Schema({
  name: String,
  voteCount: { type: Number, default: 0 },
});
const Candidate = mongoose.model('Candidate', candidateSchema);

// Define the Voter schema and model
const voterSchema = new mongoose.Schema({
  voterId: String,
  hasVoted: { type: Boolean, default: false },
});
const Voter = mongoose.model('Voter', voterSchema);

// Routes

// Register Voter
app.post('/register', async (req, res) => {
  const { voterId } = req.body;
  const existingVoter = await Voter.findOne({ voterId });
  if (existingVoter) {
    return res.status(400).send('Voter is already registered.');
  }
  const newVoter = new Voter({ voterId });
  await newVoter.save();
  res.status(201).send('Voter registered successfully.');
});

// Add Candidate
app.post('/candidates', async (req, res) => {
  const { name } = req.body;
  const candidate = new Candidate({ name });
  await candidate.save();
  res.status(201).send('Candidate added successfully.');
});

// Cast Vote
app.post('/vote', async (req, res) => {
  const { voterId, candidateName } = req.body;
  const voter = await Voter.findOne({ voterId });
  if (!voter || voter.hasVoted) {
    return res.status(400).send('Invalid voter or voter has already voted.');
  }

  const candidate = await Candidate.findOne({ name: candidateName });
  if (!candidate) {
    return res.status(400).send('Candidate not found.');
  }

  candidate.voteCount += 1;
  await candidate.save();
  voter.hasVoted = true;
  await voter.save();

  res.status(200).send(`Vote casted for ${candidateName} successfully.`);
});

// Get Results
app.get('/results', async (req, res) => {
  const candidates = await Candidate.find();
  res.status(200).json(candidates);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
