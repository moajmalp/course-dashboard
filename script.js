// ✅ Register Service Worker for Offline Support
if ("serviceWorker" in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then(registration => {
                console.log("Service Worker Registered ✅", registration.scope);
            })
            .catch(error => {
                console.error("Service Worker Registration Failed ❌", error);
            });
    });
}

// ✅ Save Input Fields to Local Storage on Change
document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
        localStorage.setItem(input.id, input.value);
    });
    // Restore saved values on page load
    if (localStorage.getItem(input.id)) {
        input.value = localStorage.getItem(input.id);
    }
});

// ✅ Check Online/Offline Status and Show Custom Popup
window.addEventListener('load', () => {
    if (!navigator.onLine) {
        popup.show({
            title: 'Connection Status',
            icon: '🔌',
            message: 'You are in offline mode. Some features may not be available.',
            confirmText: 'OK',
            type: 'info',
            showCancel: false,
            theme: 'dark'
        });
    }
});

// ✅ Listen for Online/Offline Events
window.addEventListener('online', () => {
    popup.show({
        title: 'Connection Status',
        icon: '✅',
        message: 'You are back online!',
        confirmText: 'Great',
        type: 'success',
        showCancel: false,
        autoClose: 3000
    });
});

window.addEventListener('offline', () => {
    popup.show({
        title: 'Connection Status',
        icon: '📡',
        message: 'You are offline. Some features may not be available.',
        confirmText: 'OK',
        type: 'warning',
        showCancel: false
    });
});

// Add this validation function
function validateMarketingSplit(input) {
    const value = parseInt(input.value);
    if (value < 0) input.value = 0;
    if (value > 100) input.value = 100;
}

// Add this at the top of your file, outside any function
let historicalData = {
    lastProfit: 0,
    lastRevenue: 0,
    isFirstCalculation: true
};

// Constants for business rules and limits
const BUSINESS_RULES = {
    MIN_BATCH_SIZE: 1,
    MAX_STUDENTS_PER_INSTRUCTOR: 30,
    DEFAULT_MARKETING_SPLIT: 70,
    MIN_RETENTION_RATE: 50,
    MAX_RETENTION_RATE: 100,
    DEFAULT_LIFETIME_MONTHS: 12,
    MIN_MARGIN: -100,
    MAX_MARGIN: 100
};

const GROWTH_RATES = {
    conservative: 0.05,  // 5% growth
    moderate: 0.10,     // 10% growth
    aggressive: 0.15,   // 15% growth
    hyperGrowth: 0.25   // 25% growth for exceptional scenarios
};

function calculateMetrics() {
    try {
        // 1. Enhanced input gathering with strict validation
        const inputs = validateAndNormalizeInputs({
            students: parseInt(document.getElementById("students")?.value),
            regularFee: parseFloat(document.getElementById("regularFee")?.value),
            discountedFee: parseFloat(document.getElementById("discountedFee")?.value),
            discountedStudents: parseInt(document.getElementById("discountedStudents")?.value),
            fixedCosts: parseFloat(document.getElementById("fixedCosts")?.value),
            variableCost: parseFloat(document.getElementById("variableCost")?.value),
            batchesPerMonth: parseInt(document.getElementById("batchesPerMonth")?.value),
            marketingSpend: parseFloat(document.getElementById("marketingSpend")?.value),
            instructorSalary: parseFloat(document.getElementById("instructorSalary")?.value),
            instructorCount: parseInt(document.getElementById("instructorCount")?.value),
            materialCost: parseFloat(document.getElementById("materialCost")?.value),
            marketingSplitRegular: parseInt(document.getElementById("marketingSplitRegular")?.value),
            dropoutRateRegular: parseFloat(document.getElementById("dropoutRateRegular")?.value),
            dropoutRateDiscounted: parseFloat(document.getElementById("dropoutRateDiscounted")?.value)
        });

        // 2. Enhanced derived values with business logic
        const derivedValues = calculateDerivedValues(inputs);

        // 3. Core financial calculations
        const financials = calculateFinancials(inputs, derivedValues);

        // 4. Enhanced break-even analysis
        const breakEvenMetrics = calculateBreakEven(inputs, derivedValues);

        // 5. Performance and efficiency metrics
        const performanceMetrics = calculatePerformanceMetrics(inputs, derivedValues, financials);

        // 6. Student metrics and analytics
        const studentMetrics = calculateStudentMetrics(inputs, derivedValues, financials);

        // 7. Combine all calculations
        const calculations = {
            ...financials,
            ...breakEvenMetrics,
            ...performanceMetrics,
            ...studentMetrics
        };

        // 8. Calculate predictions with enhanced accuracy
        const predictions = calculateEnhancedPredictions({
            currentMetrics: calculations,
            historicalData,
            inputs,
            derivedValues
        });

        // 9. Format and update display with improved error handling
        updateDisplayWithValidation(calculations, predictions);

        // 10. Update historical data with validation
        updateHistoricalData(calculations);

        return { success: true, calculations, predictions };

    } catch (error) {
        handleCalculationError(error);
        return { success: false, error };
    }
}

