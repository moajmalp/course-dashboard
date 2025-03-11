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

    // Ensure valid numbers
    if (isNaN(students) || isNaN(regularFee) || isNaN(discountedFee) || isNaN(discountedStudents) || 
        isNaN(fixedCosts) || isNaN(instructorSalary) || isNaN(variableCost) || isNaN(marketingSpend) || 
        isNaN(batchesPerMonth) || students <= 0 || batchesPerMonth <= 0) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    // Calculate revenue from regular and discounted students
    let regularStudents = students - discountedStudents;
    let totalRevenue = (regularStudents * regularFee) + (discountedStudents * discountedFee);

    // Calculate total variable costs
    let totalVariableCost = students * variableCost;

    // Calculate total fixed costs (including instructor salary and marketing spend)
    let totalFixedCosts = fixedCosts + instructorSalary + marketingSpend;

    // Calculate total cost
    let totalCost = totalFixedCosts + totalVariableCost;

    // Calculate net profit
    let netProfit = totalRevenue - totalCost;

    // Corrected Break-even Calculation
    let averageFeePerStudent = (regularFee * regularStudents + discountedFee * discountedStudents) / students;
    let breakEvenStudents = Math.ceil(totalFixedCosts / (averageFeePerStudent - variableCost));

    // Corrected Monthly Profit Calculation
    let monthlyProfit = netProfit * batchesPerMonth;

    // Batch Count Calculations
    let batchPerDay = batchesPerMonth / 30;
    let batchPerWeek = batchesPerMonth / 4;
    let batchPerYear = batchesPerMonth * 12;

    // Future Predictions (AI-Based Growth Model)
    let projectedGrowthRate = 1.10; // Assuming 10% growth per batch
    let nextMonthProfit = monthlyProfit * projectedGrowthRate;
    let next6MonthsProfit = monthlyProfit * (Math.pow(projectedGrowthRate, 6));
    let nextYearProfit = monthlyProfit * Math.pow(projectedGrowthRate, 12);
    let next5YearsProfit = monthlyProfit * Math.pow(projectedGrowthRate, 60);

    // Break-even Time Calculation (in months)
    let breakEvenMonths = Math.ceil(totalFixedCosts / monthlyProfit);

    // Projected Total Revenue Growth (5 Years)
    let projectedTotalRevenue = totalRevenue * Math.pow(projectedGrowthRate, 60);

    // Key Analytics Calculations
    let roi = ((netProfit / totalCost) * 100).toFixed(2); // Return on Investment
    let costPerLead = (marketingSpend / students).toFixed(2); // Cost Per Lead
    let costPerAcquisition = (totalCost / students).toFixed(2); // Cost Per Acquisition (CPA)
    let retentionRate = ((students - discountedStudents) / students * 100).toFixed(2); // Retention Rate
    let instructorEfficiency = ((netProfit / instructorSalary) * 100).toFixed(2); // Instructor Efficiency Score

    // Update UI with calculated values
    document.getElementById("totalRevenue").innerText = totalRevenue.toLocaleString();
    document.getElementById("totalCost").innerText = totalCost.toLocaleString();
    document.getElementById("netProfit").innerText = netProfit.toLocaleString();
    document.getElementById("breakEven").innerText = breakEvenStudents;
    document.getElementById("monthlyProfit").innerText = monthlyProfit.toLocaleString();
    document.getElementById("batchPerDay").innerText = batchPerDay.toFixed(2);
    document.getElementById("batchPerWeek").innerText = batchPerWeek.toFixed(2);
    document.getElementById("batchPerMonth").innerText = batchesPerMonth;
    document.getElementById("batchPerYear").innerText = batchPerYear;
    document.getElementById("nextMonthProfit").innerText = nextMonthProfit.toLocaleString();
    document.getElementById("next6MonthsProfit").innerText = next6MonthsProfit.toLocaleString();
    document.getElementById("nextYearProfit").innerText = nextYearProfit.toLocaleString();
    document.getElementById("next5YearsProfit").innerText = next5YearsProfit.toLocaleString();
    document.getElementById("breakEvenMonths").innerText = breakEvenMonths;
    document.getElementById("projectedTotalRevenue").innerText = projectedTotalRevenue.toLocaleString();
    
    // Update Key Analytics
    document.getElementById("roi").innerText = roi + "%";
    document.getElementById("costPerLead").innerText = "₹" + costPerLead;
    document.getElementById("costPerAcquisition").innerText = "₹" + costPerAcquisition;
    document.getElementById("retentionRate").innerText = retentionRate + "%";
    document.getElementById("instructorEfficiency").innerText = instructorEfficiency + "%";
}
