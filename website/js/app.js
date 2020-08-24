function main() {
  const environment = {
    API: {
      weather: '/weather',
      entries: '/entry'
    }
  };

  const locationInput = $('#zip');
  const feelingsInput = $('#feelings');
  const generateBtn = $('#generate');
  const loader = $('#loader');
  const lastEntryContainer = $('#last-entry');
  const dateEntry = $('#date');
  const weatherEntry = $('#temp');
  const feelingEntry = $('#content');

  function $(selector) {
    return selector.includes('#') ? document.querySelector(selector) : document.querySelectorAll(selector);
  }

  function addClass(className, ...elements) {
    elements.forEach(el => el.classList.add(className))
  }
  function removeClass(className, ...elements) {
    elements.forEach(el => el.classList.remove(className))
  }

  async function generateNewRecord(e) {
    let entryResponse;
    try {
      if (inputNotValid()) {
        throw new Error('Validation error: input not valid')
      }
      e.preventDefault();
      updateUIOnRequest();
      const weatherRequest = await getWeatherInfo();
      const weatherResponsePayload = await manageRequestResponse(weatherRequest, request => {
        if (request.status === 404) {
          alert('No available data for the inserted location');
        }
      });
      const entryRequest = await postFeelings(weatherResponsePayload);
      entryResponse = await manageRequestResponse(entryRequest);
      save(entryResponse);
      updateUIOnResponse(entryResponse);
    } catch (e) {
      console.log(e);
    } finally {
      updateUIOnResponse(entryResponse)
    }

    function inputNotValid() {
      return !locationInput.value || !feelingsInput.value;
    }

    function updateUIOnRequest() {
      removeClass('hidden', loader);
    }

    function getWeatherInfo(location = locationInput.value) {
      return fetch(`${environment.API.weather}?location=${location}`, {
        mode: 'same-origin'
      });
    }

    async function manageRequestResponse(pendingRequest, errorHandler = null) {
      if (!pendingRequest.ok) {
        if (errorHandler) {
          errorHandler(pendingRequest);
        }
        throw new Error(`Request failed: ${pendingRequest.status}`)
      }
      const payload = await pendingRequest.json();
      return payload.data;
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

    function save(data) {
      localStorage.setItem('entry', JSON.stringify(data));
    }
  }

  function updateUIOnResponse(entryResponse = getLastEntry()) {
    addClass('hidden', loader);
    if (entryResponse) {
      removeClass('hidden', lastEntryContainer);
      dateEntry.value = entryResponse.created.slice(0, 10);
      weatherEntry.value = `${entryResponse.weather.weather[0].main}: ${entryResponse.weather.weather[0].description}`;
      feelingEntry.value = entryResponse.feelings;
    }
  }

  function getLastEntry() {
    const entry = localStorage.getItem('entry');
    return entry ? JSON.parse(entry) : null;
  }

  updateUIOnResponse();

  generateBtn.addEventListener('click', generateNewRecord);
}

document.addEventListener('DOMContentLoaded', () => {
  main();
});
