setupUI();
getBooks();


function registerBtnClicked() {
    const firstName = document.getElementById("register-firstName-input").value;
    const lastName = document.getElementById("register-lastName-input").value;
    const username = document.getElementById("register-username-input").value;
    const email = document.getElementById("register-email-input").value;
    const phone = document.getElementById("register-phone-input").value;
    const password = document.getElementById("register-password-input").value;

    console.log(firstName, lastName, username, email, phone, password);
    
    const params = {
        "firstName": firstName,  
        "lastName": lastName,
        "user_name": username,
        "email": email,
        "phoneNumber": phone,
        "password": password
    };

    fetch("https://g5l1g6nc-7170.uks1.devtunnels.ms/api/Account/Register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    .then((response) => {
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            // If the response isn't OK and isn't JSON, return text
            if (contentType && contentType.includes("application/json")) {
                return response.json().then((err) => Promise.reject(err));
            } else {
                return response.text().then((text) => Promise.reject({ message: text }));
            }
        }
        // If response is OK and JSON, parse and return it
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            return response.text().then((text) => Promise.reject({ message: text }));
        }
    })
    .then((data) => {
        console.log(data);
        localStorage.setItem("data", JSON.stringify(data));
    
        const modal = document.getElementById("exampleModal2");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    
        alert("Register Successfully");
        setupUI();
    })
    .catch((error) => {
        const errorMessage = error.message || "Something went wrong. Please try again.";
        console.error(errorMessage);  // Log error in console
        alert(errorMessage);  // Show alert to the user
    });
}



function loginBtnClicked(){
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    
    
    const params = {
        "email" : email,
        "password" : password
    };

    fetch("https://g5l1g6nc-7170.uks1.devtunnels.ms/api/Account/Login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    .then((response) => {
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            // If the response isn't OK and isn't JSON, return text
            if (contentType && contentType.includes("application/json")) {
                return response.json().then((err) => Promise.reject(err));
            } else {
                return response.text().then((text) => Promise.reject({ message: text }));
            }
        }
        // If response is OK and JSON, parse and return it
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            return response.text().then((text) => Promise.reject({ message: text }));
        }
    })
    .then((data) => {
        console.log(data);
        localStorage.setItem("data", JSON.stringify(data));
    
        const modal = document.getElementById("exampleModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    
        alert("login Successfully");
        setupUI();
    })
    .catch((error) => {
        const errorMessage = error.message || "Something went wrong. Please try again.";
        console.error(errorMessage);  // Log error in console
        alert(errorMessage);  // Show alert to the user
    });
}




function setupUI(){
    const token = localStorage.getItem("data");
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logoutBtn = document.getElementById("logout-btn");
    

    if(!token) // user is guest
    {
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
        logoutBtn.style.display = "none";
    }
    else
    {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "block";
    }
}


function logout(){
    localStorage.removeItem("data");
    // toaster("logged out successfully!" , "success");
    alert("logged out successfully!");
    setupUI();
}


function getBooks(){
    fetch("https://g5l1g6nc-7170.uks1.devtunnels.ms/api/Books/GetAll")
    .then((response) => {
        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                // If it's JSON, parse it and reject the promise
                return response.json().then((err) => Promise.reject(err));
            } else {
                // If it's not JSON, return the response as plain text
                return response.text().then((text) => Promise.reject({ message: text }));
            }
        }
        // If everything is OK, return the response as JSON
        return response.json();
    })
    .then((data) => {
        let books = data;
        console.log(books)
        document.getElementById("books").innerHTML = "";
        for (let book of books) {
            
            let content = `
            <div class="col mb-5">
                    <div class="card h-100">
                        <!-- Product image-->
                        <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
                        <!-- Product details-->
                        <div class="card-body p-4">
                            <div class="text-center">
                                <!-- Product Details-->
                                <h5 id="title" class="fw-bolder">${book.title}</h5>
                                <h6 id="author">By : ${book.author}</h6>
                                <h6 id="publicationYear">Publication Year : ${book.publicationYear}</h6>
                                <h6 id="category">Category : <span class="rounded-3 p-1 text-white" style="background-color: red;">${book.category}</span></h6>
                                <h6 id="available" class="mt-3">Available : <span class=" rounded-3 p-1 text-white" style="background-color: black ;">${book.availableCopies}</span></h6>

                            </div>
                        </div>
                        <!-- Product actions-->
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Loan</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("books").innerHTML += content;
        }
    })
    .catch((error) => {
        if (error.message) {
            alert("Error: " + error.message);
        } else {
            alert("An unknown error occurred.");
        }
        console.error("There was an error!", error);
    });
}

