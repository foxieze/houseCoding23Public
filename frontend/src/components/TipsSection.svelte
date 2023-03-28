<script>
    const getSomeTips = async () => {
        const response = await fetch("https://envi.rowlinson.org.uk/tips");
        const data = await response.json();
        return data;
    };
    let tipsPromise = getSomeTips();
</script>

<section class="tips">
    <!-- svelte-ignore a11y-missing-content -->
    <a name="tips"></a>
    <h1>Tips</h1>

    <div class="tips-container">
        {#await tipsPromise}
            <p>Loading...</p>
        {:then tips}
            {#each tips as tip}
                <div class="tip">
                    <img src="images/{tip.image}" alt="{tip.image}"/>
                    <div class="tip-padded">
                    <h2>{tip.title}</h2>
                    <p>{tip.description}</p>
                    </div>
                </div>
            {/each}
        {/await}
    </div>
</section>