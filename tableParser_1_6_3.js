// THE REFUND TOOLKIT
// VERSION 1.6.3
// BY NICHOLAS BERNHARD
// NICHOLAS@POOLDAWG.COM

console.log(
    "THE REFUND TOOLKIT" + "\n" +
    "BY NICHOLAS BERNHARD" + "\n" +
    "VERSION 1.6.3" + "\n" +
    "IN DEVELOPMENT" + "\n" +
    "UPDATES FROM VERSION 1.6.2 \n" +
    " * General code cleanup. \n" +
    "CURRENT RELEASE 1.6.2: 12/27/2019" + "\n" +
    "UPDATES FROM VERSION 1.6.1 \n" +
    " * Streamlined E-Mail Generator, now users only need to \n" +
    "click the button to generate an email \n" +
    "UPDATES FROM VERSION 1.5.1 (12/19/2019): \n" +
    " * Added ability to select return type to E-mail Generator \n" +
    "UPDATES FROM VERSION 1.4.1 (11/13/2019): \n" +
    " * E-mail generator creates link that opens email in default email client \n" +
    " * E-mail generator resets after ten seconds. \n" +
    " * PayPal parser updated to accept changes to how seller refund amount is displayed \n" +
    "UPDATES FROM VERSION 1.4 (11/05/09): \n" +
    " * Fixed bug that prevented contact info from being parsed" +
    "if customer was outside the US \n" +
    " * Added more explanatory text for email generator. \n" +
    " * Added field to copy subject line for return email. \n" +
    " * Disabled credit card mnemonic section by default. " +
    "I suggest activating it when a new employee is being trained. \n" +
    " * Clarified that PayPal parser erases formatted text after text is copied. \n" +
    "UPDATES FROM VERSION 1.3:" + "\n" +
    " * Added email generator for return information" + "\n" +
    "UPDATES FROM VERSION 1.3.3 (09/16/2019):" + "\n" +
    " * Updated parsing to reflect changes in PayPal: " + 
    "Transaction ID will be captured." + "\n" +
    "UPDATES FROM VERSION 1.3.2:" + "\n" +
    " * Updated string validation to reflect changes in PayPal layout." + "\n" +
    "UPDATES FROM VERSION 1.3.1 (07/10/2019):" + "\n" +
    " * Customer email address will now be copied if customer is unverified" + "\n" +
    "UPDATES FROM VERSION 1.3:" + "\n" +
    " * Fixed bug in scope, parsed table will properly disappear." + "\n" +
    " * Style updates" + "\n" +
    "UPDATES FROM VERSION 1.2.1 (06/26/2019):" + "\n" +
    " * Basic error-catching." + "\n" +
    "UPDATES FROM VERSION 1.2:" + "\n" +
    " * Fixing bug for recording original payment amount." + "\n" +
    " * Cleaned parsing code." + "\n" +
    " * Improvements to self-documentation." + "\n" +
    " * Clearer separation of select-text function" + "\n" +
    "UPDATES FROM VERSION 1.1:" + "\n" +
    " * Parsing functionality updated to parse new PayPal refund page." + "\n" +
    " * BizSync material kept in case it is needed." + "\n" +
    " * Version info and tech support contact displayed on page." + "\n" +
    "UPDATES FROM VERSION 1:" + "\n" +
    " * Ability to copy subject line for customer email." + "\n" +
    " * Delete PayPal list after a certain amount of time, " +
    "for security purposes." + "\n" +
    " * Input element now cleared after table is parsed." + "\n" +
    " * Clearer logic on timeout functions."
);

