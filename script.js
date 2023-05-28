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
  const delayTime = 1000;

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
      }, delayTime);
    });
  };

  const getProgressPercentage = () => {
    const progressElement = document.querySelector(
      '[aria-label^="Your job application progress is at"'
    );
    const progressText = progressElement.ariaLabel;
    const progressValue = parseInt(progressText.match(/\d+/)[0]);
    console.log(
      '🚀 ~ file: script.js:55 ~ getProgressPercentage ~ progressValue:',
      progressValue
    );
    return progressValue;
  };

  const getButtons = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Step 1: Find all button elements on the page
        const buttons = document.querySelectorAll('button');
        resolve(buttons);
      }, delayTime);
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
    applicationCompletedPercentage = getProgressPercentage();
    // Step 2: Find the button with the text "Next"
    const nextButton = Array.from(buttons).find(
      button => button.textContent.trim() === 'Next'
    );
    const currentApplicationCompletedPercentage = getProgressPercentage();
    console.log(
      '🚀 ~ file: script.js:105 ~ handleJobCard ~ currentApplicationCompletedPercentage:',
      currentApplicationCompletedPercentage
    );
    console.log(
      '🚀 ~ file: script.js:84 ~ setTimeout ~ applicationCompletedPercentage:',
      applicationCompletedPercentage
    );
    if (
      currentApplicationCompletedPercentage === applicationCompletedPercentage
    ) {
      failedNextAttempts++;
      console.log(
        '🚀 ~ file: script.js:130 ~ handleJobCard ~ failedNextAttempts:',
        failedNextAttempts
      );

      if (failedNextAttempts > 3) {
        await dismissMoveToNextJobOrPage();
      } else {
        failedNextAttempts = 0;
      }

      applicationCompletedPercentage = currentApplicationCompletedPercentage;
    }
    // Step 3: Check if the button exists
    if (nextButton) {
      console.log('The button with the text "Next" exists on the page.');
      // debugger;
      // clickNextButton(nextButton);
      nextButton.click();
    } else {
      console.log(
        'The button with the text "Next" does not exist on the page.'
      );

      const reviewButton = Array.from(buttons).find(
        button => button.textContent.trim() === 'Review'
      );
      const submitButton = Array.from(buttons).find(
        button => button.textContent.trim() === 'Submit application'
      );
      if (reviewButton) {
        reviewButton.click();
        setTimeout(handleJobCard, delayTime);
      }
      if (submitButton) {
        submitButton.click();
        /*
          need to submit then go to next job card or next page of jobs
          */
        setTimeout(dismissMoveToNextJobOrPage, delayTime);
      }
    }
  };

  const applyForJob = () => {
    const applyButton = document.querySelector('.jobs-apply-button');
    console.log(
      '🚀 ~ file: script.js:133 ~ applyForJob ~ applyButton:',
      applyButton
    );
    debugger;
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
    console.log('🚀 ~ file: script.js:161 ~ jobIndex:', jobIndex);
    const targetCard = [...jobCards][jobIndex++];
    console.log('🚀 ~ file: script.js:21 ~ jobCards:', jobCards);
    targetCard.click();
    setTimeout(applyForJob, 3000);
  };

  clickOnCard();
}
