const userTab=document.querySelector("[data-userWeather]");
const weatherTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector("weather-container");
const searchform=document.querySelector("[data-searchForm]");
const userInfoContainer=document.querySelector(".user-info-container");
const grantAccessContainer=document.querySelector(".grant-location");
const loadingScreen=document.querySelector(".loading-container");
let currentTab=userTab;
const apiKey = "b011256391b9bdc7060a41426c6c37c7";

currentTab.classList.add("current-tab");

function swithTab(clickedTab) {
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchform.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            searchform.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage(); 
        }
    }
}
userTab.addEventListener("click",()=> swithTab(userTab));

weatherTab.addEventListener("click", () =>swithTab(weatherTab));

//check for coordinates present in session storage
function getfromSessionStorage()
{
    const localStorage = sessionStorage.getItem("user-coordinates");
    if(!localStorage)
    {
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(sessionStorage.getItem("user-coordinates")); 
        fetchUserweatherInfo(coordinates);
        userInfoContainer.classList.remove("active");
    }

};

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else 
    {
        // show alert
    }
}

function showPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates)); 
    console.log(userCoordinates);
    fetchUserweatherInfo(userCoordinates);
}
const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click",getLocation);
async function fetchUserweatherInfo(coordinates)
{
    const {lat,lon}=coordinates;
    // make grant invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    // api call
    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const tempData= await res.json();
        const city=tempData?.name;
        console.log(city);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        console.log(data);

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err)
    {
        loadingScreen.classList.remove("active");
    }
}


function renderWeatherInfo(weatherInfo)
{
    // fetch element
    const cityName = document.querySelector('[data-cityName]');
    cityName.innerText= weatherInfo?.name;

    const countryIcon=document.querySelector('[data-countryIcon]');
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    const weatherDesc=document.querySelector('[data-weatherDesc]');
    weatherDesc.innerText=weatherInfo?.weather?.[0]?.description;

    const weatherIcon=document.querySelector('[data-weatherIcon]');
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    const temp=document.querySelector('[data-temp]');
    temp.innerText=`${weatherInfo?.main?.temp.toFixed(2)} °C`;

    const windspeed=document.querySelector('[data-windSpeed]');
    windspeed.innerText=`${weatherInfo?.wind?.speed.toFixed(2)} m/s`;

    const humidity=document.querySelector('[data-humidity]');
    humidity.innerHTML=`${weatherInfo?.main?.humidity.toFixed(2)} %`;

    const cloud=document.querySelector('[data-cloud]');
    cloud.innerHTML=`${weatherInfo?.clouds?.all.toFixed(2)} %`;
}

const search=document.querySelector("[data-searchInput]");
searchform.addEventListener("submit",(e)=>
{
    e.preventDefault();
    let cityName=search.value;

    if(cityName==="") return;
    console.log(search.value);
    fetchSearchWeatherInfo(search.value);
});

async function fetchSearchWeatherInfo(cityName)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {

    }
}
