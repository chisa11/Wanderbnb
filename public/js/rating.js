// rating.js
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("rating");

  for (const star of stars) {
    star.addEventListener("click", () => {
      const value = Number(star.getAttribute("data-value")); // convert to number
      ratingInput.value = value; // update hidden input for backend

      // Highlight stars
      for (const s of stars) {
        if (Number(s.getAttribute("data-value")) <= value) {
          s.classList.add("selected"); // golden star
        } else {
          s.classList.remove("selected"); // gray star
        }
      }
    });
  }
});


