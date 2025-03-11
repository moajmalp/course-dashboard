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

    // Validate Inputs
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
    let breakEvenStudents = averageFeePerStudent > variableCost ? 
        Math.ceil(totalFixedCosts / (averageFeePerStudent - variableCost)) : "N/A";

    // Monthly Profit Calculation
    let monthlyProfit = netProfit * batchesPerMonth;

    // Future Predictions (10% Growth Rate)
    let growthRate = 1.10;  
    let next6MonthsProfit = (monthlyProfit * ((Math.pow(growthRate, 6) - 1) / (growthRate - 1))).toFixed(2);
    let nextYearProfit = (monthlyProfit * ((Math.pow(growthRate, 12) - 1) / (growthRate - 1))).toFixed(2);
    let next5YearsProfit = (monthlyProfit * ((Math.pow(growthRate, 60) - 1) / (growthRate - 1))).toFixed(2);
    let projectedTotalRevenue = (totalRevenue * Math.pow(growthRate, 60)).toFixed(2);

    // Break-even Time Calculation (in months)
    let breakEvenMonths = monthlyProfit > 0 ? Math.ceil(totalFixedCosts / monthlyProfit) : "N/A";

    // Key Analytics Calculations
    let roi = totalCost > 0 ? ((netProfit / totalFixedCosts) * 100).toFixed(2) : "0";  
    let costPerLead = students > 0 ? (marketingSpend / students).toFixed(2) : "0";  
    let costPerAcquisition = students > 0 ? (totalCost / students).toFixed(2) : "0";  
    let retentionRate = students > 0 ? (((students - discountedStudents) / students) * 100).toFixed(2) : "0";  
    let instructorEfficiency = instructorSalary > 0 ? ((netProfit / instructorSalary) * 100).toFixed(2) : "0";  

    // Prevent NaN or Infinity values
    roi = isFinite(roi) ? roi : "0";
    costPerLead = isFinite(costPerLead) ? costPerLead : "0";
    costPerAcquisition = isFinite(costPerAcquisition) ? costPerAcquisition : "0";
    retentionRate = isFinite(retentionRate) ? retentionRate : "0";
    instructorEfficiency = isFinite(instructorEfficiency) ? instructorEfficiency : "0";

    // Update UI with calculated values
    document.getElementById("totalRevenue").innerText = totalRevenue.toLocaleString();
    document.getElementById("totalCost").innerText = totalCost.toLocaleString();
    document.getElementById("netProfit").innerText = netProfit.toLocaleString();
    document.getElementById("breakEven").innerText = breakEvenStudents;
    document.getElementById("monthlyProfit").innerText = monthlyProfit.toLocaleString();
    document.getElementById("next6MonthsProfit").innerText = next6MonthsProfit;
    document.getElementById("nextYearProfit").innerText = nextYearProfit;
    document.getElementById("next5YearsProfit").innerText = next5YearsProfit;
    document.getElementById("breakEvenMonths").innerText = breakEvenMonths;
    document.getElementById("projectedTotalRevenue").innerText = projectedTotalRevenue;

    // Update Key Analytics
    document.getElementById("roi").innerText = roi + "%";
    document.getElementById("costPerLead").innerText = "₹" + costPerLead;
    document.getElementById("costPerAcquisition").innerText = "₹" + costPerAcquisition;
    document.getElementById("retentionRate").innerText = retentionRate + "%";
    document.getElementById("instructorEfficiency").innerText = instructorEfficiency + "%";
}
