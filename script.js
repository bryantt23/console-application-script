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
    }, delay);
  };

  jobCards.forEach(function (element, index) {
    clickElementWithDelay(element, delay * (index + 1));
  });
}