function validateAndNormalizeInputs(rawInputs) {
    return {
        students: Math.max(0, rawInputs.students || 0),
        regularFee: Math.max(0, rawInputs.regularFee || 0),
        discountedFee: Math.max(0, rawInputs.discountedFee || 0),
        discountedStudents: Math.min(rawInputs.students || 0, Math.max(0, rawInputs.discountedStudents || 0)),
        fixedCosts: Math.max(0, rawInputs.fixedCosts || 0),
        variableCost: Math.max(0, rawInputs.variableCost || 0),
        batchesPerMonth: Math.max(BUSINESS_RULES.MIN_BATCH_SIZE, rawInputs.batchesPerMonth || 1),
        marketingSpend: Math.max(0, rawInputs.marketingSpend || 0),
        instructorSalary: Math.max(0, rawInputs.instructorSalary || 0),
        instructorCount: Math.max(1, rawInputs.instructorCount || 1),
        materialCost: Math.max(0, rawInputs.materialCost || 0),
        marketingSplitRegular: clamp(rawInputs.marketingSplitRegular || BUSINESS_RULES.DEFAULT_MARKETING_SPLIT, 0, 100),
        dropoutRateRegular: clamp(rawInputs.dropoutRateRegular || 0, 0, 100) / 100,
        dropoutRateDiscounted: clamp(rawInputs.dropoutRateDiscounted || 0, 0, 100) / 100
    };
}

function calculateDerivedValues(inputs) {
    const regularStudents = Math.max(0, inputs.students - inputs.discountedStudents);
    const totalFixedCosts = inputs.fixedCosts + (inputs.instructorSalary * inputs.instructorCount) + inputs.marketingSpend;
    const variableCostsPerStudent = inputs.variableCost + inputs.materialCost;
    
    return {
        regularStudents,
        totalFixedCosts,
        variableCostsPerStudent,
        effectiveStudentCapacity: inputs.instructorCount * BUSINESS_RULES.MAX_STUDENTS_PER_INSTRUCTOR,
        utilizationRate: (inputs.students / (inputs.instructorCount * BUSINESS_RULES.MAX_STUDENTS_PER_INSTRUCTOR)) * 100
    };
}

function calculateFinancials(inputs, derived) {
    const totalRevenue = (derived.regularStudents * inputs.regularFee) + 
                        (inputs.discountedStudents * inputs.discountedFee);
    const totalCosts = derived.totalFixedCosts + 
                      (inputs.students * derived.variableCostsPerStudent);
    
    // Calculate growth rates using historical data
    const profitGrowthRate = historicalData.lastProfit !== 0 ?
        ((totalRevenue - totalCosts - historicalData.lastProfit) / Math.abs(historicalData.lastProfit)) * 100 : 0;
    
    const revenueGrowthRate = historicalData.lastRevenue !== 0 ?
        ((totalRevenue - historicalData.lastRevenue) / Math.abs(historicalData.lastRevenue)) * 100 : 0;

    // Calculate Marketing ROI
    const marketingROI = calculateROI(totalRevenue - totalCosts, inputs.marketingSpend);

    // Calculate Marketing Cost per Student Type
    const marketingCostRegular = derived.regularStudents > 0 ?
        (inputs.marketingSpend * inputs.marketingSplitRegular / 100) / derived.regularStudents : 0;
    
    const marketingCostDiscounted = inputs.discountedStudents > 0 ?
        (inputs.marketingSpend * (100 - inputs.marketingSplitRegular) / 100) / inputs.discountedStudents : 0;

    // Calculate Cash Flow Efficiency
    const cashFlowEfficiency = totalRevenue > 0 ? 
        ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;

    // Calculate Revenue Per Employee (considering instructors as employees)
    const revenuePerEmployee = inputs.instructorCount > 0 ?
        totalRevenue / inputs.instructorCount : 0;

    // Calculate Customer Acquisition Cost (CAC)
    const customerAcquisitionCost = inputs.students > 0 ?
        inputs.marketingSpend / inputs.students : 0;

    return {
        totalRevenue,
        totalCosts,
        netProfit: totalRevenue - totalCosts,
        monthlyRevenue: totalRevenue * inputs.batchesPerMonth,
        monthlyExpenses: totalCosts * inputs.batchesPerMonth,
        monthlyProfit: (totalRevenue - totalCosts) * inputs.batchesPerMonth,
        grossMargin: calculatePercentage(totalRevenue - totalCosts, totalRevenue),
        netMargin: calculatePercentage(totalRevenue - totalCosts - inputs.marketingSpend, totalRevenue),
        operatingMargin: calculatePercentage(totalRevenue - totalCosts, totalRevenue),
        marketingROI,
        marketingCostRegular,
        marketingCostDiscounted,
        cashFlowEfficiency: clamp(cashFlowEfficiency, 0, 100),
        revenuePerEmployee,
        customerAcquisitionCost,
        profitGrowthRate: clamp(profitGrowthRate, -100, 1000),
        revenueGrowthRate: clamp(revenueGrowthRate, -100, 1000)
    };
}

function calculateBreakEven(inputs, derived) {
    const regularBreakEven = calculateBreakEvenPoint(
        derived.totalFixedCosts,
        inputs.regularFee,
        derived.variableCostsPerStudent
    );

    const discountedBreakEven = calculateBreakEvenPoint(
        derived.totalFixedCosts,
        inputs.discountedFee,
        derived.variableCostsPerStudent
    );

    return {
        breakEvenRegular: regularBreakEven.units,
        breakEvenDiscounted: discountedBreakEven.units,
        breakEvenRevenueRegular: regularBreakEven.revenue,
        breakEvenRevenueDiscounted: discountedBreakEven.revenue,
        breakEvenMonths: calculateBreakEvenMonths(regularBreakEven.units, inputs.students, inputs.batchesPerMonth)
    };
}

