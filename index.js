const showLoginPage=()=>{
  $('#register-page, #main-page').hide()
  $('#login-page').show()
}

const showRegisterPage=()=>{
  $('#register-page').show()
  $('#login-page, #main-page').hide()
}

const showMainPage=()=>{
  $('#register-page,#login-page').hide()
  $('#main-page').show()
  getData()
  getWeather()
  getHolidays()
}

const login=()=>{
  let email=$("#email").val()
  let password=$("#password").val()
  $.ajax({
    url: "http://localhost:3000/login",
    method: "POST",
    data:{
      email,
      password
    }
  })
  .done(response =>{
    localStorage.setItem('access_token', response.access_token)
    $("#si-name").text(response.name)
    $("#si-email").text(response.email)
    showMainPage()
  })
  .fail((xhr, textStatus)=>{
    console.log(xhr, textStatus)
  })
  .always(()=>{
    $("#email").val("")
    $("#password").val("")
  })
}

const register=()=>{
  let name=$("#name").val()
  let email=$("#reg-email").val()
  let password=$("#reg-password").val()
  $.ajax({
    url: "http://localhost:3000/register",
    method: "POST",
    data:{
      name,
      email,
      password
    }
  })
  .done(response =>{
    showLoginPage()
  })
  .fail((xhr, textStatus)=>{
    console.log(xhr, textStatus)
  })
  .always(()=>{
    $("name").val("")
    $("#reg-email").val("")
    $("#reg-password").val("")
  })
}

// const addData=()=>{
//   let name=$("#todo-name").val()
//   let description=$("#description").val()
//   let status= $("#status").find(":selected").text();
//   let category=$("input[name='category']:checked").val();
//   let due=$("#due").val()
//   $.ajax({
//     url: "http://localhost:3000/todos",
//     method: "POST",
//     headers:{
//       access_token: localStorage.access_token
//     },
//     data:{
//       name,
//       description,
//       status,
//       category,
//       due
//     }
//   })
//   .done(response =>{
//     console.log(response)
   
//     showMainPage()
//   })
//   .fail((xhr, textStatus)=>{
//     console.log(xhr, textStatus)
//   })
//   .always(()=>{
//     $("#todo-name").val("")
//     $("#description").val("")
//     $("#due").val("")
//   })
// }

// ! show holidays
const getHolidays = () => {
  const request = $.ajax({
    url: "http://localhost:3000/holidays",
    method: "GET",
    headers:{
      access_token: localStorage.access_token
    }
  });
   
  request.done(function( msg ) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $("#holiday-section").empty()
    for (let i = 0; i < msg.length; i++) {
      const element = msg[i];
      $("#holiday-section").append(`
        <tr>
          <td width="50%"><p>${element.name}</p></td>
          <td><p>${new Date(element.date.iso).toLocaleDateString(undefined, options)}</p></td>
        </tr>
      `)
    }
    
  });
   
  request.fail(function( jqXHR, textStatus ) {
    console.log(jqXHR);
    // console.log(jqXHR, textStatus)
  });
}
// ! end holidays

// ! show weather
const getWeather = () => {
  const request = $.ajax({
    url: "http://localhost:3000/weathers",
    method: "GET",
    headers:{
      access_token: localStorage.access_token
    }
  });
   
  request.done(function( msg ) {
    $("#weather-location").text(msg.name)
    let kelvin = msg.main.temp
    const celcius = parseFloat(kelvin) - parseFloat(273.15)
    $("#weather-temp").html(`${celcius.toFixed(2)} <span class="symbol">°</span>C`)
    $("#weather-description").html(`<h3> ${msg.weather[0].main} <img src="http://openweathermap.org/img/wn/${msg.weather[0].icon}@2x.png" alt=""></h3>`)

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date();
    const dayName = days[d.getDay()];
    $("#weather-day").text(dayName)


    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const getDate = new Date().toLocaleDateString(undefined, options)
    $("#weather-date").text(getDate)
  });
   
  request.fail(function( jqXHR, textStatus ) {
    console.log(jqXHR, textStatus)
  });
}
// ! end show weather

const getData=()=>{
  $.ajax({
    url: "http://localhost:3000/museums",
    method: "GET",
    headers:{
      access_token: localStorage.access_token
    }
  })
  .done(response =>{
    response.forEach(data => {
      console.log(data)
      $("#datas").append(`
      <div class="col-md-4">
        <div class="card mb-4 shadow-sm ">
          <div class="card-body text-left">
            <h5 class="card-title">${data.nama_museum}</h5>
            <p class="card-subtitle mb-2 text-muted">${data.alamat}</p><hr>
            <h6 class="card-subtitle mb-2 text-muted">Details:</h6>
            <p class="card-text">${data.deskripsi}</p>
           
          </div>
        </div>
      </div>
     `)
    });
  })
  .fail((xhr, textStatus)=>{
    console.log(xhr, textStatus)
  })
}

const logout=()=>{
  localStorage.clear()
  showLoginPage()
  const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

// ! google signin
function onSignIn(googleUser) {

  const google_token = googleUser.getAuthResponse().id_token;

  const request = $.ajax({
      url: "http://localhost:3000/google-login",
      method: "POST",
      data: {google_token}
  });

  request.done((message) => {
      localStorage.setItem('access_token', message.access_token);

      console.log(message);
      $("#si-name").text(message.name)

      $("#si-email").text(message.email)
      showMainPage()
  })

  request.fail((jqxhr, status) => {
      console.log(jqxhr.responseJSON);
  })

  request.always(() => {
      $("#email").val("")
      $("#password").val("")
  })
}

$(document).ready(function(){
  if(localStorage.getItem('access_token')){
    showMainPage()
  }else{
    showLoginPage()
  }

  $('#login-form').on('submit', (event)=>{
    event.preventDefault()
    login()
  });

  $('#register-redirect').on('click',()=>{
    showRegisterPage()
  })

  $('#register-form').on('submit', (event)=>{
    event.preventDefault()
    register()
  })

  $('#login-redirect').on('click',()=>{
    showLoginPage()
  })

  // $('#add-todo-form').on('submit', (event)=>{
  //   event.preventDefault()
  //   addData()
  // })

  $('#logout-button').on('click',()=>{
    logout()
  })

});


/** End of Scripts **/
