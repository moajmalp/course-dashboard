function calculateMetrics() {
    let students = parseInt(document.getElementById('students').value);
    let regularFee = parseFloat(document.getElementById('regularFee').value);
    let discountedFee = parseFloat(document.getElementById('discountedFee').value);
    let discountedStudents = parseInt(document.getElementById('discountedStudents').value);
    let fixedCosts = parseFloat(document.getElementById('fixedCosts').value);
    let variableCost = parseFloat(document.getElementById('variableCost').value);
    let marketingSpend = parseFloat(document.getElementById('marketingSpend').value);

    let regularStudents = students - discountedStudents;
    let totalRevenue = (regularStudents * regularFee) + (discountedStudents * discountedFee);
    let totalVariableCost = students * variableCost;
    let totalCost = fixedCosts + totalVariableCost + marketingSpend;
    let netProfit = totalRevenue - totalCost;
    let contributionMarginPerStudent = regularFee - variableCost;
    let breakEvenStudents = Math.ceil(fixedCosts / contributionMarginPerStudent);
    
    let roi = ((netProfit / totalCost) * 100).toFixed(2);
    let expenseRatio = ((totalCost / totalRevenue) * 100).toFixed(2);
    let profitRatio = ((netProfit / totalRevenue) * 100).toFixed(2);

    document.getElementById("totalRevenue").innerText = totalRevenue;
    document.getElementById("totalCost").innerText = totalCost;
    document.getElementById("netProfit").innerText = netProfit;
    document.getElementById("breakEven").innerText = breakEvenStudents;
    document.getElementById("roi").innerText = roi;
    document.getElementById("expenseRatio").innerText = expenseRatio;
    document.getElementById("profitRatio").innerText = profitRatio;

    updateChart(totalRevenue, totalCost, netProfit);
}

function updateChart(revenue, cost, profit) {
    let ctx = document.getElementById('profitChart').getContext('2d');
    if (window.myChart) window.myChart.destroy();

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
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Dark Mode Toggle
document.getElementById('darkModeToggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
});
