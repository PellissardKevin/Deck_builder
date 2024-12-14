// script.js

// Pool initial de cartes
const cardPool = [
  { id: 1, name: "Chevalier", type: "Attaque" },
  { id: 2, name: "Dragon", type: "Attaque" },
  { id: 3, name: "Mage", type: "Soutien" },
  { id: 4, name: "Archer", type: "Attaque" },
  { id: 5, name: "Clerc", type: "Soutien" },
];

const availableCards = document.getElementById("available-cards");
const deckCards = document.getElementById("deck-cards");

let deck = []; // Deck de l'utilisateur
let cardCounts = {}; // Compteur des occurrences par ID

// Fonction pour afficher une liste de cartes avec drag & drop
function renderCards(cards, container, isInDeck = false) {
  container.innerHTML = ""; // Nettoyer l'affichage

  const groupedCards = isInDeck
    ? Object.entries(cardCounts)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const card = cards.find(c => c.id == id);
        return { ...card, count };
      })
    : cards;

  groupedCards.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    const countText = isInDeck && card.count ? ` (x${card.count})` : "";
    cardElement.textContent = `${card.name} (${card.type})${countText}`;

    // Gestion des clics
    if (!isInDeck) {
      // Cartes disponibles : ajouter au deck au clic
      cardElement.addEventListener("click", () => {
        addToDeck(card);
      });
    } else {
      // Cartes du deck : retirer ou décrémenter au clic
      cardElement.addEventListener("click", () => {
        removeFromDeck(card);
      });
    }

    // Gestion des événements de drag
    cardElement.setAttribute("draggable", "true");
    cardElement.dataset.id = card.id;
    cardElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(card));
    });

    container.appendChild(cardElement);
  });
}



// Ajouter une carte au deck
function addToDeck(card) {
  const count = cardCounts[card.id] || 0;

  if (count < 3) { // Limite à 3 occurrences
    deck.push(card);
    cardCounts[card.id] = count + 1; // Augmenter le compteur
    updateDisplay();
  } else {
    alert("Vous ne pouvez ajouter cette carte que 3 fois !");
  }
}

// Retirer une carte du deck
function removeFromDeck(card) {
  const count = cardCounts[card.id] || 0;

  if (count > 1) {
    cardCounts[card.id]--; // Décrémenter le compteur
  } else {
    delete cardCounts[card.id]; // Supprimer complètement du compteur
    deck = deck.filter(c => c.id !== card.id); // Supprimer la carte du deck
  }

  updateDisplay(); // Mettre à jour l'affichage
}


// Met à jour l'affichage des cartes disponibles et du deck
function updateDisplay() {
  renderCards(cardPool, availableCards);
  renderCards(deck, deckCards, true);
}

// Gestion du drag and drop pour la zone du deck
deckCards.addEventListener("dragover", (e) => {
  e.preventDefault(); // Permet le drop
});

deckCards.addEventListener("drop", (e) => {
  e.preventDefault();
  const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
  addToDeck(cardData);
});

// Gestion du drag and drop pour la zone du pool
availableCards.addEventListener("dragover", (e) => {
  e.preventDefault(); // Permet le drop
});

availableCards.addEventListener("drop", (e) => {
  e.preventDefault();
  const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));
  removeFromDeck(cardData);
});

// Initialisation
updateDisplay();

const trashZone = document.getElementById("trash-zone");

trashZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  trashZone.classList.add("dragover"); // Ajouter un effet visuel
});

trashZone.addEventListener("dragleave", () => {
  trashZone.classList.remove("dragover"); // Retirer l'effet visuel
});

trashZone.addEventListener("drop", (e) => {
  e.preventDefault();
  trashZone.classList.remove("dragover"); // Nettoyer l'effet visuel

  const cardData = JSON.parse(e.dataTransfer.getData("text/plain"));

  if (cardData) {
    // Supprimer complètement la carte du deck
    delete cardCounts[cardData.id];
    deck = deck.filter(c => c.id !== cardData.id);
    updateDisplay();
  }
});
