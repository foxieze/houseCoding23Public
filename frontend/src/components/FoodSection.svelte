<script>
    import Time from 'svelte-time';
    const getRecentFoodLogs = async () => {
        const response = await fetch("https://envi.rowlinson.org.uk/foodlogs");
        const data = await response.json();
        return data;
    };
    let foodLogPromise = getRecentFoodLogs().then((data) => {
        // add mass multiplied by carbon output to each entry in the data array
        data.forEach((foodLog) => {
            foodLog.carbon = Number(foodLog.foodItem.carbonOutput) * Number(foodLog.mass);
        });
        return data;
    });

    const getFoodItems = async () => {
        const response = await fetch("https://envi.rowlinson.org.uk/fooditems");
        const data = await response.json();
        return data;
    };
    let foodItemPromise = getFoodItems();

    async function createFoodLog(e) {
        e.preventDefault();
        // get form data
        const formData = new FormData(e.target);
        let jsonData = {
            foodItemId: formData.get("food"),
            mass: formData.get("mass"),
            date: formData.get("date")
        };
        console.log(jsonData);

        // send data to server
        const response = await fetch("https://envi.rowlinson.org.uk/foodlog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonData)
        });
        foodLogPromise = getRecentFoodLogs().then((data) => {
            // add mass multiplied by carbon output to each entry in the data array
            data.forEach((foodLog) => {
                foodLog.carbon = Number(foodLog.foodItem.carbonOutput) * Number(foodLog.mass);
            });
            return data;
        });
        const res = await response.json();
        console.log(res);
    }

    async function deleteRecord(foodLog) {
        const response = await fetch("https://envi.rowlinson.org.uk/foodlog/" + foodLog.id, {
            method: "DELETE"
        });
        foodLogPromise = getRecentFoodLogs().then((data) => {
            // add mass multiplied by carbon output to each entry in the data array
            data.forEach((foodLog) => {
                foodLog.carbon = Number(foodLog.foodItem.carbonOutput) * Number(foodLog.mass);
            });
            return data;
        });
    }
</script>



<section class="food">
    <!-- svelte-ignore a11y-missing-content -->
    <a name="food" />
    <div class="input-section-container">
        <div>
            <h1>Recently logged</h1>
            <table>
                <thead>
                    <th>Food</th>
                    <th>Mass (kg)</th>
                    <th>Carbon (kgCO2equ)</th>
                    <th>Date</th>
                    <th>Delete</th>
                </thead>
                {#await foodLogPromise}
                    <p>Loading...</p>
                {:then foodLogs}
                    {#each foodLogs as foodLog}
                        <tr>
                            <td>{foodLog.foodItem.name}</td>
                            <td>{foodLog.mass}</td>
                            <td>{foodLog.carbon}</td>
                            <td><Time relative timestamp={foodLog.date} /></td>
                            <td>
                                <button class="delete-button" on:click={() => deleteRecord(foodLog)}><i class="fa fa-trash"></i></button>
                            </td>
                        </tr>
                    {/each}
                {:catch error}
                    <p>{error.message}</p>
                {/await}
            </table>
        </div>

        <div>
            <h1>Log food</h1>
            <form on:submit={createFoodLog}>
                <label for="food">Food</label>
                <select name="food">
                    {#await foodItemPromise}
                        <p>Loading...</p>
                    {:then foodItems}
                        {#each foodItems as foodItem}
                            <option value={foodItem.id}>{foodItem.name}</option>
                        {/each}
                    {:catch error}
                        <p>{error.message}</p>
                    {/await}
                </select>
                <label for="mass">Mass (kg)</label>
                <input type="number" step="0.001" name="mass">
                <!-- date input -->
                <label for="date">Date</label>
                <input type="datetime-local" name="date">
                <input type="submit" value="Log">
            </form>
        </div>
    </div>
</section>