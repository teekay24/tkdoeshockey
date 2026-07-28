Papa.parse("hockeycards.csv", {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function(results){

        const data = results.data;

        const columns = Object.keys(data[0]).map(col => ({
            title: col,
            data: col
        }));

        // Build table header
        columns.forEach(c=>{
            $("#cardsTable thead tr").append(`<th>${c.title}</th>`);
        });

        const table = $("#cardsTable").DataTable({

            data: data,

            columns: columns,

            pageLength: 25,

            order: [],

            deferRender: true

        });

        // Populate Team dropdown
        const teams = [...new Set(data.map(x=>x.Team))]
            .filter(Boolean)
            .sort();

        teams.forEach(team=>{
            $("#teamFilter").append(
                `<option value="${team}">${team}</option>`
            );
        });

        // Team filter
        $("#teamFilter").on("change", function(){

            table
                .column(columns.findIndex(c=>c.title==="Team"))
                .search(this.value)
                .draw();

        });

    }

});
