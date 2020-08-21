function main() {

  const locationInput = $('#zip');
  const feelingsInput = $('#feelings');
  const generateBtn = $('#generate');
  const dateEntry = $('#date');
  const weatherEntry = $('#temp');
  const feelingEntry = $('#content');

  function $(selector) {
    if (selector.includes('#')) {
      return document.querySelector(selector);
    }
    return document.querySelectorAll(selector);
  }


  const environment = {
    API: {
      weather: '/weather',
      entries: '/entry'
    }
  };

  async function generateNewRecord(e) {
    try {
      e.preventDefault();
      const weatherRequest = await getWeatherInfo();
      const weatherResponsePayload = await parsePayload(weatherRequest);
      console.log(weatherResponsePayload);
      const entryRequest = await postFeelings(weatherResponsePayload);
      if (entryRequest.status !== 201) {
        throw new Error('POST failed');
      }
      const entryResponse = await parsePayload(entryRequest);
      console.log(entryResponse);
      save(entryResponse);
      updateUI(entryResponse);
    } catch (e) {
      console.log(e);
    }

    function getWeatherInfo(location = locationInput.value) {
      return fetch(`${environment.API.weather}?location=${location}`, {
        mode: 'same-origin'
      });
    }

    function postFeelings(weather, feelings = feelingsInput.value) {
      return fetch(`${environment.API.entries}`, {
        method: 'POST',
        mode: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ weather, feelings })
      });
    }

    async function parsePayload(pendingPayload) {
      const payload = await pendingPayload.json();
      return payload.data;
    }

    function save(data) {
      localStorage.setItem('entry', JSON.stringify(data));
    }
  }

  function updateUI(entryResponse = getLastEntry()) {
    if (!entryResponse) {
      feelingEntry.innerHTML = 'No entry';
      return;
    }
    dateEntry.value = `Date: ${entryResponse.created.slice(0, 10)}`;
    weatherEntry.innerHTML = `${entryResponse.weather.weather[0].main}: ${entryResponse.weather.weather[0].description}`;
    feelingEntry.value = entryResponse.feelings;
  }

  function getLastEntry() {
    const entry = localStorage.getItem('entry');
    return entry ? JSON.parse(entry) : null;
  }

  updateUI();
  generateBtn.addEventListener('click', generateNewRecord);
}

document.addEventListener('DOMContentLoaded', () => {
  main();
});
