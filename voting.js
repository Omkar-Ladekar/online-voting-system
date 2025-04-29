// Store registered voters and candidates
let voters = JSON.parse(localStorage.getItem('voters')) || [];
let candidates = JSON.parse(localStorage.getItem('candidates')) || ["Alice", "Bob", "Charlie"];
let votes = JSON.parse(localStorage.getItem('votes')) || {};

// Populate the candidates dropdown
const candidatesDropdown = document.getElementById("candidates");
candidates.forEach(candidate => {
    let option = document.createElement("option");
    option.value = candidate;
    option.innerText = candidate;
    candidatesDropdown.appendChild(option);
});

// Registration Form
const registrationForm = document.getElementById("registrationForm");
const voterIdInput = document.getElementById("voterId");
const registrationStatus = document.getElementById("registrationStatus");

registrationForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const voterId = voterIdInput.value.trim();
    if (!voterId) {
        registrationStatus.innerText = "Please enter a valid Voter ID.";
        return;
    }
    
    if (voters.includes(voterId)) {
        registrationStatus.innerText = "You are already registered.";
    } else {
        voters.push(voterId);
        localStorage.setItem('voters', JSON.stringify(voters));
        registrationStatus.innerText = "Registration successful!";
        voterIdInput.value = ''; // Clear input field
    }
});

// Vote Form
const voteForm = document.getElementById("voteForm");
const voteStatus = document.getElementById("voteStatus");

voteForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const voterId = voterIdInput.value.trim();
    const selectedCandidate = candidatesDropdown.value;

    if (!voterId || !voters.includes(voterId)) {
        voteStatus.innerText = "You must register before voting.";
        return;
    }

    if (votes[voterId]) {
        voteStatus.innerText = "You have already voted.";
    } else {
        votes[voterId] = selectedCandidate;
        localStorage.setItem('votes', JSON.stringify(votes));

        // Increment the vote for the selected candidate
        let voteCounts = JSON.parse(localStorage.getItem('voteCounts')) || {};
        voteCounts[selectedCandidate] = (voteCounts[selectedCandidate] || 0) + 1;
        localStorage.setItem('voteCounts', JSON.stringify(voteCounts));

        voteStatus.innerText = `Vote successfully casted for ${selectedCandidate}`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const candidates = ['Alice', 'Bob', 'Charlie'];
    const select = document.getElementById('candidates');
    const voteForm = document.getElementById('voteForm');
    const voteStatus = document.getElementById('voteStatus');

    // Populate select options
    candidates.forEach(candidate => {
        const option = document.createElement('option');
        option.value = candidate;
        option.textContent = candidate;
        select.appendChild(option);
    });

    // Handle form submission
    voteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selected = select.value;
        voteStatus.textContent = `You voted for ${selected}. Thank you!`;
        // Add backend call here if needed
    });
});


// Show Results
const showResultsButton = document.getElementById("showResults");
const resultsDiv = document.getElementById("results");

showResultsButton.addEventListener("click", function() {
    const voteCounts = JSON.parse(localStorage.getItem('voteCounts')) || {};
    
    let resultsHtml = '<ul>';
    for (let candidate of candidates) {
        const count = voteCounts[candidate] || 0;
        resultsHtml += `<li>${candidate}: ${count} votes</li>`;
    }
    resultsHtml += '</ul>';

    resultsDiv.innerHTML = resultsHtml;
    resultsDiv.style.display = 'block';
});
