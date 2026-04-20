/* template */
import { ElementBuilder, ParentChildBuilder } from "./builders.js";

class ParagraphBuilder extends ParentChildBuilder {
  constructor() {
    super("p", "span");
  }
}

class ListBuilder extends ParentChildBuilder {
  constructor() {
    super("ul", "li");
  }
}

function formatRuntime(runtime) {
  const hours = Math.trunc(runtime / 60);
  const minutes = runtime % 60;
  return hours + "h " + minutes + "m";
}
/* template */

/* template */
function appendMovie(movie, element) {
  new ElementBuilder("article").id(movie.imdbID)
          .append(new ElementBuilder("img").with("src", movie.Poster))
          .append(new ElementBuilder("h1").text(movie.Title))
          .append(new ElementBuilder("p")
              .append(new ElementBuilder("button").text("Edit").class("edit_btn") // changed: was '.text("Edit")' without .class("edit_btn"), transferred from exercise-2
                    .listener("click", () => location.href = "edit.html?imdbID=" + movie.imdbID)))
          .append(new ParagraphBuilder().items(
              "Runtime " + formatRuntime(movie.Runtime),
              "\u2022",
              "Released on " +
                new Date(movie.Released).toLocaleDateString("en-US")))
          .append(new ParagraphBuilder().childClass("genre").items(movie.Genres))
          /* START - transferred from exercise-2: speed-read plot
             changed: was '.append(new ElementBuilder("p").text(movie.Plot))' */
          .append(new ParagraphBuilder().class("plot").childClass("plot-word").items(
              movie.Plot.split(" ").map(function (word) { return word + " "; })
          ))
          /* END - transferred from exercise-2 */
          .append(new ElementBuilder("h2").pluralizedText("Director", movie.Directors))
          .append(new ListBuilder().items(movie.Directors))
          .append(new ElementBuilder("h2").pluralizedText("Writer", movie.Writers))
          .append(new ListBuilder().items(movie.Writers))
          .append(new ElementBuilder("h2").pluralizedText("Actor", movie.Actors))
          .append(new ListBuilder().items(movie.Actors))
          .appendTo(element);
}
/* template */

/* template */
function loadMovies(genre) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector("main");

    while (mainElement.childElementCount > 0) {
      mainElement.firstChild.remove()
    }

    if (xhr.status === 200) {
      const movies = JSON.parse(xhr.responseText)
      for (const movie of movies) {
        appendMovie(movie, mainElement)
      }
    } else {
      mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  }

  const url = new URL("/movies", location.href)

  /* START - Task 1.4. Add query parameter to the url if a genre is given */
  if (genre) {
    url.searchParams.set("genre", genre);
  }
  /* END - Task 1.4 */

  xhr.open("GET", url)
  xhr.send()
}
/* template */

/* template */
window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const listElement = document.querySelector("nav>ul");

    if (xhr.status === 200) {
      const genres = JSON.parse(xhr.responseText);

      /* START - Task 1.3. Add the genre buttons to the listElement and
         initialize them with a click handler that calls the
         loadMovies(...) function above. */
      const allLi = document.createElement("li");
      const allButton = document.createElement("button");
      allButton.textContent = "All";
      allButton.addEventListener("click", function () {
        loadMovies();
      });
      allLi.appendChild(allButton);
      listElement.appendChild(allLi);

      for (const genre of genres) {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = genre;
        button.addEventListener("click", function () {
          loadMovies(genre);
        });
        li.appendChild(button);
        listElement.appendChild(li);
      }

      const firstButton = document.querySelector("nav button");
      if (firstButton) {
        firstButton.click();
      }
      /* END - Task 1.3 */

    } else {
      document.querySelector("body").append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  };
  xhr.open("GET", "/genres");
  xhr.send();
};
/* template */
