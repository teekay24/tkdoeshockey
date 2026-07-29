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

        columns.forEach(c=>{
            $("#cardsTable thead tr").append(`<th>${c.title}</th>`);
        });

        const teamColumn = columns.findIndex(c => c.title === "Team");

        const table = $("#cardsTable").DataTable({

            data: data,
            columns: columns,

            paging: false,
            info: true,
            ordering: true,
            searching: true,
            order: [],

            deferRender: true,
            scrollY: "70vh",
            scrollCollapse: true

        });

        // Build unique team list
        const teams = new Set();

        data.forEach(row=>{

            if(!row.Team) return;

            row.Team.split("/").forEach(team=>{
                teams.add(team.trim());
            });

        });

        [...teams].sort().forEach(team=>{

            $("#teamFilter").append(
                `<option value="${team}">${team}</option>`
            );

        });

        // Contains filter
        $("#teamFilter").on("change", function(){

            const value = this.value;

            $.fn.dataTable.ext.search = [];

            if(value !== ""){

                $.fn.dataTable.ext.search.push(function(settings,data){

                    return data[teamColumn]
                        .toLowerCase()
                        .includes(value.toLowerCase());

                });

            }

            table.draw();

        });

        // Clear Filters
        $("#clearFilters").on("click",function(){

            $("#teamFilter").val("");

            table.search("");

            $(".dataTables_filter input").val("");

            $.fn.dataTable.ext.search = [];

            table.draw();

        });

    }

});
