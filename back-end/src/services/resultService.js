function calculateGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function calculateResult(marks) {
  let totalObtained = 0;
  let totalMarks = 0;
  let passed = true;

  for (const mark of marks) {
    const obtained = Number(mark.obtainedMarks);
    const total = Number(mark.examSubject.totalMarks);
    const passing = Number(mark.examSubject.passingMarks);

    totalObtained += obtained;
    totalMarks += total;

    if (obtained < passing) {
      passed = false;
    }
  }

  const percentage =
    totalMarks > 0
      ? (totalObtained / totalMarks) * 100
      : 0;

  const grade = calculateGrade(percentage);

  return {
    totalObtained,
    totalMarks,
    percentage: Number(percentage.toFixed(2)),
    grade,
    status: passed ? "PASS" : "FAIL",
  };
}

module.exports = {
  calculateResult,
  calculateGrade,
};