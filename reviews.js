// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPbY7Zkrjf_mVniJchFTOI0TwZt2dpk9U",
  authDomain: "skinsnap-81662.firebaseapp.com",
  projectId: "skinsnap-81662",
  storageBucket: "skinsnap-81662.appspot.com",
  messagingSenderId: "789374207591",
  appId: "1:789374207591:web:8c0bfb64cd1fb5144cb6c2",
  measurementId: "G-18QCVD2HB8",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Function to create a review card
function createReviewCard(review) {
  const card = document.createElement("div");
  card.className = "review-card";
  const name = review.firstName + " " + review.lastName;
  const text = review.message;
  card.innerHTML = `
      <img src="${
        review.avatarUrl || "https://i.pravatar.cc/300"
      }" alt="${name}" class="avatar">
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
    const imageFile = document.getElementById("image").files[0];

    const btnSubmit = document.getElementById("submit-review-btn");
    btnSubmit.innerText = "Submitting...";
    btnSubmit.disabled = true;

    try {
      let imageUrl = null;
      if (imageFile) {
        // Upload image to Firebase Storage
        const storageRef = storage.ref("avatars/" + generateUUID());
        await storageRef.put(imageFile);
        imageUrl = await storageRef.getDownloadURL();
      }

      await db.collection("reviews").add({
        firstName,
        lastName,
        email,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        avatarUrl: imageUrl,
      });

      alert("Review submitted successfully!");
      document.getElementById("reviewForm").reset();
    } catch (error) {
      console.error("Error adding review: ", error);
      alert("An error occurred while submitting the review. Please try again.");
    }

    btnSubmit.innerText = "Submit";
    btnSubmit.disabled = false;
  });
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayReviews);