function calculatePerformanceMetrics(inputs, derived, financials) {
    // Calculate ROI
    const roi = calculateROI(financials.netProfit, inputs.marketingSpend);
    
    // Calculate Cost Per Lead and CPA
    const totalLeads = inputs.students * 2; // Assuming 50% conversion rate
    const costPerLead = inputs.marketingSpend / Math.max(1, totalLeads);
    const costPerAcquisition = inputs.marketingSpend / Math.max(1, inputs.students);
    
    // Calculate Instructor Efficiency
    const instructorEfficiency = (inputs.students / Math.max(1, inputs.instructorCount)) / 
                               BUSINESS_RULES.MAX_STUDENTS_PER_INSTRUCTOR * 100;
    
    // Calculate Website and Social Media Metrics
    const websiteConversionRate = (inputs.students / Math.max(1, totalLeads)) * 100;
    const socialMediaEngagement = calculateSocialMediaEngagement(inputs.students);
    
    // Calculate Email Campaign Performance
    const emailCampaignPerformance = calculateEmailPerformance(inputs.students);
    
    // Calculate Resource Utilization
    const resourceUtilization = calculatePercentage(inputs.students, derived.effectiveStudentCapacity);
    
    // Calculate Learning and Platform Metrics
    const averageLearningProgress = calculateLearningProgress(inputs);
    const platformUptime = 99.5; // Assuming 99.5% uptime
    const supportResponseTime = calculateSupportResponseTime(inputs.students);
    const contentEngagementRate = calculateContentEngagement(inputs);
    
    // Calculate Mobile and Assignment Metrics
    const mobileLearningUsage = calculateMobileLearningUsage(inputs.students);
    const assignmentCompletionRate = calculateAssignmentCompletion(inputs);
    
    // Calculate Growth and Retention Metrics
    const studentGrowthRate = historicalData.isFirstCalculation ? 0 :
        ((inputs.students - historicalData.lastStudentCount) / Math.max(1, historicalData.lastStudentCount)) * 100;
    const knowledgeRetentionScore = calculateKnowledgeRetention(inputs);
    const careerPlacementRate = calculateCareerPlacement(inputs);

    return {
        roi,
        costPerLead,
        costPerAcquisition,
        instructorEfficiency,
        websiteConversionRate,
        socialMediaEngagement,
        emailCampaignPerformance,
        resourceUtilization,
        averageLearningProgress,
        platformUptime,
        supportResponseTime,
        contentEngagementRate,
        mobileLearningUsage,
        assignmentCompletionRate,
        studentGrowthRate,
        knowledgeRetentionScore,
        careerPlacementRate,
        averageClassSize: inputs.students / Math.max(1, inputs.instructorCount),
        studentSatisfactionScore: calculateSatisfactionScore(inputs)
    };
}

// Helper functions for key analytics
function calculateSocialMediaEngagement(students) {
    const baseEngagement = 25;
    const studentFactor = Math.min(25, (students / 50) * 5);
    return clamp(baseEngagement + studentFactor, 0, 100);
}

function calculateEmailPerformance(students) {
    const baseRate = 30;
    const scaleFactor = Math.min(20, (students / 100) * 10);
    return clamp(baseRate + scaleFactor, 0, 100);
}

function calculateLearningProgress(inputs) {
    const baseProgress = 75;
    const retentionImpact = (100 - inputs.dropoutRateRegular) * 0.25;
    return clamp(baseProgress + retentionImpact, 0, 100);
}

function calculateSupportResponseTime(students) {
    const baseTime = 2; // Base response time in hours
    const loadFactor = Math.floor(students / 50); // Every 50 students adds delay
    return Math.min(24, baseTime + loadFactor);
}

function calculateContentEngagement(inputs) {
    const baseEngagement = 65;
    const retentionBonus = ((100 - inputs.dropoutRateRegular) * 0.35);
    return clamp(baseEngagement + retentionBonus, 0, 100);
}

function calculateMobileLearningUsage(students) {
    const baseUsage = 45;
    const scaleFactor = Math.min(30, (students / 100) * 15);
    return clamp(baseUsage + scaleFactor, 0, 100);
}

function calculateAssignmentCompletion(inputs) {
    const baseRate = 85;
    const retentionImpact = ((100 - inputs.dropoutRateRegular) * 0.15);
    return clamp(baseRate + retentionImpact, 0, 100);
}

function calculateKnowledgeRetention(inputs) {
    const baseRetention = 70;
    const completionImpact = (100 - inputs.dropoutRateRegular) * 0.3;
    return clamp(baseRetention + completionImpact, 0, 100);
}

function calculateCareerPlacement(inputs) {
    const basePlacement = 60;
    const retentionBonus = ((100 - inputs.dropoutRateRegular) * 0.4);
    return clamp(basePlacement + retentionBonus, 0, 100);
}

function calculateSatisfactionScore(inputs) {
    const baseScore = 7;
    const retentionImpact = ((100 - inputs.dropoutRateRegular) * 0.03);
    return clamp(baseScore + retentionImpact, 0, 10);
}

