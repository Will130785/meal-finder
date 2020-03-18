//Get input
const inputText = document.querySelector(".meal-input");
//Get submit button
const submitBtn = document.querySelector("#submit");
//Get random button
const randomBtn = document.querySelector("#random");
//Get result container
const resultContainer = document.querySelector(".results-container");
//Get selection container
const selectionContainer = document.querySelector(".selection-container");
//Recipe id
let recipeID;

//API call
//Create Meal class
class Meal {
    constructor() {

    }

    //Make asynchronous call for recipe search
    async mealRequest(search) {

        //save response
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${search}`);

        //convert response from json
        let responseData = await response.json();

        //return response data
        return responseData;
    }

    //Make asynchronous call for selection
    async recipeRequest(selected) {

        //save response
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selected}`);

        //convert response from json
        let responseData = await response.json();

        //return response data
        return responseData;
    }

    //Make asynchronous call for random selection
    async randomRequest() {

        //save response
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);

        //Convert response from json
        let responseData = await response.json();

        //Return response data
        return responseData;
    }
}

//UI
class UI {
    constructor() {

    }

    displaySearch(img, title, id) {

        const searchHTML = `
        <div class="search-card">
                <div class="card-pic">
                    <img src=${img} class="search-pic">
                </div>
                <div class="card-info">
                    <h3>${title}</h3>
                </div>
                <button class="btn-select">Choose Recipe</button>
                <span class="itemID">${id}</span>
            </div>
        `;

        //Append to result container
        resultContainer.insertAdjacentHTML("beforeend", searchHTML);
    }

    displayRecipe(img, title, desc, ing) {

        const recipeHTML = `
        <div class="recipe-card">
        <div class="recipe-image">
            <img src=${img} class="recipe-pic">
        </div>
        <div class="recipe-content">
            <h3 class="recipe-title">${title}</h3>
            <p class="directions">${desc}</p>
            <div class="ingredients">
                <ul>
                    ${ing.map(item => `<li class="item">${item}</li>`).join(" ")}
                </ul>
            </div>
        </div>
    </div>
        `;

        //Append to selection container
        selectionContainer.innerHTML = recipeHTML;
    }
}


//Controller
//init new meal object
let meal = new Meal();
//init new UI object
let ui = new UI();



//Function invoke method to make http request for search
makeMealRequest = e => {
    //Prevent default submit
    e.preventDefault();
    //clear previous recipe
    selectionContainer.innerHTML = "";
    //Clear previous search result;
    resultContainer.innerHTML = "";
    //Capture data from search
    let searchText = inputText.value;
    meal.mealRequest(searchText)
    //handle data
    .then(res => {
        console.log(res);
    
        //Collect data
        res.meals.forEach((item) => {
            
            let mealObject = {
                image: item.strMealThumb,
                title: item.strMeal,
                id: item.idMeal,
            }
    
    
        //display search results in UI
        ui.displaySearch(mealObject.image, mealObject.title, mealObject.id);
                
        });
    
    
    });

};

//Function to invoke method to make random recipe http request
makeRandomRequest = () => {
    meal.randomRequest()
    .then(res => {

        //Get ingredients
        const ingredients = [];

        //Loop through ingredients and push to ingredients array
        for(let i = 1; i <= 20; i++) {
            if(res.meals[0][`strIngredient${i}`]) {
                ingredients.push(`${res.meals[0][`strIngredient${i}`]} - ${res.meals[0][`strMeasure${i}`]}`);
            } else {
                break;
            }
        }

        //collect data
        recipeObject = {
            image: res.meals[0].strMealThumb,
            title: res.meals[0].strMeal,
            description: res.meals[0].strInstructions,
            ingredients: ingredients

        }

        //clear search results
        resultContainer.innerHTML = "";
        //display selection in ui
        ui.displayRecipe(recipeObject.image, recipeObject.title, recipeObject.description, recipeObject.ingredients);
        
    })
}

//Function to invoke method to make http request for recipe
makeRecipeRequest = () => {

    meal.recipeRequest(recipeID)
    //handle data
    .then(res => {
        console.log(res);

        //Get ingredients
        const ingredients = [];

        //Loop through ingredients and push to ingredients array
        for(let i = 1; i <= 20; i++) {
            if(res.meals[0][`strIngredient${i}`]) {
                ingredients.push(`${res.meals[0][`strIngredient${i}`]} - ${res.meals[0][`strMeasure${i}`]}`);
            } else {
                break;
            }
        }

        //collect data
        recipeObject = {
            image: res.meals[0].strMealThumb,
            title: res.meals[0].strMeal,
            description: res.meals[0].strInstructions,
            ingredients: ingredients

        }

        //clear search results
        resultContainer.innerHTML = "";
        //display selection in ui
        ui.displayRecipe(recipeObject.image, recipeObject.title, recipeObject.description, recipeObject.ingredients);

    });
}

//Event listener for submit button
submitBtn.addEventListener("click", e => {
    //Prevent default submit behaviour
    e.preventDefault();

    //Make request
    makeMealRequest();

    //Clear input
    inputText.value = "";

});

//Event listener for enter press
inputText.addEventListener("keypress", e => {
    //Check enter key was pressed
    if(e.keyCode === 13) {
        //make request
        makeMealRequest(e);

        //Clear input
        inputText.value = "";

    }
});

//Event listener for random button
randomBtn.addEventListener("click", e => {
    //Prevent default button behaviour
    e.preventDefault();

    makeRandomRequest();
})

//Event listener for picking recipe
resultContainer.addEventListener("click", e => {
    //prevent default button behaviour
    e.preventDefault()

    //Check button is clicked
    if(e.target.classList.contains("btn-select")) {
        //Save recipe id to variable
        recipeID = e.target.nextElementSibling.textContent;
        //make request
        makeRecipeRequest(e);
    }

});