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
    let batchesPerMonth = parseInt(document.getElementById('batchesPerMonth').value);

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

    // Profit per instructor
    let profitPerInstructor = netProfit / 1; // Assuming 1 instructor

    // Batch Count Calculations
    let batchPerDay = batchesPerMonth / 30;
    let batchPerWeek = batchesPerMonth / 4;
    let batchPerYear = batchesPerMonth * 12;

    // Future Predictions (AI-Based Growth Model)
    let projectedGrowthRate = 1.10; // Assuming 10% growth per batch
    let nextMonthProfit = netProfit * projectedGrowthRate;
    let nextYearProfit = netProfit * Math.pow(projectedGrowthRate, 12);

    // Update UI with calculated values
    document.getElementById("totalRevenue").innerText = totalRevenue.toLocaleString();
    document.getElementById("totalCost").innerText = totalCost.toLocaleString();
    document.getElementById("netProfit").innerText = netProfit.toLocaleString();
    document.getElementById("breakEven").innerText = breakEvenStudents;
    document.getElementById("profitPerInstructor").innerText = profitPerInstructor.toLocaleString();
    document.getElementById("batchPerDay").innerText = batchPerDay.toFixed(2);
    document.getElementById("batchPerWeek").innerText = batchPerWeek.toFixed(2);
    document.getElementById("batchPerMonth").innerText = batchesPerMonth;
    document.getElementById("batchPerYear").innerText = batchPerYear;
    document.getElementById("nextMonthProfit").innerText = nextMonthProfit.toLocaleString();
    document.getElementById("nextYearProfit").innerText = nextYearProfit.toLocaleString();

    // Update analytics
    updateAnalytics(netProfit, totalRevenue, breakEvenStudents, batchPerYear);
}

// Function to update key business analytics
function updateAnalytics(profit, revenue, breakEven, yearlyBatches) {
    let profitMargin = ((profit / revenue) * 100).toFixed(2);
    let efficiencyScore = ((profit / breakEven) * 100).toFixed(2);
    let growthPotential = ((yearlyBatches / 100) * 10).toFixed(2); // 10% of total batches

    document.getElementById("profitMargin").innerText = profitMargin + "%";
    document.getElementById("efficiencyScore").innerText = efficiencyScore + "%";
    document.getElementById("growthPotential").innerText = growthPotential + "%";
}