function calculateStudentMetrics(inputs, derived, financials) {
    // Calculate lifetime values
    const lifetimeValueRegular = calculateLifetimeValue(
        inputs.regularFee,
        inputs.dropoutRateRegular,
        inputs.batchesPerMonth
    );

    const lifetimeValueDiscounted = calculateLifetimeValue(
        inputs.discountedFee,
        inputs.dropoutRateDiscounted,
        inputs.batchesPerMonth
    );

    // Calculate retention metrics
    const retentionRateRegular = 100 - (inputs.dropoutRateRegular * 100);
    const retentionRateDiscounted = 100 - (inputs.dropoutRateDiscounted * 100);
    const overallRetentionRate = derived.regularStudents > 0 || inputs.discountedStudents > 0 ?
        ((derived.regularStudents * retentionRateRegular + inputs.discountedStudents * retentionRateDiscounted) /
        (derived.regularStudents + inputs.discountedStudents)) : 0;

    // Calculate revenue metrics per student
    const revenuePerStudentRegular = inputs.regularFee * inputs.batchesPerMonth;
    const revenuePerStudentDiscounted = inputs.discountedFee * inputs.batchesPerMonth;
    
    // Calculate profit metrics per student
    const costPerStudentRegular = derived.variableCostsPerStudent + 
        (derived.totalFixedCosts * (inputs.marketingSplitRegular / 100) / Math.max(1, derived.regularStudents));
    const costPerStudentDiscounted = derived.variableCostsPerStudent + 
        (derived.totalFixedCosts * ((100 - inputs.marketingSplitRegular) / 100) / Math.max(1, inputs.discountedStudents));

    // Calculate engagement and performance metrics
    const avgClassSize = inputs.students / Math.max(1, inputs.instructorCount);
    const studentTeacherRatio = inputs.students / Math.max(1, inputs.instructorCount);
    const capacityUtilization = (avgClassSize / BUSINESS_RULES.MAX_STUDENTS_PER_INSTRUCTOR) * 100;

    return {
        // Lifetime Value Metrics
        lifetimeStudentValueRegular: lifetimeValueRegular,
        lifetimeStudentValueDiscounted: lifetimeValueDiscounted,
        
        // Revenue Metrics
        revenuePerStudentRegular,
        revenuePerStudentDiscounted,
        averageRevenuePerStudent: (financials.totalRevenue / Math.max(1, inputs.students)),
        
        // Cost Metrics
        costPerStudentRegular,
        costPerStudentDiscounted,
        averageCostPerStudent: (financials.totalCosts / Math.max(1, inputs.students)),
        
        // Profit Metrics
        profitPerStudentRegular: revenuePerStudentRegular - costPerStudentRegular,
        profitPerStudentDiscounted: revenuePerStudentDiscounted - costPerStudentDiscounted,
        averageProfitPerStudent: (financials.netProfit / Math.max(1, inputs.students)),
        
        // Retention Metrics
        retentionRateRegular,
        retentionRateDiscounted,
        overallRetentionRate,
        
        // Capacity Metrics
        averageClassSize: avgClassSize,
        studentTeacherRatio,
        capacityUtilization: clamp(capacityUtilization, 0, 100),
        
        // Performance Indicators
        studentSatisfactionScore: calculateSatisfactionScore(inputs),
        completionRate: calculateCompletionRate(inputs, derived),
        assessmentSuccess: 85 + (overallRetentionRate * 0.15), // Estimated based on retention
        
        // Engagement Metrics
        attendanceRate: 95 - (Math.max(inputs.dropoutRateRegular, inputs.dropoutRateDiscounted) * 10),
        participationScore: 90 - (Math.max(inputs.dropoutRateRegular, inputs.dropoutRateDiscounted) * 15),
        
        // Growth Metrics
        studentGrowthRate: historicalData.isFirstCalculation ? 0 :
            ((inputs.students - historicalData.lastStudentCount) / Math.max(1, historicalData.lastStudentCount)) * 100,
        
        // Marketing Effectiveness
        leadConversionRate: inputs.students > 0 ? 
            (derived.regularStudents / inputs.students) * 100 : 0,
        referralRate: calculateReferralRate(inputs, derived)
    };
}

// Helper functions for student metrics
function calculateLifetimeValue(fee, dropoutRate, batchesPerMonth) {
    const monthlyRevenue = fee * batchesPerMonth;
    const averageLifetimeMonths = dropoutRate > 0 ? 
        Math.min(BUSINESS_RULES.DEFAULT_LIFETIME_MONTHS, 1 / dropoutRate) : 
        BUSINESS_RULES.DEFAULT_LIFETIME_MONTHS;
    return monthlyRevenue * averageLifetimeMonths;
}

function calculateCompletionRate(inputs, derived) {
    const expectedCompletions = derived.regularStudents * (1 - inputs.dropoutRateRegular) +
                              inputs.discountedStudents * (1 - inputs.dropoutRateDiscounted);
    return clamp((expectedCompletions / Math.max(1, inputs.students)) * 100, 0, 100);
}

function calculateReferralRate(inputs, derived) {
    // Estimate referral rate based on retention and class size
    const baseRate = 15; // Base referral rate of 15%
    const retentionBonus = ((100 - (inputs.dropoutRateRegular * 100)) * 0.2);
    const sizeBonus = Math.min(10, (inputs.students / 20) * 2);
    return clamp(baseRate + retentionBonus + sizeBonus, 0, 100);
}

// Utility functions
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function calculatePercentage(value, total) {
    return total > 0 ? clamp((value / total) * 100, BUSINESS_RULES.MIN_MARGIN, BUSINESS_RULES.MAX_MARGIN) : 0;
}

function calculateROI(profit, investment) {
    return investment > 0 ? clamp((profit / investment) * 100, BUSINESS_RULES.MIN_MARGIN, BUSINESS_RULES.MAX_MARGIN) : 0;
}

function calculateBreakEvenPoint(fixedCosts, price, variableCost) {
    if (price <= variableCost) return { units: Infinity, revenue: Infinity };
    const units = Math.ceil(fixedCosts / (price - variableCost));
    return { units, revenue: units * price };
}

function calculateBreakEvenMonths(breakEvenUnits, currentStudents, batchesPerMonth) {
    return currentStudents > 0 ? Math.ceil(breakEvenUnits / (currentStudents * batchesPerMonth)) : Infinity;
}

function handleCalculationError(error) {
    console.error("Calculation error:", error);
    if (typeof popup !== 'undefined') {
        popup.show({
            title: 'Error',
            message: 'Error in calculations. Please verify your inputs.',
            icon: '⚠️',
            type: 'error'
        });
    }
}

function switchTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Deactivate all buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Show selected tab content
    document.getElementById(tabId).classList.add('active');

    // Activate selected button
    event.currentTarget.classList.add('active');
}

function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const allContents = document.querySelectorAll('.accordion-content');

    allContents.forEach(item => {
        if (item.id !== sectionId) {
            item.classList.remove('active');
        }
    });

    content.classList.toggle('active');
}