document.addEventListener("DOMContentLoaded", function () {
    function getById(id) {
        return document.getElementById(id);
    }
    let launchTableParserButton = getById("launchTableParser");
    // Code for parsing PayPal table for Multichannel Order Management's
    // Order Instructions Section
    launchTableParserButton.addEventListener("click", function () {

        launchTableParserButton.disabled = true;

        let inputContents = getById("input").value;

        console.log(inputContents);

        function errorCatch(input, requiredSubstring, functionToRun) {
            let inputToMatch = input.substring(0, requiredSubstring.length);
            let errorDetected = (inputToMatch !== requiredSubstring);
            let noErrorDetected = (!errorDetected);
            let probablyGoodInput = (input.length > requiredSubstring.length);
            let errorMessage = "ERROR: THIS INPUT WILL PROBABLY NOT WORK. " +
                "PLEASE RELOAD THE PAGE AND TRY A DIFFERENT INPUT";
            if ((errorDetected) || (noErrorDetected && !probablyGoodInput)) {
                alert(errorMessage);
                console.error(errorMessage);
                document.write("Please reload the web page.");
            } else if (noErrorDetected && probablyGoodInput) {
                functionToRun();
            }
        }
        errorCatch(inputContents, "	 Summary Money Activity Reports Tools", parseTable);

        function parseTable() {
            let inputArray = inputContents.split(" ");

            function evaluateArrayItem(inputArrayItem, inputArrayIndex) {

                let threeB4 = inputArray[inputArrayIndex - 3];
                let twoB4 = inputArray[inputArrayIndex - 2];
                let oneB4 = inputArray[inputArrayIndex - 1];

                let sliceAtTwo = inputArrayItem.slice(2);
                let sliceAtSix = inputArrayItem.slice(6);

                let nonUSVerified = ((twoB4 === "-") && (oneB4 === "Verified"));
                let isVerified = ((twoB4 === "is") && (oneB4 === "Verified"));
                let unverified = (oneB4 === "Unverified");

                function runConditionsCheck() {
                    if (nonUSVerified || isVerified || unverified) {
                        getById("contactInfo").innerHTML = inputArrayItem;
                    } else if ((twoB4 === "PSTTransaction") && (oneB4 === "ID:")) {
                        getById("transactionID").innerHTML = inputArrayItem;
                    } else if ((twoB4 === "USD") && (oneB4 === "Invoice")) {
                        getById("invoiceNumber").innerHTML = sliceAtTwo;
                    } else if ((threeB4 === "Payment") && (twoB4 === "from")) {
                        let dollarSign = inputArrayItem.indexOf("$");
                        let originalPayment = inputArrayItem.slice(dollarSign);
                        getById("originalPayment").innerHTML = originalPayment;
                    } else if ((twoB4 === "Policy") && (oneB4 === "Net")) {
                        getById("sellerRefundAmount").innerHTML = sliceAtSix;
                    } else if ((twoB4 === "details") && (oneB4 === "Gross")) {
                        getById("totalRefundAmount").innerHTML = sliceAtSix;
                    }
                }

                // This avoids crashing at the start with undefined and null
                if (inputArrayIndex > 2) {
                    runConditionsCheck();
                };
            };
            inputArray.forEach(evaluateArrayItem);

            function addMemo() {
                let memoPreface = inputContents.indexOf("to open a claim. ");
                let memoStart = (memoPreface + 22);
                let memoEnd = inputContents.indexOf("Help Contact Sitemap");
                let memoSubstring = inputContents.substring(memoStart, memoEnd);
                getById("memo").innerHTML = memoSubstring;
            };
            addMemo();
            let divForCopiedString = getById("divForString");
            divForCopiedString.classList.remove("hidden");
            divForCopiedString.classList.add("visible");
            getById("input").value = "";

            // Code for clearing an element
            clearElementCalled = false;

            function clearElement(id, duration) {
                
                if (clearElementCalled === false) {
                    clearElementCalled = true;
                    setTimeout(function () {
                        getById(id).innerHTML = "";
                        clearElementCalled = false;
                    }, duration);
                }
            }

            divForCopiedString.addEventListener("click", function () {
                // Code for SelectText may be found in selectText.js
                SelectText("divForString");
                clearElement("divForString", 10000);
            });
        };
    });

    // Code for refund email generator

    function generateReturnEmail() {

        let customerEmailAddress = getById("customerEmailAddressInput").value;
        let customerName = getById("customerNameInput").value;
        let orderNumber = getById("orderNumberInput").value;

        let emailContent = "mailto:[email address]" + "?" +
        "Subject=PoolDawg Return Info ([Order Number Subject Line])" +
        "&" + "body=" +
         "Dear [name]," + "%0D%0A" +
        " " + "%0D%0A" +
        "Here is your return information. Please send your return shipment " +
        "to the following address:" + "%0D%0A" +
        " " + "%0D%0A" +
        "PoolDawg Returns" + "%0D%0A" +
        "[RA Number]" + "%0D%0A" +
        "1380 Overlook Dr." + "%0D%0A" +
        "Lafayette, CO 80026" + "%0D%0A" +
        " " + "%0D%0A" +
        "I will [refund type] upon the item’s return.";

        emailContent = emailContent.replace("[email address]", customerEmailAddress);
        emailContent = emailContent.replace("[name]", customerName);
        emailContent = emailContent.replace("[Order Number Subject Line]", orderNumber);
        emailContent = emailContent.replace("[RA Number]", orderNumber);
        let selectedOption = getById("returnTypeSelect").selectedIndex;
        let returnTypeTextArray = [
            "issue a refund",
            "send out a replacement",
            "apply credit towards a new item",
            "contact you",
            "other"
        ];
        if (selectedOption === (returnTypeTextArray.length - 1)) {
            emailContent = emailContent.replace("I will [refund type] upon the item’s return.", " ");
        } else {
            emailContent = emailContent.replace("[refund type]", returnTypeTextArray[selectedOption]);
        }
        emailContent = emailContent.replace(/ /g, "%20");

        getById("emailGeneratorLink").href = emailContent;
        getById("emailGeneratorSubmit").disabled = true;

        function resetEmailGenerator() {
            getById("customerEmailAddressInput").value = "";
            getById("customerNameInput").value = "";
            getById("orderNumberInput").value = "";
            getById("emailGeneratorSubmit").disabled = false;
            getById("emailGeneratorLink").href = "";
            getById("returnTypeSelect").selectedIndex = "0"
        }

        setTimeout(resetEmailGenerator, 5000);
    }

    getById("emailGeneratorSubmit").addEventListener("click", generateReturnEmail);

    // Code for copying "Refund for returned merchandise" to clipboard
    let inputsForCopying = document.getElementsByClassName("inputToCopy");
    let arrayOfInputs = Array.from(inputsForCopying);
    let textCopiedElement = getById("textCopied");

    function addListener(inputElement) {
        inputElement.addEventListener("click", function () {
            inputElement.select();
            document.execCommand("copy");
            if (clearElementCalled === false) {
                textCopiedElement.innerHTML = "Text copied to clipboard";
                clearElement("textCopied", 2000);
            }
        });
    }
    arrayOfInputs.forEach(addListener);
});

/*

Some observations on creating this code: 

- When working with a plain text editor, proper use of indentation is 
your friend.

- Use spaces instead of tabs. This allows you readily identify blocks of code
by using the arrow keys.

- Use JSLint to take suggestions on keeping code clean.

- More lines is OK if it helps make code self-documenting.

- The above is especially true if keeping lines to 80 characters or less.

- If a line must be longer than 80 characters, break line apart at an operator.

- Keep variables out of for-loops as much as possible, this will make
code more efficient.

*/

// Text-select function taken from https://codepen.io/pramodchoudhari/pen/woKCj
// by Pramod Choudhari: https://codepen.io/pramodchoudhari

function SelectText(element) {

    var doc = document
        , text = doc.getElementById(element)
        , range, selection;
        if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
            document.execCommand("copy");
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
};