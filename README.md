# piThermo

A thermometer app for home use built with a Raspberry Pi, Preact and Flask. The Pi measures the temperature hourly and inserts the data into a SQLite database, which is also located on the Pi. Also, the Pi serves the app inside of the local network. The UI allows to see the current temperature, query the database for temperatures in specific periods or in between certain values and shows some graphics like the average temperature for each year of the month.

![An image of the thermo app UI](./thermo_app_UI.png "The UI of the Pi thermo app")

Lighttpd (https://www.lighttpd.net/) is used as the WSGI-Server. Graphics were created with Chart.js (https://www.chartjs.org/). React-Bootstrap is used for responsiveness and CSS styling in general (together with some slight customizations).

The Pi setup for use as a thermometer follows this tutorial: https://tutorials-raspberrypi.de/raspberry-pi-temperatur-mittels-sensor-messen/