function incrementValue(inputId) {
    const input = document.getElementById(inputId);
    input.value = parseInt(input.value) + 1;
    input.dispatchEvent(new Event('change'));
}

function decrementValue(inputId) {
    const input = document.getElementById(inputId);
    if (parseInt(input.value) > parseInt(input.min)) {
        input.value = parseInt(input.value) - 1;
        input.dispatchEvent(new Event('change'));
    }
}

function resetForm() {
    popup.show({
        title: 'Reset Form',
        icon: '🔄',
        message: 'Are you sure you want to reset all fields?',
        confirmText: 'Reset',
        showCancel: true,
        type: 'warning',
        onConfirm: () => {
            document.querySelectorAll('input, select').forEach(input => {
                input.value = input.defaultValue;
            });
        }
    });
}

function saveTemplate() {
    const formData = {};
    document.querySelectorAll('input, select').forEach(input => {
        formData[input.id] = input.value;
    });
    localStorage.setItem('courseTemplate', JSON.stringify(formData));
    popup.show({
        title: 'Success',
        message: 'Template saved successfully!',
        icon: '✅'
    });
}

function loadTemplate() {
    const savedData = localStorage.getItem('courseTemplate');
    if (savedData) {
        const formData = JSON.parse(savedData);
        Object.keys(formData).forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) input.value = formData[inputId];
        });
        popup.show({
            title: 'Success',
            message: 'Template loaded successfully!',
            icon: '✅'
        });
    } else {
        popup.show({
            title: 'Error',
            message: 'No saved template found!',
            icon: '⚠️'
        });
    }
}

// Add a reset function to clear historical data
function resetCalculations() {
    historicalData = {
        lastProfit: 0,
        lastRevenue: 0,
        isFirstCalculation: true
    };
    // ... other reset logic ...
}

function calculateEnhancedPredictions({ currentMetrics, historicalData, inputs, derivedValues }) {
    try {
        // Normalize and validate input metrics
        const metrics = {
            monthlyProfit: currentMetrics.monthlyProfit || 0,
            monthlyRevenue: currentMetrics.monthlyRevenue || 0,
            students: inputs.students || 0,
            retentionRate: currentMetrics.overallRetentionRate || 95,
            marketingROI: currentMetrics.marketingROI || 0,
            netMargin: currentMetrics.netMargin || 0,
            utilizationRate: derivedValues.utilizationRate || 0,
            avgRevenuePerStudent: currentMetrics.averageRevenuePerStudent || 0
        };

        // Calculate growth multipliers based on current performance
        const growthMultipliers = calculateGrowthMultipliers(metrics);

        // Enhanced predictions with market factors
        return {
            // Financial Projections
            next6MonthsProfit: calculateProjectedValue(metrics.monthlyProfit * 6, growthMultipliers.shortTerm),
            nextYearProfit: calculateProjectedValue(metrics.monthlyProfit * 12, growthMultipliers.mediumTerm),
            projectedRevenue5Years: calculateProjectedValue(metrics.monthlyRevenue * 12 * 5, growthMultipliers.longTerm),
            
            // Student Growth Projections
            estimatedStudentGrowth1Year: Math.round(metrics.students * (1 + growthMultipliers.studentGrowth)),
            estimatedStudentGrowth5Years: Math.round(metrics.students * Math.pow(1 + growthMultipliers.studentGrowth, 5)),
            
            // Operational Projections
            projectedMonthlyRevenue1Year: calculateProjectedValue(metrics.monthlyRevenue, growthMultipliers.revenue),
            projectedOperatingCosts1Year: calculateProjectedValue(metrics.monthlyRevenue * 0.7, growthMultipliers.costs),
            expectedROI3Years: calculateProjectedROI(metrics.marketingROI, growthMultipliers.marketing),
            
            // Market Position Projections
            projectedMarketShare2Years: calculateMarketShareProjection(metrics.netMargin, metrics.students),
            expectedStaffRequirements1Year: calculateStaffingNeeds(metrics.students, growthMultipliers.studentGrowth),
            
            // Infrastructure and Investment Projections
            projectedInfrastructureCosts2Years: calculateInfrastructureCosts(metrics.monthlyRevenue, growthMultipliers),
            expectedMarketingBudgetNextYear: calculateMarketingBudget(metrics.monthlyRevenue, metrics.marketingROI),
            projectedCourseExpansion2Years: calculateCourseExpansion(metrics.netMargin, metrics.students),
            
            // Student Success Metrics
            expectedStudentRetentionNextYear: calculateProjectedRetention(metrics.retentionRate),
            projectedOnlineGrowth2Years: calculateOnlineGrowth(metrics.utilizationRate),
            expectedRevenuePerCourse1Year: calculateRevenuePerCourse(metrics.monthlyRevenue, growthMultipliers),
            
            // Business Health Indicators
            projectedBreakEvenPointFuture: calculateBreakEvenProjection(metrics.netMargin),
            expectedProfitMargin2Years: calculateProfitMarginProjection(metrics.netMargin),
            projectedCashFlow1Year: calculateProjectedCashFlow(metrics.monthlyProfit, growthMultipliers),
            
            // Strategic Investments
            expectedTechnologyInvestment2Years: calculateTechnologyInvestment(metrics.monthlyRevenue),
            projectedStudentSatisfaction1Year: calculateStudentSatisfaction(metrics.retentionRate),
            expectedCompetitionGrowth2Years: calculateCompetitionGrowth(metrics.netMargin),
            
            // Expansion Metrics
            projectedInternationalExpansion3Years: calculateInternationalExpansion(metrics.netMargin),
            expectedFacultyGrowth2Years: calculateFacultyGrowth(metrics.students, growthMultipliers),
            projectedBrandValueGrowth3Years: calculateBrandValueGrowth(metrics.netMargin, metrics.retentionRate)
        };
    } catch (error) {
        console.error("Enhanced predictions calculation error:", error);
        throw error;
    }
}

