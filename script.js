/*
Plan
https://www.linkedin.com/jobs/search/?currentJobId=3556940185&distance=100&f_AL=true&f_WT=2&geoId=102277331&keywords=reactjs


get the link to every job post
click on every job post with a 2 second delay between clicks, make sure it shows each job

after this works then focus on the url for the first job post
get it to click easy apply button
then go from there, either deal with a form or make it show the next job

eventually make it click to get the next page

*/

{
  const jobCards = document.querySelectorAll('.job-card-container--clickable');
  const delay = 2000;
  const clickElementWithDelay = function (element, delay) {
    setTimeout(function () {
      element.click();
      applyForJob();
    }, delay);
  };

  jobCards.forEach(function (element, index) {
    clickElementWithDelay(element, delay * (index + 1));
  });

  const applyForJob = () => {
    const applyButton = document.querySelector('.jobs-apply-button');
    applyButton.click();
    setTimeout(() => {
      // Step 1: Find all button elements on the page
      const buttons = document.querySelectorAll('button');

      // Step 2: Find the button with the text "Next"
      const nextButton = Array.from(buttons).find(
        button => button.textContent.trim() === 'Next'
      );

      // Step 3: Check if the button exists
      if (nextButton) {
        console.log('The button with the text "Next" exists on the page.');
      } else {
        console.log(
          'The button with the text "Next" does not exist on the page.'
        );
      }
    }, 5000);
  };
}
