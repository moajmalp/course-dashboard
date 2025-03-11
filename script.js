function calculateMetrics() {
    // Input values
    let students = parseInt(document.getElementById('students').value);
    let regularFee = parseFloat(document.getElementById('regularFee').value);
    let discountedFee = parseFloat(document.getElementById('discountedFee').value);
    let discountedStudents = parseInt(document.getElementById('discountedStudents').value);
    let fixedCosts = parseFloat(document.getElementById('fixedCosts').value);
    let variableCost = parseFloat(document.getElementById('variableCost').value);
    let marketingSpend = parseFloat(document.getElementById('marketingSpend').value);

    // Revenue calculation
    let regularStudents = students - discountedStudents;
    let totalRevenue = (regularStudents * regularFee) + (discountedStudents * discountedFee);

    // Cost calculation
    let totalVariableCost = students * variableCost;
    let totalCost = fixedCosts + totalVariableCost + marketingSpend;

    // Profit calculation
    let netProfit = totalRevenue - totalCost;

    // Break-even calculation
    let contributionMarginPerStudent = regularFee - variableCost;
    let breakEvenStudents = Math.ceil(fixedCosts / contributionMarginPerStudent);

    // Ratios
    let roi = ((netProfit / totalCost) * 100).toFixed(2);
    let expenseRatio = ((totalCost / totalRevenue) * 100).toFixed(2);
    let profitRatio = ((netProfit / totalRevenue) * 100).toFixed(2);

    // Update HTML elements
    document.getElementById("totalRevenue").innerText = totalRevenue;
    document.getElementById("totalCost").innerText = totalCost;
    document.getElementById("netProfit").innerText = netProfit;
    document.getElementById("breakEven").innerText = breakEvenStudents;
    document.getElementById("roi").innerText = roi;
    document.getElementById("expenseRatio").innerText = expenseRatio;
    document.getElementById("profitRatio").innerText = profitRatio;

    // Update Chart.js Graph
    updateChart(totalRevenue, totalCost, netProfit);
}

// Chart.js function
function updateChart(revenue, cost, profit) {
    let ctx = document.getElementById('profitChart').getContext('2d');
    if (window.myChart) window.myChart.destroy(); // Destroy previous chart to avoid duplicates

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Revenue', 'Costs', 'Profit'],
            datasets: [{
                label: 'Amount (₹)',
                data: [revenue, cost, profit],
                backgroundColor: ['blue', 'red', 'green']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
