/*
Plan
https://www.linkedin.com/jobs/search/?currentJobId=3556940185&distance=100&f_AL=true&f_WT=2&geoId=102277331&keywords=reactjs

get the link to every job post
click on every job post with a 2 second delay between clicks, make sure it shows each job

after this works then focus on the url for the first job post
get it to click easy apply button
then go from there, either deal with a form or make it show the next job

eventually make it click to get the next page


console log the failed job application url
  first get it to log on the card click
  then log after max attempts
get it to go to the next page

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

  // const clickNextButton = nextButton => {
  //   nextButton.click();
  //   // debugger;
  // };

  let failedApplicationUrls = [];
  let applicationCompletedPercentage = null;
  let failedNextAttempts = 0;
  let jobIndex = 0;
  const TIME_DELAY = 1000;
  const MAX_FAILED_ATTEMPTS_ALLOWED = 3;
  const MAX_FAILED_URLS = 5;
  const JOB_CARDS_PER_PAGE = 25;

  // DOM functions
  const getButtons = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Step 1: Find all button elements on the page
        const buttons = document.querySelectorAll('button');
        resolve(buttons);
      }, TIME_DELAY);
    });
  };

  const includesClassName = (element, targetClass) => {
    const classList = element.classList;
    for (const classElement of classList) {
      if (classElement.includes(targetClass)) {
        return true;
      }
    }
    return false;
  };

  const getJobApplicationProgressPercentage = () => {
    const progressElement = document.querySelector(
      '[aria-label^="Your job application progress is at"'
    );
    if (!progressElement) {
      return 0;
    }
    const progressText = progressElement.ariaLabel;
    const progressValue = parseInt(progressText.match(/\d+/)[0]);
    return progressValue;
  };

  const createHtmlFile = () => {
    const urlList = failedApplicationUrls
      .map(
        (failedCompany, index) =>
          `<li><a href=${failedCompany.url}>Failed job #${index + 1}, company ${
            failedCompany.companyName
          }</li>`
      )
      .join('');
    const htmlContent = `<html><head><title>My HTML File</title></head>
    <body><h1>Failed application urls</h1>
    <ul>
        ${urlList}
    </ul>
    </body></html>`;
    var fileName = 'myFile.html';

    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Programmatically trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up the temporary URL
    URL.revokeObjectURL(url);
  };

  // Main functions
  const loadNextPage = () => {
    const paginationButtons = document.querySelectorAll(
      '.artdeco-pagination__indicator--number button'
    );
    paginationButtons.forEach((button, index) => {
      if (button.parentNode.classList.contains('active')) {
        //this button is the currently selected page, click on the next page button if it's available
        if (paginationButtons[index + 1]) {
          paginationButtons[index + 1].click();
        }
        //exit loop
        return;
      }
    });
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const logFailedUrl = () => {
    console.log(`Failed with company ${getCompanyName()}`);
    const url = window.location.href;
    failedApplicationUrls.push({ url, companyName: getCompanyName() });
    if (failedApplicationUrls.length === MAX_FAILED_URLS) {
      createHtmlFile();
      failedApplicationUrls = failedApplicationUrls.splice(0);
    }
  };

  const dismissMoveToNextJobOrPage = () => {
    let targetButton;
    const closeModalButton = document.querySelector('.artdeco-modal__dismiss');
    const discardButton = document.querySelector(
      '[data-control-name="discard_application_confirm_btn"]'
    );

    if (discardButton) {
      targetButton = discardButton;
    } else {
      targetButton = closeModalButton;
    }

    targetButton.click();
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, TIME_DELAY);
    });
  };

  // super easy path first
  const handleJobCard = async () => {
    /*TODO handle easy path
        create function for has next button
        click next button
        just click every next

        more complicated path
        look for review button & submit button

        maybe just use debugger for when there's an error
*/

    const buttons = await getButtons();
    // Step 2: Find the button with the text "Next"
    const nextButton = Array.from(buttons).find(
      button => button.textContent.trim() === 'Next'
    );
    const currentApplicationCompletedPercentage =
      getJobApplicationProgressPercentage();

    if (
      currentApplicationCompletedPercentage === applicationCompletedPercentage
    ) {
      failedNextAttempts++;
      console.log(
        '🚀 ~ file: script.js:206 ~ handleJobCard ~ failedNextAttempts:',
        failedNextAttempts
      );

      if (failedNextAttempts > MAX_FAILED_ATTEMPTS_ALLOWED) {
        failedNextAttempts = 0;
        logFailedUrl();
        await dismissMoveToNextJobOrPage();
        await dismissMoveToNextJobOrPage();
        clickOnNextJobCard();
      }

      applicationCompletedPercentage = currentApplicationCompletedPercentage;
    } else {
      failedNextAttempts = 0;
    }

    applicationCompletedPercentage = currentApplicationCompletedPercentage;
    const reviewButton = Array.from(buttons).find(
      button => button.textContent.trim() === 'Review'
    );
    const submitButton = Array.from(buttons).find(
      button => button.textContent.trim() === 'Submit application'
    );

    if (reviewButton) {
      reviewButton.click();
      setTimeout(handleJobCard, TIME_DELAY);
    } else if (submitButton) {
      submitButton.click();
      console.log(`Succeeded with company ${getCompanyName()}`);
      /*
          need to submit then go to next job card or next page of jobs
          */
      setTimeout(async () => {
        await dismissMoveToNextJobOrPage();
        clickOnNextJobCard();
      }, 3000);
    } else {
      // Step 3: Check if the button exists
      if (nextButton && !includesClassName(nextButton, 'disabled')) {
        console.log('The button with the text "Next" exists on the page.');
        // clickNextButton(nextButton);
        nextButton.click();
        setTimeout(handleJobCard, TIME_DELAY);
      } else {
        console.log(
          'The button with the text "Next" does not exist on the page.'
        );
      }
    }
  };

  const getCompanyName = () => {
    // Get all the anchor elements on the page
    const anchorElements = document.querySelectorAll('a');

    // Iterate over the anchor elements
    for (let i = 0; i < anchorElements.length; i++) {
      const anchorElement = anchorElements[i];

      // Check if the href includes "/company"
      if (anchorElement.href.includes('/company')) {
        // Get the text content of the anchor element
        const text = anchorElement.textContent;

        // make sure it is a text
        if (anchorElement.classList.contains('t-normal')) {
          // Do something with the text, such as logging it
          return text.trimLeft().trimRight();
        }
      }
    }
  };

  const applyForJob = async () => {
    console.log(`On job card for company: ${getCompanyName()}`);
    jobIndex++;
    const applyButton = document.querySelector('.jobs-apply-button');

    if (!applyButton) {
      //already applied
      console.log(`Skipping company: ${getCompanyName()}`);
      clickOnNextJobCard();
    } else {
      applyButton.click();
      await handleJobCard();
    }
  };

  const clickOnNextJobCard = async () => {
    const jobCards = document.querySelectorAll(
      '.job-card-container--clickable'
    );
    if (jobIndex === JOB_CARDS_PER_PAGE) {
      jobIndex = 0;
      await loadNextPage();
    }
    console.log(
      '🚀 ~ file: script.js:280 ~ clickOnNextJobCard ~ jobIndex:',
      jobIndex
    );

    applicationCompletedPercentage = null;
    const targetCard = [...jobCards][jobIndex];
    targetCard.scrollIntoView();
    targetCard.click();
    setTimeout(applyForJob, 2000);
  };

  clickOnNextJobCard();
}