// Helper functions for enhanced predictions
function calculateGrowthMultipliers(metrics) {
    const baseMultipliers = { ...GROWTH_RATES };
    
    // Adjust growth rates based on current performance
    const performanceAdjustment = calculatePerformanceAdjustment(metrics);
    
    return {
        shortTerm: baseMultipliers.conservative * (1 + performanceAdjustment),
        mediumTerm: baseMultipliers.moderate * (1 + performanceAdjustment),
        longTerm: baseMultipliers.aggressive * (1 + performanceAdjustment),
        studentGrowth: baseMultipliers.moderate * (1 + metrics.retentionRate / 200),
        revenue: baseMultipliers.moderate * (1 + metrics.netMargin / 100),
        costs: baseMultipliers.conservative * (1 + metrics.utilizationRate / 200),
        marketing: baseMultipliers.moderate * (1 + metrics.marketingROI / 150)
    };
}

function calculatePerformanceAdjustment(metrics) {
    const retentionFactor = metrics.retentionRate > 90 ? 0.2 : 0;
    const marginFactor = metrics.netMargin > 30 ? 0.2 : 0;
    const roiFactor = metrics.marketingROI > 50 ? 0.1 : 0;
    
    return retentionFactor + marginFactor + roiFactor;
}

function calculateProjectedValue(baseValue, growthRate) {
    return Math.round(baseValue * (1 + growthRate));
}

function calculateProjectedROI(currentROI, growthMultiplier) {
    return Math.min(200, currentROI * (1 + growthMultiplier));
}

function calculateMarketShareProjection(netMargin, students) {
    const baseShare = 5;
    const marginBonus = netMargin > 0 ? (netMargin / 5) : 0;
    const scaleBonus = Math.min(5, students / 100);
    return Math.min(30, baseShare + marginBonus + scaleBonus);
}

function calculateStaffingNeeds(currentStudents, growthRate) {
    const projectedStudents = currentStudents * (1 + growthRate);
    return Math.ceil(projectedStudents / BUSINESS_RULES.MAX_STUDENTS_PER_INSTRUCTOR);
}

function calculateInfrastructureCosts(monthlyRevenue, multipliers) {
    const baseInvestment = monthlyRevenue * 12 * 0.15;
    return Math.round(baseInvestment * (1 + multipliers.mediumTerm));
}

function calculateMarketingBudget(monthlyRevenue, marketingROI) {
    const baseMarketing = monthlyRevenue * 12 * 0.2;
    const roiAdjustment = marketingROI > 50 ? 1.2 : 1;
    return Math.round(baseMarketing * roiAdjustment);
}

function calculateCourseExpansion(netMargin, students) {
    const baseCourses = 3;
    const marginBonus = Math.floor(netMargin / 10);
    const scaleBonus = Math.floor(students / 100);
    return Math.min(20, baseCourses + marginBonus + scaleBonus);
}

function calculateProjectedRetention(currentRetention) {
    return Math.min(98, currentRetention + 2);
}

function calculateOnlineGrowth(utilizationRate) {
    const baseGrowth = 20;
    const utilizationBonus = utilizationRate > 80 ? 10 : 0;
    return Math.min(100, baseGrowth + utilizationBonus);
}

function calculateRevenuePerCourse(monthlyRevenue, multipliers) {
    return Math.round((monthlyRevenue / 3) * (1 + multipliers.revenue));
}

function calculateBreakEvenProjection(netMargin) {
    return Math.max(3, 12 - (netMargin / 5));
}

function calculateProfitMarginProjection(currentMargin) {
    return Math.min(40, currentMargin + 5);
}

function calculateProjectedCashFlow(monthlyProfit, multipliers) {
    return Math.round(monthlyProfit * 12 * (1 + multipliers.shortTerm));
}

function calculateTechnologyInvestment(monthlyRevenue) {
    return Math.round(monthlyRevenue * 0.1 * 24);
}

function calculateStudentSatisfaction(retentionRate) {
    return Math.min(98, 85 + (retentionRate * 0.15));
}

function calculateCompetitionGrowth(netMargin) {
    return 10 + (netMargin * 0.2);
}

function calculateInternationalExpansion(netMargin) {
    return Math.ceil(1 + (netMargin / 20));
}

function calculateFacultyGrowth(students, multipliers) {
    return Math.ceil((students / 25) * (1 + multipliers.studentGrowth));
}

function calculateBrandValueGrowth(netMargin, retentionRate) {
    const baseGrowth = 20;
    const marginBonus = netMargin > 30 ? 10 : 0;
    const retentionBonus = retentionRate > 90 ? 10 : 0;
    return Math.min(100, baseGrowth + marginBonus + retentionBonus);
}

