"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  // Need star on favorite/not-favorite
  const showFavoriteStar = Boolean(currentUser); 

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        
        ${showFavoriteStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Submit new story form */
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault(); 

  // form 
  const author = $('#create-author').val(); 
  const title = $('#create-title').val(); 
  const url = $('#create-url').val(); 
  const username = currentUser.username; 
  const storyData = { title, url, author, username }; 

  const story = await storyList.addStory(currentUser, storyData); 

  const $story = generateStoryMarkup(story); 
  $allStoriesList.prepend($story); 

  // Clear submit form 
  $submitForm.trigger('reset'); 
  // hide form 
  $submitForm.slideUp('slow'); 

}
$submitForm.on('submit', submitNewStory); 

/** Handle deleting a story. */

/******************************************************************************
 * Functionality for list of user's own stories
 */

// function userStoriesOnUI() {
//   console.debug('userStoriesOnUI'); 

// }

/******************************************************************************
 * Functionality for favorites list and starr/un-starr a story
 */

/** Star Favorites */

 function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Put favorites list on page. */

function putFavoritesListOnUI() {
  console.debug('putFavoritesListOnUI'); 

  $myFavoriteStories.empty(); 

  if(currentUser.favorites.length === 0) {
    $myFavoriteStories.append('<h5>Please add favorite stories</h5>'); 
  } else {
    // loop through favorites 
    for(let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story); 
      $myFavoriteStories.append($story); 
    }
  }
  $myFavoriteStories.show(); 
}

/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}
$storiesLists.on("click", ".star", toggleStoryFavorite);


