const basePath = "http://raspberrypi.local/thermoApp.fcgi/";

export async function fetchCurrentTemp(): Promise<string> {
  try {
    const response = await fetch(basePath + "current_temp");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return data.temp.toString();
  } catch (error) {
    console.error("There has been a problem with the request:", error);
    return "Current temperature not found";
  }
}

export async function fetchAvgTempTotal(): Promise<string> {
  try {
    const response = await fetch(basePath + "avg_temp_total");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return data.temp.toString();
  } catch (error) {
    console.error("There has been a problem with the request:", error);
    return "Average temperature not found";
  }
}

export async function fetchHighestTempTotal(): Promise<string> {
  try {
    const response = await fetch(basePath + "highest_temp_total");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return data.temp.toString();
  } catch (error) {
    console.error("There has been a problem with the request:", error);
    return "Highest temperature not found";
  }
}

export async function fetchLowestTempTotal(): Promise<string> {
  try {
    const response = await fetch(basePath + "lowest_temp_total");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return data.temp.toString();
  } catch (error) {
    console.error("There has been a problem with the request:", error);
    return "Highest temperature not found";
  }
}

export async function fetchTodaysTemps(): Promise<number[]> {
  try {
    const response = await fetch(basePath + "todays_temps");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return data.temperatures;
  } catch (error) {
    console.error("There has been a problem with the request:", error);
    return [];
  }
}
