<script>
    // load google charts
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        // get total carbon output from api using fetch
        fetch("https://envi.rowlinson.org.uk/splitcarbonyesterday")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // create array to store data
                let dataArray = [['Source', 'Co2kgequiv']];
                let newData = Array.from(data);

                console.log(newData);

                // loop through data and push to array
                newData.forEach((item) => {
                    dataArray.push([item.name, item.carbonTotal]);
                });
                console.log(dataArray);

                // create data table
                var data = google.visualization.arrayToDataTable(dataArray);

                // set options
                var options = {
                    pieHole: 0.4,
                    legend: 'none',
                    backgroundColor: 'transparent',
                    chartArea: {
                        left: 0,
                        top: 10,
                        width: '100%',
                        height: '100%'
                    },
                    width: 650,
                    height: 650,
                    colors: ['#ADE28A', '#256670']
                };

                // create chart
                var chart = new google.visualization.PieChart(
                    document.getElementById('piechart')
                );

                // draw chart
                chart.draw(data, options);
            });
    }
</script>

<section class="welcome">
    <section class="nav">
        <ul>
            <li><a href="#food">food</a></li>
            <li><a href="#travel">travel</a></li>
            <li><a href="#tips">tips</a></li>
            <li><a href="#pet">pet</a></li>
        </ul>
    </section>
    <div class="flex-welcome-container">
        <div class="graph-container">
            <!-- <svg width="650" height="650" viewBox="0 0 650 650" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="325" cy="325" r="251" stroke="#ADE28A" stroke-width="148" />
            </svg> -->
            <div id="piechart"></div>
        </div>
        <div>
            <h1>Welcome to Envirodash, Jonah!</h1>
        </div>
    </div>
</section>