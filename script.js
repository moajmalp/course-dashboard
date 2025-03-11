// Register Service Worker for Offline Support
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
        .then(() => console.log("Service Worker Registered ✅"))
        .catch((error) => console.log("Service Worker Registration Failed ❌", error));
}

// Save Input Fields to Local Storage on Change
document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
        localStorage.setItem(input.id, input.value);
    });
    // Restore saved values on page load
    if (localStorage.getItem(input.id)) {
        input.value = localStorage.getItem(input.id);
    }
});

// Show "Offline Mode Active" Message When User is Offline
window.addEventListener("load", () => {
    if (!navigator.onLine) {
        alert("You are in offline mode. Some features may not be available.");
    }
});

function calculateMetrics() {
    // Get user input values
    let students = parseInt(document.getElementById("students").value);
    let regularFee = parseFloat(document.getElementById("regularFee").value);
    let discountedFee = parseFloat(document.getElementById("discountedFee").value);
    let discountedStudents = parseInt(document.getElementById("discountedStudents").value);
    let fixedCosts = parseFloat(document.getElementById("fixedCosts").value);
    let instructorSalary = parseFloat(document.getElementById("instructorSalary").value);
    let variableCost = parseFloat(document.getElementById("variableCost").value);
    let marketingSpend = parseFloat(document.getElementById("marketingSpend").value);
    let courseDuration = parseInt(document.getElementById("courseDuration").value);
    let conversionRate = parseFloat(document.getElementById("conversionRate").value) / 100;
    let dropoutRate = parseFloat(document.getElementById("dropoutRate").value) / 100;
    let materialCost = parseFloat(document.getElementById("materialCost").value);
    let coursesPerYear = parseInt(document.getElementById("coursesPerYear").value);
    let batchesPerMonth = parseInt(document.getElementById("batchesPerMonth").value);

    // Validate Inputs
    if (isNaN(students) || students <= 0 || isNaN(batchesPerMonth) || batchesPerMonth <= 0) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    // Calculate actual paying students after dropout (ensure at least 1)
    let actualStudents = Math.max(1, students - (students * dropoutRate));
    let regularStudents = Math.max(1, actualStudents - discountedStudents);

    // Calculate revenue from regular and discounted students (per course)
    let totalRevenue = (regularStudents * regularFee) + (discountedStudents * discountedFee);

    // Calculate total variable costs including course materials (per course)
    let totalVariableCost = (actualStudents * variableCost) + (actualStudents * materialCost);

    // Calculate total fixed costs (including instructor salary and marketing spend)
    let totalFixedCosts = fixedCosts + instructorSalary + marketingSpend;

    // Calculate total cost and net profit (per course)
    let totalCost = totalFixedCosts + totalVariableCost;
    let netProfit = totalRevenue - totalCost;

    // Calculate Monthly Profit (net profit per course * batches per month)
    let monthlyProfit = netProfit * batchesPerMonth;

    // Calculate average fee per student (weighted average)
    let averageFeePerStudent = (regularFee * regularStudents + discountedFee * discountedStudents) / actualStudents;
    let breakEvenStudents = averageFeePerStudent > variableCost ? 
        Math.ceil(totalFixedCosts / (averageFeePerStudent - variableCost)) : "N/A";

    // Future Predictions (Using a 10% growth rate per year)
    let growthRate = 1.10;
    // Using monthlyProfit for cumulative predictions over months
    let next6MonthsProfit = (monthlyProfit * ((Math.pow(growthRate, 0.5) - 1) / (growthRate - 1))).toFixed(2);
    let nextYearProfit = (monthlyProfit * ((Math.pow(growthRate, 1) - 1) / (growthRate - 1))).toFixed(2);
    let next5YearsProfit = (monthlyProfit * ((Math.pow(growthRate, 5) - 1) / (growthRate - 1))).toFixed(2);

    // Annual Revenue Estimate (per year, from one course instance)
    let annualRevenue = totalRevenue * coursesPerYear;
    // Projected Total Revenue Growth (over 5 years)
    let projectedTotalRevenue = (annualRevenue * Math.pow(growthRate, 5)).toFixed(2);

    // Break-even Time Calculation (in months)
    let breakEvenMonths = monthlyProfit > 0 ? Math.ceil(totalFixedCosts / monthlyProfit) : "N/A";

    // Key Analytics Calculations
    let roi = totalCost > 0 ? ((netProfit / totalCost) * 100).toFixed(2) : "0";
    let costPerLead = conversionRate > 0 ? (marketingSpend / (students * conversionRate)).toFixed(2) : "0";
    let costPerAcquisition = actualStudents > 0 ? ((totalFixedCosts + totalVariableCost) / actualStudents).toFixed(2) : "0";
    let retentionRate = students > 0 ? ((actualStudents / students) * 100).toFixed(2) : "0";
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
