
      let weatherObject = {};
      let spinner = document.getElementsByClassName('spinner')[0];
      
      // wybieram przycisk z drzewa DOM
      let button = document.querySelector('button');
      // nasluchiwanie na klikniecie w button
      button.onclick = function() {

        spinner.className = spinner.className + ' visible';

        document.getElementById("weather").innerHTML = '';
        document.getElementsByClassName("title")[0].innerHTML = '';
        weatherObject = {};
        // wybieram input z drzewa DOM
        var input = document.querySelector('input');
        // sprawdzam czy input nie ma pustej wartosci
        if (input.value.trim() !== '') {
               
          // pobranie danych z serwera (open weather map)
          fetch(
            'https://api.openweathermap.org/data/2.5/forecast?q=' +
              input.value +
              '&lang=pl&appid=ae76d0efed32d9f29c4d54a5738b80ca'
            )
            .then(function(response) {
              return response.json();
            })
            .then(function(jsonData) {
              if (jsonData.cod === '200') {

                let h1 = document.createElement('h1');
                h1.innerText = 'Pogoda dla: ' + input.value;
                let section = document.getElementsByClassName('title')[0];
                section.appendChild(h1);
                

                jsonData.list.forEach(function(singleItem) {
                  sortWeatherByDate(singleItem);
                });
                
                /*Keys*/
                Object.keys(weatherObject).forEach(key => {
                  console.warn("key: ",key, weatherObject[key]);
                  addElement(key);
                });
                console.warn("keys: ", Object.keys(weatherObject));
                input.value = '';
                // h1.innerText = '';
              } else {
                // dane nie istnieja
                alert('błędna lokalizacja');
              }
              spinner.className = spinner.className.replace('visible', '');
            })
            .catch(function(error) {
              // tutaj osblugujemy bledy popelnione w wywolaniu zwrotnym powyzej
              // czyli w funkcji .then(...)
              console.warn('Nasz error:', error);
              spinner.className = spinner.className.replace('visible', '').trim();
            });
        } else {
            spinner.className = spinner.className.replace('visible', '').trim();
        }
      };

      // funkcja konwertujaca K na C
      function convertKelvinToCelsjus(kelvin) {
        // zaokraglaj wynik w gore
        return Math.ceil(kelvin - 272.15);
      }

      function addElement(key) {
        let p = document.createElement('p');
        p.innerText = key;
        let ul = document.createElement('ul');
        ul.appendChild(p);
        let div = document.getElementById('weather');
        div.appendChild(ul);
             
        const values = weatherObject[key].map(valueKey =>valueKey);
        console.log("values: ", values)
        values.forEach(value=> {
        console.log("inside: ",key, value);
        
        let img = document.createElement("img");
        img.src = "http://openweathermap.org/img/w/" + value.weather[0].icon + ".png";;
        ul.appendChild(img);
        
        let time = document.createElement('li');
        time.innerText = 'Godzina: ' + getTime(value);
        ul.appendChild(time);

        
        let opis = document.createElement('li');
        opis.className = 'description';
        opis.innerText = value.weather[0].description;
        ul.appendChild(opis);

        
        let temperature = document.createElement('li');
        temperature.innerText = 'Temperatura: '+convertKelvinToCelsjus(value.main.temp) + ' ℃';
        ul.appendChild(temperature);
        let cisnienie = document.createElement('li');
        cisnienie.innerText = 'Ciśnienie: ' + value.main.pressure + 'hPa'
        ul.appendChild(cisnienie);
        let wilgotnosc = document.createElement('li');
        wilgotnosc.innerText = 'Wilgotność: ' + value.main.humidity + '%'
        ul.appendChild(wilgotnosc);
        let predkoscWiatru = document.createElement('li');
        predkoscWiatru.innerText = 'Prędkość wiatru: ' + value.wind.speed + 'm/s'
        ul.appendChild(predkoscWiatru);
        });
      }

      function sortWeatherByDate(singleItem) {

        const date = new Date(singleItem.dt_txt);
        console.log("dateFromWeather: ", date)
        //wyciągamy date
        const day = date.getDate();
        const month = date.getMonth();
        const dateString = getDayName(singleItem.dt_txt, "pl-PL") + ' ' 
                            + date.getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + ' ';
                  
        /**
        checks if date already exists in weather object
        if yes then related single items are added to 
        this object (sorted by date, date is a key)
        otherwise put under date only one single item
        */
        if (weatherObject[dateString]) {
          weatherObject[dateString].push(singleItem);
        } else {
          weatherObject[dateString] = [singleItem];
        }
      }

      function getTime(singleItem) {
        const dateTime = new Date(singleItem.dt_txt);
        const timeString = dateTime.getHours()+":"+dateTime.getMinutes()+"0:"+dateTime.getSeconds()+"0";
        return timeString;
      }

      function getDayName(dateStr, locale) {
          let date = new Date(dateStr);
          return date.toLocaleDateString(locale, { weekday: 'long' });        
      }
      
      