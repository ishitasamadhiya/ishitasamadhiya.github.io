// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnClCh6QFTP9b2lfh9vSwOYWvAIDi9aBA",
  authDomain: "skinsnap-ks.firebaseapp.com",
  projectId: "skinsnap-ks",
  storageBucket: "skinsnap-ks.appspot.com",
  messagingSenderId: "588277611754",
  appId: "1:588277611754:web:d7f0af653d40eb35d3ab93",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to create a review card
function createReviewCard(review) {
  const card = document.createElement("div");
  card.className = "review-card";
  const name = review.firstName + " " + review.lastName;
  const text = review.message;
  card.innerHTML = `
      <img src="${review.avatarUrl || "https://i.pravatar.cc/300"}" alt="${name}" class="avatar">
      <h3>${name}</h3>
      <p>${text}</p>
  `;
  return card;
}

// Function to fetch and display reviews
async function fetchAndDisplayReviews() {
  const reviewsScroll = document.getElementById("reviewsScroll");
  if (!reviewsScroll || !reviewsScroll.appendChild) {
    return;
  }

  try {
    const snapshot = await db
      .collection("reviews")
      .where("pinned", "==", true)
      .get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    snapshot.forEach((doc) => {
      const review = { id: doc.id, ...doc.data() };
      const card = createReviewCard(review);
      reviewsScroll.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching reviews: ", error);
  }
}

const reviewFormEl = document.getElementById("reviewForm");

if (reviewFormEl) {
  reviewFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
  
    try {
      await db.collection("reviews").add({
        firstName,
        lastName,
        email,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  
      alert("Review submitted successfully!");
      document.getElementById("reviewForm").reset();
    } catch (error) {
      console.error("Error adding review: ", error);
      alert("An error occurred while submitting the review. Please try again.");
    }
  });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayReviews);
