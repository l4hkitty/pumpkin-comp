// Sample pumpkin data (replace with your actual pumpkin data)
const pumpkins = [
    {
        id: 1,
        name: "Bat",
        image: "images/Bat.jpeg",
        votes: 0
    },
    {
        id: 2,
        name: "Caramel Apple",
        image: "images/CaramelApple.jpeg",
        votes: 0
    },
    {
        id: 3,
        name: "Catrina",
        image: "images/Catrina.jpeg",
        votes: 0
    },
    {
        id: 4,
        name: "Spooky Cauldron",
        image: "images/Cauldron.jpeg",
        votes: 0
    },
    {
        id: 5,
        name: "Donut",
        image: "images/Donut.jpeg",
        votes: 0
    },
    {
        id: 6,
        name: "Scary Ghost",
        image: "images/Ghost.jpeg",
        votes: 0
    },
    {
        id: 7,
        name: "Sweet Grandma",
        image: "images/Grandma.jpeg",
        votes: 0
    },
    {
        id: 8,
        name: "Lips",
        image: "images/Lips.jpeg",
        votes: 0
    },
    {
        id: 9,
        name: "Nature Pumpkin",
        image: "images/NaturalPumpkin.jpeg",
        votes: 0
    },
    {
        id: 10,
        name: "Speech",
        image: "images/Speech.jpeg",
        votes: 0
    },
    {
        id: 11,
        name: "Toy Story",
        image: "images/ToyStory.jpeg",
        votes: 0
    },
    {
        id: 12,
        name: "Glitter Dumpling",
        image: "images/Dumpling.jpeg",
        votes: 0
    }
];

// Load votes from localStorage
function loadVotes() {
    const savedVotes = localStorage.getItem("pumpkinVotes");
    if (savedVotes) {
        const parsedVotes = JSON.parse(savedVotes);
        pumpkins.forEach(pumpkin => {
            const savedPumpkin = parsedVotes.find(p => p.id === pumpkin.id);
            if (savedPumpkin) {
                pumpkin.votes = savedPumpkin.votes;
            }
        });
    }
}

// Save votes to localStorage
function saveVotes() {
    localStorage.setItem("pumpkinVotes", JSON.stringify(pumpkins));
}

// Function to render pumpkin cards
function renderPumpkins() {
    const pumpkinGallery = document.getElementById("pumpkinGallery");
    pumpkinGallery.innerHTML = "";

    pumpkins.forEach(pumpkin => {
        const pumpkinCard = document.createElement("div");
        pumpkinCard.className = "pumpkin-card";
        pumpkinCard.innerHTML = `
            <img src="${pumpkin.image}" alt="${pumpkin.name}">
            <h3>${pumpkin.name}</h3>
            <p>Votes: <span id="votes-${pumpkin.id}">${pumpkin.votes}</span></p>
            <button class="vote-btn" onclick="vote(${pumpkin.id})" id="vote-btn-${pumpkin.id}">Vote for this pumpkin</button>
        `;
        pumpkinGallery.appendChild(pumpkinCard);
    });

    // Disable vote buttons if the user has already voted 2 times
    checkVotesLeft();
}

// Function to handle voting
function vote(id) {
    const pumpkin = pumpkins.find(p => p.id === id);
    if (pumpkin) {
        pumpkin.votes++;
        document.getElementById(`votes-${id}`).textContent = pumpkin.votes;
        saveVotes(); // Save votes to localStorage
        updateVotesLeft();
    }
}

// Function to check if the user has already voted 2 times
function checkVotesLeft() {
    const votesLeft = localStorage.getItem("votesLeft");
    if (votesLeft === null || votesLeft > 0) {
        return true; // User can vote
    } else {
        // Disable all vote buttons
        document.querySelectorAll(".vote-btn").forEach(button => {
            button.disabled = true;
            button.textContent = "You've used your 2 votes!";
        });
        return false; // User cannot vote anymore
    }
}

// Function to update the number of votes left
function updateVotesLeft() {
    let votesLeft = localStorage.getItem("votesLeft");
    if (votesLeft === null) {
        votesLeft = 1; // Start with 1 vote left (since we decrement after voting)
    } else {
        votesLeft = parseInt(votesLeft) - 1;
    }

    localStorage.setItem("votesLeft", votesLeft);

    // If no votes left, disable all buttons
    if (votesLeft <= 0) {
        document.querySelectorAll(".vote-btn").forEach(button => {
            button.disabled = true;
            button.textContent = "You've used your 2 votes!";
        });
    }
}

// Function to reset votes
function resetVotes() {
    localStorage.removeItem("pumpkinVotes");
    localStorage.removeItem("votesLeft");
    pumpkins.forEach(pumpkin => {
        pumpkin.votes = 0;
    });
    renderPumpkins();
    alert("Your votes have been reset. You can now vote again!");
}

// Initialize the gallery and load votes
loadVotes();
renderPumpkins();