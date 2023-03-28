<script>
    import Time from 'svelte-time';
    // create function to fetch all travel journeys from api
    async function getTravelJourneys() {
        const response = await fetch("https://envi.rowlinson.org.uk/traveljourneys");
        const data = await response.json();
        return data;
    }
    let travelJourneysPromise = getTravelJourneys().then((data) => {
        // calculate carbon output
        data.forEach((travelJourney) => {
            travelJourney.carbon = Number(travelJourney.travelMethod.carbonOutput) * Number(travelJourney.distance);
        });
        return data;
    });

    // create function to fetch all travel methods from api
    async function getTravelMethods() {
        const response = await fetch("https://envi.rowlinson.org.uk/travelmethods");
        const data = await response.json();
        return data;
    }
    const travelMethodsPromise = getTravelMethods();

    // create function to create a new travel journey
    async function createTravelJourney(e) {
        e.preventDefault();

        // get form data
        const formData = new FormData(e.target);
        let jsonData = {
            travelMethodId: formData.get("travelMethod"),
            distance: formData.get("distance"),
            date: formData.get("date")
        };

        // send data to server
        const response = await fetch("https://envi.rowlinson.org.uk/traveljourney", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonData)
        });

        // update travel journeys promise
        travelJourneysPromise = getTravelJourneys().then((data) => {
            // calculate carbon output
            data.forEach((travelJourney) => {
                travelJourney.carbon = Number(travelJourney.travelMethod.carbonOutput) * Number(travelJourney.distance);
            });
            return data;
        });
    }

    // create function to delete a travel journey
    async function deleteRecord(travelJourney) {
        const response = await fetch("https://envi.rowlinson.org.uk/traveljourney/" + travelJourney.id, {
            method: "DELETE"
        });

        // update travel journeys promise
        travelJourneysPromise = getTravelJourneys().then((data) => {
            // calculate carbon output
            data.forEach((travelJourney) => {
                travelJourney.carbon = Number(travelJourney.travelMethod.carbonOutput) * Number(travelJourney.distance);
            });
            return data;
        });
    }
</script>

<section class="travel">
    <!-- svelte-ignore a11y-missing-content -->
    <a name="travel" />
    <div class="input-section-container">
        <div>
            <h1>Recently logged</h1>
            <table>
                <thead>
                    <th>Method</th>
                    <th>Distance</th>
                    <th>Carbon (kgCO2equ)</th>
                    <th>Date</th>
                    <th></th>
                </thead>
                {#await travelJourneysPromise}
                    <p>Loading...</p>
                {:then travelJourneys}
                    {#each travelJourneys as travelJourney}
                        <tr>
                            <td>{travelJourney.travelMethod.name}</td>
                            <td>{travelJourney.distance}</td>
                            <td>{travelJourney.carbon}</td>
                            <td><Time relative timestamp={travelJourney.date} /></td>
                            <td><button class="delete-button" on:click={() => deleteRecord(travelJourney)}><i class="fa fa-trash"></i></button></td>
                        </tr>
                    {/each}
                {:catch error}
                    <p>{error.message}</p>
                {/await}
            </table>
        </div>

        <div>
            <h1>Log travel journey</h1>
            <form on:submit={createTravelJourney}>
                <label for="travelMethod">Travel Method</label>
                <select name="travelMethod">
                    {#await travelMethodsPromise}
                        <p>Loading...</p>
                    {:then travelMethods}
                        {#each travelMethods as travelMethod}
                            <option value={travelMethod.id}>{travelMethod.name}</option>
                        {/each}
                    {:catch error}
                        <p>{error.message}</p>
                    {/await}
                </select>
                <label for="distance">Distance (km)</label>
                <input type="number" name="distance" required>
                <!-- date input -->
                <label for="date">Date</label>
                <input type="date" name="date">
                <input type="submit" value="Log">
            </form>
        </div>
    </div>
</section>