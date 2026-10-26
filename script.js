// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBPA1_jtwsp-ja56vAYiIOcfLjt7IbuxC8",
  authDomain: "pumpkin-contest-2026.firebaseapp.com",
  databaseURL: "https://pumpkin-contest-2026-default-rtdb.firebaseio.com",
  projectId: "pumpkin-contest-2026",
  storageBucket: "pumpkin-contest-2026.firebasestorage.app",
  messagingSenderId: "897706630860",
  appId: "1:897706630860:web:b8f3fa31ff638c5521ac69",
  measurementId: "G-BLBXVH4P11"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Sample pumpkin data
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

// Load votes from Firebase and check localStorage for vote limit
function loadVotes() {
    const votesRef = database.ref('votes');
    votesRef.on('value', (snapshot) => {
        const votesData = snapshot.val();
        if (votesData) {
            pumpkins.forEach(pumpkin => {
                if (votesData[pumpkin.id]) {
                    pumpkin.votes = votesData[pumpkin.id];
                }
            });
            renderPumpkins();
        }
    });
}

// Save votes to Firebase
function saveVotes() {
    const votesRef = database.ref('votes');
    const votesData = {};
    pumpkins.forEach(pumpkin => {
        votesData[pumpkin.id] = pumpkin.votes;
    });
    votesRef.set(votesData);
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
            <button class="vote-btn" onclick="vote(${pumpkin.id})" id="vote-btn-${pumpkin.id}">Vote for me!</button>
        `;
        pumpkinGallery.appendChild(pumpkinCard);
    });

    // Check if the user has already voted twice
    checkVotesLeft();
}

// Function to handle voting
function vote(id) {
    const votesLeft = localStorage.getItem("votesLeft");
    if (votesLeft === null || parseInt(votesLeft) > 0) {
        const pumpkin = pumpkins.find(p => p.id === id);
        if (pumpkin) {
            pumpkin.votes++;
            document.getElementById(`votes-${id}`).textContent = pumpkin.votes;
            saveVotes(); // Save votes to Firebase

            // Update localStorage to track votes
            let votesLeft = localStorage.getItem("votesLeft");
            if (votesLeft === null) {
                votesLeft = 2; // Start with 2 votes
            } else {
                votesLeft = parseInt(votesLeft) - 1;
            }
            localStorage.setItem("votesLeft", votesLeft);

            // Disable the button if the user has voted twice
            if (votesLeft <= 0) {
                document.getElementById(`vote-btn-${id}`).disabled = true;
                document.getElementById(`vote-btn-${id}`).textContent = "You've used your 2 votes!";
            }
        }
    } else {
        alert("You've already used your 2 votes!");
    }
}

// Function to check if the user has already voted twice
function checkVotesLeft() {
    const votesLeft = localStorage.getItem("votesLeft");
    if (votesLeft === null || parseInt(votesLeft) > 0) {
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

// Function to reset votes (for testing)
function resetVotes() {
    localStorage.setItem("votesLeft", "2"); // Reset to 2 votes
    pumpkins.forEach(pumpkin => {
        pumpkin.votes = 0;
    });
    renderPumpkins();
    saveVotes(); // Save the reset votes to Firebase
    alert("Your votes have been reset! You can now vote again.");
}

// Initialize the gallery and load votes
loadVotes();
renderPumpkins();
