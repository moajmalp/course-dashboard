function calculateMetrics() {
    // Get user input values
    let students = parseInt(document.getElementById('students').value);
    let regularFee = parseFloat(document.getElementById('regularFee').value);
    let discountedFee = parseFloat(document.getElementById('discountedFee').value);
    let discountedStudents = parseInt(document.getElementById('discountedStudents').value);
    let fixedCosts = parseFloat(document.getElementById('fixedCosts').value);
    let instructorSalary = parseFloat(document.getElementById('instructorSalary').value);
    let variableCost = parseFloat(document.getElementById('variableCost').value);
    let marketingSpend = parseFloat(document.getElementById('marketingSpend').value);

    // Calculate total revenue
    let regularStudents = students - discountedStudents;
    let totalRevenue = (regularStudents * regularFee) + (discountedStudents * discountedFee);

    // Calculate total costs
    let totalVariableCost = students * variableCost;
    let totalCost = fixedCosts + instructorSalary + totalVariableCost + marketingSpend;

    // Calculate net profit
    let netProfit = totalRevenue - totalCost;

    // Calculate break-even students
    let breakEvenStudents = Math.ceil(fixedCosts / (regularFee - variableCost));

    // Calculate profit per instructor
    let profitPerInstructor = netProfit / 1; // Assuming 1 instructor for now

    // Calculate estimated monthly profit (2 batches per month)
    let monthlyProfit = netProfit * 2;

    // Update UI with calculated values
    document.getElementById("totalRevenue").innerText = totalRevenue.toLocaleString();
    document.getElementById("totalCost").innerText = totalCost.toLocaleString();
    document.getElementById("netProfit").innerText = netProfit.toLocaleString();
    document.getElementById("breakEven").innerText = breakEvenStudents;
    document.getElementById("profitPerInstructor").innerText = profitPerInstructor.toLocaleString();
    document.getElementById("monthlyProfit").innerText = monthlyProfit.toLocaleString();

    // Update charts
    updateCharts(totalRevenue, totalCost, netProfit);
}

// Function to update financial charts dynamically
function updateCharts(revenue, cost, profit) {
    let ctx = document.getElementById('profitChart').getContext('2d');

    // Destroy existing chart before creating a new one
    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Revenue', 'Total Costs', 'Net Profit'],
            datasets: [{
                label: 'Financial Metrics (₹)',
                data: [revenue, cost, profit],
                backgroundColor: ['blue', 'red', 'green']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
