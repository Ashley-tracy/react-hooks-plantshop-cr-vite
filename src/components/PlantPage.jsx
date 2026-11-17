import React, { useState, useEffect } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

const API = "http://localhost:6001/plants";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setPlants)
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  function handleAddPlant(newPlant) {
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlant),
    })
      .then((r) => r.json())
      .then((saved) => setPlants((prev) => [...prev, saved]))
      .catch((err) => console.error("POST failed:", err));
  }

  const visiblePlants = plants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <Search search={search} onSearchChange={setSearch} />
      <PlantList plants={visiblePlants} />
    </main>
  );
}

export default PlantPage;