function updateDisplayWithValidation(calculations, predictions) {
    try {
        // Financial Summary Updates with proper formatting
        const financialUpdates = [
            { id: 'totalRevenue', value: calculations.totalRevenue, isCurrency: true },
            { id: 'totalCost', value: calculations.totalCosts, isCurrency: true },
            { id: 'netProfit', value: calculations.netProfit, isCurrency: true },
            { id: 'marketingROI', value: calculations.marketingROI, isPercentage: true },
            { id: 'monthlyProfit', value: calculations.monthlyProfit, isCurrency: true },
            { id: 'grossMargin', value: calculations.grossMargin, isPercentage: true },
            { id: 'netMargin', value: calculations.netMargin, isPercentage: true },
            { id: 'operatingMargin', value: calculations.operatingMargin, isPercentage: true },
            { id: 'monthlyRevenue', value: calculations.monthlyRevenue, isCurrency: true },
            { id: 'monthlyExpenses', value: calculations.monthlyExpenses, isCurrency: true },
            { id: 'profitGrowthRate', value: calculations.profitGrowthRate, isPercentage: true },
            { id: 'revenueGrowthRate', value: calculations.revenueGrowthRate, isPercentage: true },
            { id: 'capacityUtilization', value: calculations.capacityUtilization, isPercentage: true },
            { id: 'cashFlowEfficiency', value: calculations.cashFlowEfficiency, isPercentage: true },
            { id: 'resourceUtilization', value: calculations.resourceUtilization, isPercentage: true },
            { id: 'revenuePerEmployee', value: calculations.revenuePerEmployee, isCurrency: true },
            { id: 'customerAcquisitionCost', value: calculations.customerAcquisitionCost, isCurrency: true },
            
            // Split metrics with proper formatting
            { id: 'costPerStudentRegular', value: calculations.costPerStudentRegular, isCurrency: true },
            { id: 'costPerStudentDiscounted', value: calculations.costPerStudentDiscounted, isCurrency: true },
            { id: 'breakEvenRegular', value: calculations.breakEvenRegular },
            { id: 'breakEvenDiscounted', value: calculations.breakEvenDiscounted },
            { id: 'breakEvenRevenueRegular', value: calculations.breakEvenRevenueRegular, isCurrency: true },
            { id: 'breakEvenRevenueDiscounted', value: calculations.breakEvenRevenueDiscounted, isCurrency: true },
            { id: 'revenuePerStudentRegular', value: calculations.revenuePerStudentRegular, isCurrency: true },
            { id: 'revenuePerStudentDiscounted', value: calculations.revenuePerStudentDiscounted, isCurrency: true },
            { id: 'retentionRateRegular', value: calculations.retentionRateRegular, isPercentage: true },
            { id: 'retentionRateDiscounted', value: calculations.retentionRateDiscounted, isPercentage: true },
            { id: 'lifetimeStudentValueRegular', value: calculations.lifetimeStudentValueRegular, isCurrency: true },
            { id: 'lifetimeStudentValueDiscounted', value: calculations.lifetimeStudentValueDiscounted, isCurrency: true },
            { id: 'profitPerStudentRegular', value: calculations.profitPerStudentRegular, isCurrency: true },
            { id: 'profitPerStudentDiscounted', value: calculations.profitPerStudentDiscounted, isCurrency: true },
            { id: 'marketingCostRegular', value: calculations.marketingCostRegular, isCurrency: true },
            { id: 'marketingCostDiscounted', value: calculations.marketingCostDiscounted, isCurrency: true }
        ];

        // Key Analytics Updates with proper formatting
        const analyticsUpdates = [
            { id: 'roi', value: calculations.roi, isPercentage: true },
            { id: 'costPerLead', value: calculations.costPerLead, isCurrency: true },
            { id: 'costPerAcquisition', value: calculations.costPerAcquisition, isCurrency: true },
            { id: 'instructorEfficiency', value: calculations.instructorEfficiency, isPercentage: true },
            { id: 'leadConversionRate', value: calculations.leadConversionRate, isPercentage: true },
            { id: 'satisfactionScore', value: calculations.studentSatisfactionScore, suffix: '' },
            { id: 'completionRate', value: calculations.completionRate, isPercentage: true },
            { id: 'avgClassSize', value: calculations.averageClassSize, suffix: '' },
            { id: 'attendanceRate', value: calculations.attendanceRate, isPercentage: true },
            { id: 'websiteConversion', value: calculations.websiteConversionRate, isPercentage: true },
            { id: 'socialEngagement', value: calculations.socialMediaEngagement, isPercentage: true },
            { id: 'emailPerformance', value: calculations.emailCampaignPerformance, isPercentage: true },
            { id: 'referralRate', value: calculations.referralRate, isPercentage: true },
            { id: 'resourceUtil', value: calculations.resourceUtilization, isPercentage: true },
            { id: 'learningProgress', value: calculations.averageLearningProgress, isPercentage: true },
            { id: 'studentTeacherRatio', value: calculations.studentTeacherRatio, suffix: '' },
            { id: 'assessmentSuccess', value: calculations.assessmentSuccess, isPercentage: true },
            { id: 'platformUptime', value: calculations.platformUptime, isPercentage: true },
            { id: 'responseTime', value: calculations.supportResponseTime, suffix: '' },
            { id: 'contentEngagement', value: calculations.contentEngagementRate, isPercentage: true },
            { id: 'mobileUsage', value: calculations.mobileLearningUsage, isPercentage: true },
            { id: 'assignmentCompletion', value: calculations.assignmentCompletionRate, isPercentage: true },
            { id: 'studentGrowth', value: calculations.studentGrowthRate, isPercentage: true },
            { id: 'retentionScore', value: calculations.knowledgeRetentionScore, isPercentage: true },
            { id: 'placementRate', value: calculations.careerPlacementRate, isPercentage: true }
        ];

        // Future Predictions Updates with proper formatting
        const predictionUpdates = [
            { id: 'next6MonthsProfit', value: predictions.next6MonthsProfit, isCurrency: true },
            { id: 'nextYearProfit', value: predictions.nextYearProfit, isCurrency: true },
            { id: 'projectedTotalRevenue', value: predictions.projectedRevenue5Years, isCurrency: true },
            { id: 'studentGrowth1Year', value: predictions.estimatedStudentGrowth1Year, suffix: '' },
            { id: 'studentGrowth5Years', value: predictions.estimatedStudentGrowth5Years, suffix: '' },
            { id: 'projectedMonthlyRevenue1Year', value: predictions.projectedMonthlyRevenue1Year, isCurrency: true },
            { id: 'projectedCosts1Year', value: predictions.projectedOperatingCosts1Year, isCurrency: true },
            { id: 'expectedROI3Years', value: predictions.expectedROI3Years, isPercentage: true },
            { id: 'projectedMarketShare', value: predictions.projectedMarketShare2Years, isPercentage: true },
            { id: 'staffRequirements1Year', value: predictions.expectedStaffRequirements1Year },
            { id: 'infrastructureCosts2Years', value: predictions.projectedInfrastructureCosts2Years, isCurrency: true },
            { id: 'marketingBudgetNextYear', value: predictions.expectedMarketingBudgetNextYear, isCurrency: true },
            { id: 'courseExpansion2Years', value: predictions.projectedCourseExpansion2Years, suffix: '' },
            { id: 'retentionNextYear', value: predictions.expectedStudentRetentionNextYear, isPercentage: true },
            { id: 'onlineGrowth2Years', value: predictions.projectedOnlineGrowth2Years, isPercentage: true },
            { id: 'revenuePerCourse1Year', value: predictions.expectedRevenuePerCourse1Year, isCurrency: true },
            { id: 'futureBreakEvenMonths', value: predictions.projectedBreakEvenPointFuture, suffix: '' },
            { id: 'profitMargin2Years', value: predictions.expectedProfitMargin2Years, isPercentage: true },
            { id: 'cashFlow1Year', value: predictions.projectedCashFlow1Year, isCurrency: true },
            { id: 'techInvestment2Years', value: predictions.expectedTechnologyInvestment2Years, isCurrency: true },
            { id: 'studentSatisfaction1Year', value: predictions.projectedStudentSatisfaction1Year, isPercentage: true },
            { id: 'competitionGrowth2Years', value: predictions.expectedCompetitionGrowth2Years, isPercentage: true },
            { id: 'internationalExpansion3Years', value: predictions.projectedInternationalExpansion3Years, suffix: '' },
            { id: 'facultyGrowth2Years', value: predictions.expectedFacultyGrowth2Years, suffix: '' },
            { id: 'brandValueGrowth3Years', value: predictions.projectedBrandValueGrowth3Years, isPercentage: true }
        ];

        // Update all metrics
        [...financialUpdates, ...analyticsUpdates, ...predictionUpdates].forEach(
            ({ id, value, isCurrency, isPercentage, suffix = '' }) => {
                updateMetricDisplay(id, value, isCurrency, isPercentage, suffix);
            }
        );

    } catch (error) {
        console.error("Display update error:", error);
        throw error;
    }
}

