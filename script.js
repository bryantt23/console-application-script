{
  let failedApplicationUrls = [];
  let applicationCompletedPercentage = null;
  let clickOnNextButtonFailedCount = 0;
  let jobIndex = 0;
  const TIME_DELAY_SHORT = 1000;
  const TIME_DELAY_LONG = 3000;
  const CLICK_ON_NEXT_BUTTON_MAXIMUM_FAILS = 3;
  const MAX_FAILED_JOB_APPLICATIONS = 3;
  const JOB_CARDS_PER_PAGE = 25;

  // DOM functions
  const getButtons = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const buttons = document.querySelectorAll('button');
        resolve(buttons);
      }, TIME_DELAY_SHORT);
    });
  };

  const elementIncludesClass = (element, targetClass) => {
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
    return new Promise(resolve => {
      const urlList = failedApplicationUrls
        .map(
          (failedCompany, index) =>
            `<li><a href=${failedCompany.url}>Failed job #${
              index + 1
            }, company ${failedCompany.companyName}</li>`
        )
        .join('');

      const htmlContent = `<html>
    <head><title>My HTML File</title></head>
    <body>
    <h1>Failed application urls</h1>
    <ul>
        ${urlList}
    </ul>
    </body>
    </html>`;

      const fileName = 'myFile.html';

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
      resolve();
    });
  };

  // Main functions
  const loadNextPage = () => {
    const paginationButtons = document.querySelectorAll(
      '.artdeco-pagination__indicator--number button'
    );
    paginationButtons.forEach((button, index) => {
      // find currently selected page
      if (button.parentNode.classList.contains('active')) {
        // click on the next page button
        if (paginationButtons[index + 1]) {
          paginationButtons[index + 1].click();
        }
        // exit loop
        return;
      }
    });
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, TIME_DELAY_LONG);
    });
  };

  const logFailedUrl = async () => {
    console.log(`
    
    
    Failed with company ${getCompanyName()}
    
    
    `);
    const url = window.location.href;
    failedApplicationUrls.push({ url, companyName: getCompanyName() });
    if (failedApplicationUrls.length === MAX_FAILED_JOB_APPLICATIONS) {
      await createHtmlFile();
      failedApplicationUrls.splice(0);
    }
  };

  const closeOrDiscardApplication = () => {
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
      }, TIME_DELAY_SHORT);
    });
  };

  const handleJobCard = async () => {
    const applyButton = document.querySelector('.jobs-apply-button');

    if (applyButton) {
      await applyButton.click();
    }

    const buttons = await getButtons();
    // Find the button with the text "Next"
    const nextButton = Array.from(buttons).find(
      button => button.textContent.trim() === 'Next'
    );
    const currentApplicationCompletedPercentage =
      getJobApplicationProgressPercentage();

    // if the previous and current application percentage is the same
    // this means clicking on the next button did not advance the job application
    if (
      currentApplicationCompletedPercentage === applicationCompletedPercentage
    ) {
      clickOnNextButtonFailedCount++;
      console.log(
        '🚀 ~ file: script.js:206 ~ handleJobCard ~ clickOnNextButtonFailedCount:',
        clickOnNextButtonFailedCount
      );

      if (clickOnNextButtonFailedCount > CLICK_ON_NEXT_BUTTON_MAXIMUM_FAILS) {
        // reset the variable, close the job application, move on to the next job
        clickOnNextButtonFailedCount = 0;
        logFailedUrl();
        await closeOrDiscardApplication();
        await closeOrDiscardApplication();
        clickOnNextJobCard();
      }
      applicationCompletedPercentage = currentApplicationCompletedPercentage;
    } else {
      // the job application made progress so reset the failed count
      clickOnNextButtonFailedCount = 0;
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
      setTimeout(handleJobCard, TIME_DELAY_SHORT);
    } else if (submitButton) {
      submitButton.click();
      console.log(`
      
      
      Succeeded with company ${getCompanyName()}
      
      
      `);

      setTimeout(async () => {
        // need to close modal that appears when successfully applying for a job
        await closeOrDiscardApplication();
        clickOnNextJobCard();
      }, TIME_DELAY_LONG);
    } else {
      if (nextButton && !elementIncludesClass(nextButton, 'disabled')) {
        console.log('The button with the text "Next" exists on the page.');
        nextButton.click();
        setTimeout(handleJobCard, TIME_DELAY_SHORT);
      } else {
        console.log(
          'The button with the text "Next" does not exist on the page.'
        );
        setTimeout(handleJobCard, TIME_DELAY_SHORT);
      }
    }
  };

  const getCompanyName = () => {
    // Get all the anchor elements on the page
    const anchorElements = document.querySelectorAll('a');

    // Iterate over the anchor elements
    for (const element of anchorElements) {
      const anchorElement = element;

      // Check if the href includes "/company"
      if (anchorElement.href.includes('/company')) {
        // Get the text content of the anchor element
        const text = anchorElement.textContent;

        // make sure it is text
        if (anchorElement.classList.contains('t-normal')) {
          // remove text whitespace
          return text.trimLeft().trimRight();
        }
      }
    }
  };

  const applyForJob = async () => {
    console.log(`
    

    On the job card for company: ${getCompanyName()}
    
    
    `);
    jobIndex++;
    const applyButton = document.querySelector('.jobs-apply-button');

    if (!applyButton) {
      //already applied
      console.log(`
      
      
      Skipping company: ${getCompanyName()}
      
      
      `);
      clickOnNextJobCard();
    } else {
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
    setTimeout(applyForJob, TIME_DELAY_LONG);
  };

  clickOnNextJobCard();
}
