
import React, { useEffect, useState } from "react";

function App() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
  });

  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((response) => response.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error(error));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newPlant = {
      name: formData.name,
      image: formData.image,
      price: Number(formData.price),
    };

    fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlant),
    })
      .then((response) => response.json())
      .then((addedPlant) => {
        setPlants((currentPlants) => [...currentPlants, addedPlant]);

        setFormData({
          name: "",
          image: "",
          price: "",
        });
      })
      .catch((error) => console.error(error));
  }

  function handleSoldOut(id) {
    setPlants((currentPlants) =>
      currentPlants.map((plant) =>
        plant.id === id
          ? { ...plant, sold_out: true }
          : plant
      )
    );
  }

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
            placeholder="Type a name to search..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </section>

        <section className="plant-list">
          <h2>Available Plants</h2>

          <div className="plants-container">
            {filteredPlants.map((plant) => (
              <article
                className="plant-card"
                data-testid="plant-item"
                key={plant.id}
              >
                <img src={plant.image} alt={plant.name} />

                <h4>{plant.name}</h4>

                <p>Price: $ {Number(plant.price).toFixed(2)}</p>

                <p>
                  {plant.sold_out ? "Sold Out" : "In Stock"}
                </p>

                {!plant.sold_out && (
                  <button
                    type="button"
                    onClick={() => handleSoldOut(plant.id)}
                  >
                    Mark Sold Out
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