// Helper function to update metric display
function updateMetricDisplay(id, value, isCurrency = false, isPercentage = false, suffix = '') {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
        return;
    }

    try {
        // Clean up the value first
        let formattedValue = value;
        
        // Handle currency formatting
        if (isCurrency) {
            // Remove any existing ₹ symbols and format the number
            formattedValue = value.toString().replace(/[₹,]/g, '');
            formattedValue = '' + Math.round(parseFloat(formattedValue)).toLocaleString('en-IN');
        }
        // Handle percentage formatting
        else if (isPercentage) {
            // Remove any existing % symbols and format the number
            formattedValue = value.toString().replace(/[%]/g, '');
            formattedValue = parseFloat(formattedValue).toFixed(1) + '';
        }
        // Handle special cases
        else if (typeof value === 'number') {
            formattedValue = Math.round(value).toLocaleString('en-IN');
        }

        // Clean up duplicate symbols and spaces
        let displayValue = formattedValue + suffix;
        displayValue = displayValue
            .replace(/₹₹/g, '₹')           // Remove duplicate ₹
            .replace(/%%/g, '%')           // Remove duplicate %
            .replace(/\/10\/10/g, '/10')   // Remove duplicate /10
            .replace(/students students/g, 'students')  // Remove duplicate 'students'
            .replace(/hrs hrs/g, 'hrs')    // Remove duplicate 'hrs'
            .replace(/::1/g, ':1')         // Fix ratio format
            .replace(/courses courses/g, 'courses')  // Remove duplicate 'courses'
            .replace(/members members/g, 'members')  // Remove duplicate 'members'
            .replace(/countries countries/g, 'countries')  // Remove duplicate 'countries'
            .replace(/months months/g, 'months')  // Remove duplicate 'months'
            .replace(/ +/g, ' ')           // Remove multiple spaces
            .trim();                       // Remove leading/trailing spaces

        // Special handling for student-teacher ratio
        if (id === 'studentTeacherRatio') {
            displayValue = displayValue.replace(/(\d+):1:1/, '$1:1');
        }

        // Special handling for satisfaction score
        if (id === 'satisfactionScore') {
            displayValue = displayValue.replace(/\/10\/10/, '/10');
        }

        element.textContent = displayValue;
    } catch (error) {
        console.warn(`Error formatting value for ${id}:`, error);
        element.textContent = 'N/A';
    }
}

function updateHistoricalData(calculations) {
    historicalData = {
        lastProfit: calculations.netProfit || 0,
        lastRevenue: calculations.totalRevenue || 0,
        lastStudentCount: calculations.students || 0,
        lastTotalCosts: calculations.totalCosts || 0,
        isFirstCalculation: false
    };
}

// Update the window exports at the bottom of the file
window.calculateMetrics = calculateMetrics;
window.calculateEnhancedPredictions = calculateEnhancedPredictions;
window.switchTab = switchTab;
window.toggleSection = toggleSection;
window.incrementValue = incrementValue;
window.decrementValue = decrementValue;
window.resetForm = resetForm;
window.saveTemplate = saveTemplate;
window.loadTemplate = loadTemplate;

