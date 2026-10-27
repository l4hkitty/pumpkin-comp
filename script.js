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

// Check if the user has already voted on this device
function hasUserVoted() {
    return localStorage.getItem('hasVoted') === 'true';
}

// Mark the user as having voted on this device
function markUserAsVoted() {
    localStorage.setItem('hasVoted', 'true');
}

// Reset the voting status for this device (for testing)
function resetVotesForDevice() {
    localStorage.removeItem('hasVoted');
    renderPumpkins();
    alert("Your votes have been reset for this device!");
}

// Load votes from Firebase
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

// Function to render pumpkin cards with checkboxes
function renderPumpkins() {
    const pumpkinGallery = document.getElementById("pumpkinGallery");
    pumpkinGallery.innerHTML = "";

    // Check if the user has already voted on this device
    const userHasVoted = hasUserVoted();

    // Render pumpkins and their vote counts
    pumpkins.forEach(pumpkin => {
        const pumpkinCard = document.createElement("div");
        pumpkinCard.className = "pumpkin-card";
        pumpkinCard.innerHTML = `
            <img src="${pumpkin.image}" alt="${pumpkin.name}">
            <h3>${pumpkin.name}</h3>
            <p>Votes: <span id="votes-${pumpkin.id}">${pumpkin.votes}</span></p>
        `;

        // Only show checkboxes and labels if the user hasn't voted yet
        if (!userHasVoted) {
            pumpkinCard.innerHTML += `
                <input type="checkbox" id="checkbox-${pumpkin.id}" value="${pumpkin.id}" onchange="handleCheckboxChange()">
                <label for="checkbox-${pumpkin.id}">Vote for this pumpkin</label>
            `;
        }

        pumpkinGallery.appendChild(pumpkinCard);
    });

    // Add submit button only if the user hasn't voted yet
    if (!userHasVoted) {
        const submitButton = document.createElement("div");
        submitButton.style.margin = "20px auto";
        submitButton.style.textAlign = "center";
        submitButton.innerHTML = `
            <button onclick="submitVotes()" style="
                padding: 10px 20px;
                background-color: #ff6b35;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">
                Submit Votes
            </button>
        `;
        pumpkinGallery.appendChild(submitButton);
    } else {
        // Show a message if the user has already voted
        const confirmationMessage = document.createElement("div");
        confirmationMessage.style.textAlign = "center";
        confirmationMessage.style.margin = "20px";
        confirmationMessage.style.fontSize = "1.2rem";
        confirmationMessage.style.fontWeight = "bold";
        confirmationMessage.style.color = "#ff6b35";
        confirmationMessage.textContent = "You have already voted on this device. Thank you!";
        pumpkinGallery.appendChild(confirmationMessage);
    }
}

// Function to handle checkbox changes
function handleCheckboxChange() {
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (checkedBoxes.length >= 2) {
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.disabled = true;
                checkbox.style.opacity = "0.5";
            }
        });
    } else {
        checkboxes.forEach(checkbox => {
            checkbox.disabled = false;
            checkbox.style.opacity = "1";
        });
    }
}

// Function to handle vote submission
function submitVotes() {
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedPumpkins = Array.from(checkedBoxes).map(checkbox => parseInt(checkbox.value));

    if (selectedPumpkins.length === 0) {
        alert("Please select at least one pumpkin!");
        return;
    }

    if (selectedPumpkins.length > 2) {
        alert("You can only vote for a maximum of two pumpkins!");
        return;
    }

    // Update votes in Firebase
    selectedPumpkins.forEach(id => {
        const pumpkin = pumpkins.find(p => p.id === id);
        if (pumpkin) {
            pumpkin.votes++;
        }
    });

    saveVotes();
    markUserAsVoted(); // Mark the user as having voted on this device

    // Re-render the pumpkins to show the updated state
    renderPumpkins();
}

// Initialize the gallery and load votes
loadVotes();
renderPumpkins();
