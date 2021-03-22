"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  // main-nav-links hidden/show (submit, favorites, mystories) 
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When user clicks on "submit" form shows */
function navSubmitStoryClick(evt) {
  console.debug('navSubmitStoryClick', evt); 
  hidePageComponents(); 
  $allStoriesList.show(); 
  $submitForm.show(); 
}
// click submit link
$navSubmitStory.on('click', navSubmitStoryClick)

/** Show favorite stories on click on "favorites" */

/** Show My Stories on clicking "my stories" */

/** Hide everything but profile on click on "profile" */
