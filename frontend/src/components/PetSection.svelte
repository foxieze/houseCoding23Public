<script>
    // create promise to get data from api
    const getCarbonImage = async () => {
        const response = await fetch("https://envi.rowlinson.org.uk/carbonimage");
        const data = await response.json();
        return data;
    };
    let carbonImagePromise = getCarbonImage();

    async function refreshCarbonImage() {
        carbonImagePromise = getCarbonImage();
    }

    // create function and promise to get today's data
    const getTodayCarbon = async () => {
        const response = await fetch("https://envi.rowlinson.org.uk/totalcarbontoday");
        const data = await response.json();
        return data;
    };
    let todayCarbonPromise = getTodayCarbon();

    // create function and promise to get yesterday's data
    const getYesterdayCarbon = async () => {
        const response = await fetch("https://envi.rowlinson.org.uk/totalcarbonyesterday");
        const data = await response.json();
        return data;
    };
    let yesterdayCarbonPromise = getYesterdayCarbon();
</script>

<section class="pet">
    <!-- svelte-ignore a11y-missing-content -->
    <a name="pet" />
    <div class="pet-flex-container">
        <div class="pet-container">
            {#await carbonImagePromise}
                <p>Loading</p>
            {:then carbonImage}
                <img
                    src={"images/" + carbonImage.image + ".png"}
                    alt="carbon pet"
                />
            {/await}
        </div>
        <div class="pet-text-container">
            <h1>Carbon Pet</h1>
            <p>
                Your carbon pet is a visual representation of your carbon
                footprint. The more carbon you emit, the sadder your pet will be, and the more the environment around it will die.
                </p>
                <p>Tip: your pet will judge you depending on yesterda's carbon footprint, so don't worry if it doesn't change immediately!</p>
            <h4>Current Stats</h4>

            <p><strong>Today: </strong>
                {#await todayCarbonPromise}
                    <p>Loading</p>
                {:then todayCarbon}
                    {todayCarbon.carbonTotal} kg
                {/await}
            </p>
            <p><strong>Yesterday: </strong>
                {#await yesterdayCarbonPromise}
                    <p>Loading</p>
                {:then yesterdayCarbon}
                    {yesterdayCarbon.carbonTotal} kg
                {/await}
                </p>
        </div>
    </div>

    <button class="button" on:click={refreshCarbonImage}>Refresh Pet</button>
</section>
