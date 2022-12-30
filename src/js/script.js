document.addEventListener('DOMContentLoaded', () => {
    let menBeforeThirty = [],
        menBeforeForty = [],
        menBeforeFifty = [],
        menBeforeSixty = [],
        menBeforeSeventy = [],
        menBeforeEighty = [],
        arr = [];
        
    let counter = 0;
    let chart;
    
    const parent = document.querySelector('.placeholder'),
        placeholder = parent.querySelector('.placeholder__wrapper'),
        tableParent = document.querySelector('.table'),
        tableBody = tableParent.querySelector('tbody'),
        textBlock = document.querySelector('.text'),
        startButton = document.querySelector('#startedButton');

    const message = {
        loading: "icons/spinner.svg",
        failure: "Something is wrong"
    }

    const statusMessage = document.createElement('img');
    
    chartCreator();  
    
    
    startButton.addEventListener('click', () => {
        if (counter == 4) {
            textBlock.classList.add('blue');
            counter = 0;
        } else {
            textBlock.classList.remove('blue');
            ++counter;
        }
        
        if (chart) {
            chart.destroy();
        }

        placeholder.style.display = 'none';
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            height: 100px;
            width: 100px;
        `;
        tableBody.innerHTML = '';

        document.querySelectorAll('.cell').forEach(item => {
            item.remove();
        });

        parent.append(statusMessage);
        menBeforeThirty = [],
        menBeforeForty = [],
        menBeforeFifty = [],
        menBeforeSixty = [],
        menBeforeSeventy = [],
        menBeforeEighty = [],
        arr = [];
        chartInitialization();
        
    });

    function chartInitialization() {
        fetch('https://randomuser.me/api/?results=1000&gender=male&nat=FR')
            .then(data => data.json())
            .then(data => {
                
                statusMessage.remove();
                placeholder.style.display = 'block';
                data.results.forEach(persone => {
                    const {age} = persone.dob;
                    if (age < 30) {
                        menBeforeThirty.push(persone);                    
                    } else if (age >= 30 && age < 40) {
                        menBeforeForty.push(persone);
                    }  else if (age >= 40 && age < 50) {
                        menBeforeFifty.push(persone);
                    } else if (age >= 50 && age < 60) {
                        menBeforeSixty.push(persone);
                    } else if (age >= 60 && age < 70) {
                        menBeforeSeventy.push(persone);
                    } else if (age >= 70) {
                        menBeforeEighty.push(persone);
                    } 
                });

                // sorting the oldest men (must be changed to sort by date of birth, not age)
                const byDate = menBeforeEighty.slice(0);
                byDate.sort(function(a,b) {
                    return a.dob.age - b.dob.age;
                });
                

                for (let i = 1; i <= 10; i++) {
                    arr.push(byDate[byDate.length - i]);
                }
                console.log(arr);

                tableContentMaker();

                chartCreator();
            });
    }
    
    function tableContentMaker() {
        // tableParent.style.display = 'block';
        arr.forEach(({name, dob, email, cell}, i) => {
            new Cell(i+1, name.first, name.last, dob.age, email, cell).render();
        });
    }

    function chartCreator() {
        
        const ctx = document.getElementById('myChart');

        chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['20-29 yo', '30-39 yo', '40-49 yo', '50-59 yo', '60-69 yo', '70-79 yo'],
            datasets: [{
            label: 'Number of men',
            data: [menBeforeThirty.length, menBeforeForty.length, menBeforeFifty.length, menBeforeSixty.length, menBeforeSeventy.length, menBeforeEighty.length],
            borderWidth: 2
            }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        });
    }

    class Cell {
        constructor(nr, name, surname, age, email, phone) {
            this.nr = nr,
            this.name = name,
            this.surname = surname,
            this.age = age,
            this.email = email,
            this.phone = phone
        }
        render() {
            const elem = document.createElement('tr');
            elem.classList.add('cell');
            elem.innerHTML = `
                <td>${this.nr}</td>
                <td>${this.name}</td>
                <td>${this.surname}</td>
                <td>${this.age}</td>
                <td>${this.email}</td>
                <td>${this.phone}</td>
            `;
    
            tableBody.append(elem);
        }
    }

    

});


