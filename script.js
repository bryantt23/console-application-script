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
  //just grab one for now
  // const delay = 3000;
  // const clickElementWithDelay = function (element, delay) {
  //   setTimeout(function () {
  //     element.click();
  //     applyForJob();
  //   }, delay);
  // };

  // later will have to make this a separate function & click after finishing a card
  // jobCards.forEach(function (element, index) {
  //   clickElementWithDelay(element, delay * (index + 1));
  // });

  const clickNextButton = nextButton => {
    nextButton.click();
    debugger;
  };

  const applyForJob = () => {
    const applyButton = document.querySelector('.jobs-apply-button');
    applyButton.click();
    setTimeout(() => {
      // Step 1: Find all button elements on the page
      const buttons = document.querySelectorAll('button');

      /*TODO handle easy path
create function for has next button
click next button
just click every next

more complicated path
look for review button & submit button

maybe just use debugger for when there's an error




*/

      // Step 2: Find the button with the text "Next"
      const nextButton = Array.from(buttons).find(
        button => button.textContent.trim() === 'Next'
      );

      // Step 3: Check if the button exists
      if (nextButton) {
        console.log('The button with the text "Next" exists on the page.');
        debugger;
        clickNextButton(nextButton);
      } else {
        console.log(
          'The button with the text "Next" does not exist on the page.'
        );
      }
    }, 5000);
  };

  const jobCards = document.querySelectorAll('.job-card-container--clickable');
  const second = jobCards[1];
  console.log('🚀 ~ file: script.js:21 ~ jobCards:', jobCards);
  second.click();
  applyForJob();
}
