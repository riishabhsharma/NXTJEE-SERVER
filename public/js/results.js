// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove 'active' class from all buttons
      tabs.forEach(t => t.classList.remove('active'));

      // Add 'active' to clicked tab
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-tab');

      // Hide all tab content sections
      tabContents.forEach(content => {
        content.style.display = 'none';
      });

      // Show the selected tab content by matching id
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });

  // Optional: Show the first tab content by default on page load
  const firstTab = tabs[0];
  if (firstTab) {
    firstTab.click();
  }
});

// Example data structure
const results = {
  overall: { correct: 32, incorrect: 15, unattempted: 28, total: 75 },
  mathematics: { correct: 12, incorrect: 5, unattempted: 8, total: 25 },
  physics: { correct: 10, incorrect: 7, unattempted: 5, total: 22 },
  chemistry: { correct: 10, incorrect: 3, unattempted: 15, total: 28 },
};

// Elements you want to update
const correctCountEl = document.getElementById('correctCount');
const incorrectCountEl = document.getElementById('incorrectCount');
const unattemptedCountEl = document.getElementById('unattemptedCount');

const tabs = document.querySelectorAll('.tab-btn');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const subject = tab.getAttribute('data-tab');
    const data = results[subject];

    // Update numbers
    correctCountEl.textContent = `${data.correct}/${data.total}`;
    incorrectCountEl.textContent = `${data.incorrect}/${data.total}`;
    unattemptedCountEl.textContent = `${data.unattempted}/${data.total}`;

    // You can also update progress bars or charts here...

    // Switch active tab styling
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});
