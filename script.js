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

  // const clickNextButton = nextButton => {
  //   nextButton.click();
  //   // debugger;
  // };

  let applicationCompletedPercentage = 0;
  let failedNextAttempts = 0;
  const TIME_DELAY = 1000;
  const MAX_FAILED_ATTEMPTS_ALLOWED = 5;

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

  const getProgressPercentage = () => {
    const progressElement = document.querySelector(
      '[aria-label^="Your job application progress is at"'
    );
    const progressText = progressElement.ariaLabel;
    const progressValue = parseInt(progressText.match(/\d+/)[0]);
    return progressValue;
  };

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
    applicationCompletedPercentage = getProgressPercentage();
    // Step 2: Find the button with the text "Next"
    const nextButton = Array.from(buttons).find(
      button => button.textContent.trim() === 'Next'
    );
    const currentApplicationCompletedPercentage = getProgressPercentage();

    if (
      currentApplicationCompletedPercentage === applicationCompletedPercentage
    ) {
      failedNextAttempts++;
      if (failedNextAttempts > MAX_FAILED_ATTEMPTS_ALLOWED) {
        failedNextAttempts = 0;
        await dismissMoveToNextJobOrPage();
        await dismissMoveToNextJobOrPage();
        clickOnCard();
      }

      applicationCompletedPercentage = currentApplicationCompletedPercentage;
    } else {
      failedNextAttempts = 0;
    }

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
      /*
          need to submit then go to next job card or next page of jobs
          */
      setTimeout(async () => {
        await dismissMoveToNextJobOrPage();
        clickOnCard();
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

  const applyForJob = () => {
    const applyButton = document.querySelector('.jobs-apply-button');
    if (!applyButton) {
      //already applied
      clickOnCard();
    } else {
      applyButton.click();
      handleJobCard();
    }
  };

  let jobIndex = 0;

  const clickOnCard = () => {
    const jobCards = document.querySelectorAll(
      '.job-card-container--clickable'
    );
    const activeJobCard = [...jobCards]
      .map((jobCard, index) => {
        return { jobCard, index };
      })
      .filter((jobCard, index) => {
        return includesClassName(jobCard.jobCard, '--active');
      });
    debugger;
    const targetCard = [...jobCards][jobIndex++];
    targetCard.click();
    setTimeout(applyForJob, 3000);
  };

  clickOnCard();
}
