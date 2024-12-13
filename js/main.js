document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("itemForm");
  const itemList = document.getElementById("itemList");

  // Function to fetch items
  function fetchItems() {
    fetch("http://localhost:3000")
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", JSON.stringify(data, null, 2));

        // Clear existing items
        if (Array.isArray(data.items)) {
          console.log("Processing array");
          itemList.innerHTML = "";
          data.items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;

            li.addEventListener("click", () => {
              li.style.textDecoration = li.style.textDecoration
                ? ""
                : "line-through";
            });

            itemList.appendChild(li);
            console.log("Added", item);
          });
        } else if (typeof data === "object") {
          console.log("Processing object");
          Object.keys(data).forEach((key) => {
            const li = document.createElement("li");
            li.textContent = `${key}: ${data[key]}`;
            itemList.appendChild(li);
          });
        } else {
          console.log("Unexpected data format:", data);
        }
      })
      .catch((error) => console.error("Error fetching items:", error));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const item = document.getElementById("item").value;
    const response = await fetch("http://localhost:3000/add-item", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ item }),
    });

    const data = await response.json();
    console.log(data);

    // clear form after submission
    document.getElementById("item").value = "";

    // fetch items after submission
    console.log("fetching items...");
    fetchItems();
  }

  async function handleRemove(e) {
    e.preventDefault();

    const items = document.querySelectorAll("#itemList li");
    items.forEach((li) => {
      if (li.style.textDecoration === "line-through") {
        // li.remove();
        deleteItemFromServer(li.textContent)
          .then(() => {
            console.log("Removed item:", li.textContent);
            // fetch items after removal
            console.log("fetching items...");
            fetchItems();
          })
          .catch((error) => {
            console.error(`Error removing item ${li.textContent}`, error);
          });
      }
    });
  }

  async function deleteItemFromServer(itemName) {
    try {
      const response = await fetch(`http://localhost:3000/${itemName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${itemName}`);
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error(`Error deleting item ${itemName}`, error);
    }
  }

//   async function fetchRandomEmoji() {
//     const response = await fetch("https://emojihub.yurace.pro/api/random");
//     const data = await response.json();
//     return data;
//   }

//   window.onload = async () => {
//     const randEmoji = document.getElementById("randEmoji");

//     try {
//       const fetchedEmoji = await fetchRandomEmoji();
//       randEmoji.innerHTML = fetchedEmoji.emoji;
//     } catch (error) {
//       console.error("Error fetching random emoji:", error);
//     }
//   };

//   async function fetchRandomQuote() {
//     const response = await fetch("https://api.quotable.io/quotes/random");
//     const data = await response.json();
//     return data;
//   }

//   window.onload = async () => {
//     const randQuote = document.getElementById("randQuote");

//     try {
//       const fetchedQuote = await fetchRandomQuote();
//     //   randQuote.innerHTML = fetchedQuote.textContent;
//     } catch (error) {
//       console.error("Error fetching random quote.");
//     }
//   };
async function testApi() {
    const response = await fetch('https://api.quotable.io/quotes/random');
    const data = await response.json();
    console.log('API Response:', data);
  }
  
  testApi();
  // Event listeners
  form.addEventListener("submit", handleSubmit);
  document.getElementById("remove-btn").addEventListener("click", handleRemove);
  fetchItems(); // Initial fetch of items
});
