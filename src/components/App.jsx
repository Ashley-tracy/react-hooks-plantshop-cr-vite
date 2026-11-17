
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:6001/plants";

function App() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load plants when the application starts
  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load plants");
        }
        return response.json();
      })
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load plants. Please check the server.");
        setLoading(false);
      });
  }, []);

  // Update form values
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Add a new plant
  function handleSubmit(event) {
    event.preventDefault();

    const newPlant = {
      name: formData.name,
      image: formData.image,
      price: Number(formData.price),
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlant),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add plant");
        }
        return response.json();
      })
      .then((addedPlant) => {
        setPlants([...plants, addedPlant]);

        setFormData({
          name: "",
          image: "",
          price: "",
        });
      })
      .catch(() => {
        setError("Unable to add plant. Please try again.");
      });
  }

  // Mark a plant as sold out
  function handleSoldOut(plantId) {
    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === plantId
          ? { ...plant, sold_out: !plant.sold_out }
          : plant
      )
    );
  }

  // Search plants by name
  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header>
        <h1>Plantsy</h1>
        <p>Welcome to the Plantsy Plant Shop!</p>
      </header>

      <main>
        <section className="new-plant-form">
          <h2>Add a New Plant</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Plant Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Plant name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              required
            />

            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Plant price"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <button type="submit">Add Plant</button>
          </form>
        </section>

        <section className="plant-search">
          <h2>Search Plants</h2>
          <input
            type="text"
            placeholder="Search plants by name..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </section>

        <section className="plant-list">
          <h2>Available Plants</h2>

          {loading && <p>Loading plants...</p>}

          {error && <p role="alert">{error}</p>}

          {!loading && !error && filteredPlants.length === 0 && (
            <p>No plants found.</p>
          )}

          <div className="plants-container">
            {filteredPlants.map((plant) => (
              <article className="plant-card" key={plant.id}>
                <img src={plant.image} alt={plant.name} />

                <h3>{plant.name}</h3>

                <p>Price: ${Number(plant.price).toFixed(2)}</p>

                <p>
                  {plant.sold_out ? "Sold Out" : "In Stock"}
                </p>

                <button
                  type="button"
                  onClick={() => handleSoldOut(plant.id)}
                >
                  {plant.sold_out ? "Restock Plant" : "Mark Sold Out"}
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
