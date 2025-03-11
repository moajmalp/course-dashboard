function calculateMetrics() {
    let students = parseInt(document.getElementById('students').value);
    let regularFee = parseFloat(document.getElementById('regularFee').value);
    let discountedFee = parseFloat(document.getElementById('discountedFee').value);
    let discountedStudents = parseInt(document.getElementById('discountedStudents').value);
    let fixedCosts = parseFloat(document.getElementById('fixedCosts').value);
    let instructorSalary = parseFloat(document.getElementById('instructorSalary').value);
    let variableCost = parseFloat(document.getElementById('variableCost').value);
    let marketingSpend = parseFloat(document.getElementById('marketingSpend').value);

    let regularStudents = students - discountedStudents;
    let totalRevenue = (regularStudents * regularFee) + (discountedStudents * discountedFee);
    let totalVariableCost = students * variableCost;
    let totalCost = fixedCosts + instructorSalary + totalVariableCost + marketingSpend;
    let netProfit = totalRevenue - totalCost;
    let breakEvenStudents = Math.ceil(fixedCosts / (regularFee - variableCost));
    let profitPerInstructor = netProfit / 1;
    let monthlyProfit = netProfit * 2;

    document.getElementById("totalRevenue").innerText = totalRevenue;
    document.getElementById("totalCost").innerText = totalCost;
    document.getElementById("netProfit").innerText = netProfit;
    document.getElementById("breakEven").innerText = breakEvenStudents;
    document.getElementById("profitPerInstructor").innerText = profitPerInstructor;
    document.getElementById("monthlyProfit").innerText = monthlyProfit;

    updateCharts(totalRevenue, totalCost, netProfit, instructorSalary, marketingSpend);
}

function updateCharts(revenue, cost, profit, instructorSalary, marketingSpend) {
    let ctx1 = document.getElementById('profitChart').getContext('2d');
    let ctx2 = document.getElementById('expenseChart').getContext('2d');

    if (window.myChart1) window.myChart1.destroy();
    if (window.myChart2) window.myChart2.destroy();

    window.myChart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Revenue', 'Costs', 'Profit'],
            datasets: [{
                label: 'Amount (₹)',
                data: [revenue, cost, profit],
                backgroundColor: ['blue', 'red', 'green']
            }]
        }
    });

    window.myChart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['Instructor Salary', 'Marketing Spend'],
            datasets: [{
                data: [instructorSalary, marketingSpend],
                backgroundColor: ['purple', 'orange']
            }]
        }
    });
}

// Dark Mode
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
