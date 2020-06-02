(function() {
  const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "c729a9bc6d8dc599d6cc7e2b07342cbb";

  // Function used to get weather data from OpenWeatherMap API
  const date = new Date().toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const zipElem = document.getElementById("zip");
  const feelingsElem = document.getElementById("feelings");
  const generateBtn = document.getElementById("generate");

  const dateElem = document.getElementById("date");
  const tempElem = document.getElementById("temp");
  const contentElem = document.getElementById("content");

  const getWeatherInfo = async zip =>
    await fetch(`${baseUrl}?zip=${zip}&units=metric&APPID=${apiKey}`); // Get weather info from OpenWeatherMap.org

  const saveEntry = async ({ temperature, date, feeling }) =>
    await fetch("/api/v1/entry", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ temperature, date, feeling })  // Convert response to JSON and store
    });

  const updateUI = async () => {
    try {
      const { temperature, date, feeling } = await (await fetch(
        "/api/v1/entry"
      )).json();

      dateElem.textContent = date;
      tempElem.textContent = temperature;
      contentElem.textContent = feeling;
    } catch (err) {
      console.error(err);
    }
  };

  generateBtn.addEventListener("click", async () => {
    generateBtn.textContent = "Loading......";
    const zip = zipElem.value;
    const feeling = feelingsElem.value;
    const res = await getWeatherInfo(zip);            
    generateBtn.textContent = "Generate";

    try {
      const {
        main: { temp: temperature }
      } = await res.json();
      await saveEntry({ temperature, date, feeling });
      await updateUI();
    } catch (err) {
      console.error(err);
    }
  });
})();
