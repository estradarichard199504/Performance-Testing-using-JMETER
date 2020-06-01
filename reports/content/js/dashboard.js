/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4166666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Products"], "isController": false}, {"data": [0.5, 500, 1500, "Terms and Conditions"], "isController": false}, {"data": [0.5, 500, 1500, "Checkout Get-0"], "isController": false}, {"data": [0.5, 500, 1500, "Posts"], "isController": false}, {"data": [0.5, 500, 1500, "Privacy Policy"], "isController": false}, {"data": [0.5, 500, 1500, "About"], "isController": false}, {"data": [0.5, 500, 1500, "Contact"], "isController": false}, {"data": [0.5, 500, 1500, "Checkout Post"], "isController": false}, {"data": [0.5, 500, 1500, "Cart Get"], "isController": false}, {"data": [0.0, 500, 1500, "My Account"], "isController": false}, {"data": [0.5, 500, 1500, "Checkout Get-1"], "isController": false}, {"data": [0.5, 500, 1500, "Cart Post"], "isController": false}, {"data": [0.25, 500, 1500, "Home"], "isController": false}, {"data": [0.0, 500, 1500, "Checkout Get"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18, 0, 0.0, 1072.611111111111, 728, 2238, 2159.7000000000003, 2238.0, 2238.0, 0.3010939747750159, 21.87771494241578, 0.09716292111337861], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Products", 2, 0, 0.0, 974.0, 931, 1017, 1017.0, 1017.0, 1017.0, 0.07160502667287244, 3.4641728724356446, 0.01751665935698686], "isController": false}, {"data": ["Terms and Conditions", 1, 0, 0.0, 808.0, 808, 808, 808.0, 808.0, 808.0, 1.2376237623762376, 42.890189897896036, 0.37104540532178215], "isController": false}, {"data": ["Checkout Get-0", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 1.2738853503184713, 0.5921576433121019, 0.3669884554140127], "isController": false}, {"data": ["Posts", 1, 0, 0.0, 849.0, 849, 849, 849.0, 849.0, 849.0, 1.1778563015312131, 78.66331713780919, 0.3462253386336867], "isController": false}, {"data": ["Privacy Policy", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 1.2285012285012284, 47.73159167690418, 0.36111217751842756], "isController": false}, {"data": ["About", 2, 0, 0.0, 888.0, 848, 928, 928.0, 928.0, 928.0, 0.0771366862079605, 7.465384912064177, 0.018643876793427952], "isController": false}, {"data": ["Contact", 2, 0, 0.0, 807.0, 782, 832, 832.0, 832.0, 832.0, 0.06948787436592314, 2.407612342349385, 0.01693088345146272], "isController": false}, {"data": ["Checkout Post", 1, 0, 0.0, 970.0, 970, 970, 970.0, 970.0, 970.0, 1.0309278350515465, 155.6922519329897, 1.033948131443299], "isController": false}, {"data": ["Cart Get", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 1.3736263736263736, 108.4480704842033, 0.2709692651098901], "isController": false}, {"data": ["My Account", 1, 0, 0.0, 2151.0, 2151, 2151, 2151.0, 2151.0, 2151.0, 0.46490004649000466, 17.682545908879593, 0.0944328219432822], "isController": false}, {"data": ["Checkout Get-1", 1, 0, 0.0, 924.0, 924, 924, 924.0, 924.0, 924.0, 1.0822510822510822, 85.44182054924242, 0.30755377435064934], "isController": false}, {"data": ["Cart Post", 1, 0, 0.0, 919.0, 919, 919, 919.0, 919.0, 919.0, 1.088139281828074, 86.07564268226332, 0.48031147986942324], "isController": false}, {"data": ["Home", 2, 0, 0.0, 1655.5, 1073, 2238, 2238.0, 2238.0, 2238.0, 0.07670770528899629, 11.58466133548115, 0.01809073322977793], "isController": false}, {"data": ["Checkout Get", 1, 0, 0.0, 1710.0, 1710, 1710, 1710.0, 1710.0, 1710.0, 0.5847953216374269, 46.440401133040936, 0.33465826023391815], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
