const base = "vh70k80x-7170.uks1.devtunnels.ms";
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

    fetch(`https://${base}/api/Account/Register`, {
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

            // alert("Register Successfully");
            showAlert("Register Successfully" , "success");
            setupUI();
        })
        .catch((error) => {
            const errorMessage = error.message || "Something went wrong. Please try again.";
            console.error(errorMessage);  
            // alert(errorMessage);
            showAlert(errorMessage , "danger");
        });
}



function loginBtnClicked() {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;


    const params = {
        "email": email,
        "password": password
    };

    fetch(`https://${base}/api/Account/Login`, {
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

            // alert("login Successfully");
            showAlert("login Successfully" , "success");
            setupUI();
        })
        .catch((error) => {
            const errorMessage = error.message || "Something went wrong. Please try again.";
            console.error(errorMessage);  
            // alert(errorMessage);
            showAlert(errorMessage , "danger");
        });
}



// todo
function setupUI() {
    const token = JSON.parse(localStorage.getItem("data"));
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const manageBtn = document.getElementById("manage-link");
    const profileBtn = document.getElementById("profile-link");
    


    if (!token) // user is guest
    {
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
        logoutBtn.style.display = "none";
        manageBtn.style.display = "none";
        profileBtn.style.display = "none";
    }
    else if (token.role === "user")
    {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "block";
        manageBtn.style.display = "none";
        profileBtn.style.display = "block";
    }
    else {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "block";
        manageBtn.style.display = "block";
        profileBtn.style.display = "block";
    }
}



function logout() {
    localStorage.removeItem("data");
    // alert("logged out successfully!");
    showAlert("logged out successfully!" , "success");
    setupUI();
}



function getBooks() {
    fetch(`https://${base}/api/Books/GetAll`)
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
                        <img class="card-img-top img-fluid" style = "height : 200px" src="https://nk25fpg7-7170.uks1.devtunnels.ms/api/Books/GetCover/cover/${book.id}" alt="..." />
                        <!-- Product details-->
                        <div class="card-body p-4">
                            <div class="text-center">
                                <!-- Product Details-->
                                <h5 id="title" class="fw-bolder">${book.title}</h5>
                                <h6 id="author">By : ${book.author}</h6>
                                <h6 id="publicationYear">Publication Year : ${book.publicationYear}</h6>
                                <h6 id="category">Category : <span class="rounded-3 p-1 text-white" style="background-color: red;">${book.category}</span></h6>
                                <h6 id="available" class="mt-3">Available : <span class=" rounded-3 p-1 text-white" style="background-color: black ;">${book.availableCopies}</span></h6>
                                <h6 id="bookId-${book.id}" style="display: none">${book.id}</h6>
                            </div>
                        </div>
                        <!-- Product actions-->
                        <div class="  d-flex justify-content-center card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <button  class="btn btn-outline-dark  mt-auto" onclick='loanBtnClicked(this.dataset.book)' data-book='${JSON.stringify(book)}' >Loan</button>
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
                // alert("Error: " + error.message);
                showAlert(error , "danger");
            } else {
                // alert("An unknown error occurred.");
                showAlert("An unknown error occurred" , "danger");
            }
            console.error("There was an error!", error);
        });
}



function showAlert(message, type) {
    // Create a new alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade show`;
    alert.role = "alert";
    alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    
    const alertContainer = document.getElementById('alert-container');
    alertContainer.appendChild(alert);

    
    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('fade');
        setTimeout(() => alert.remove(), 500); 
    }, 3000);
}



function loanBtnClicked(bookString) {
    const data = JSON.parse(localStorage.getItem("data"));
    
    if (!data || !data.userId) {
        alert("Please login first");
        return;
    }

    let book = JSON.parse(bookString);
    console.log(book);
    console.log(data.userId);

    fetch(`https://${base}/api/Loans/AddLone?userId=${data.userId}&bookId=${book.id}&fineAmount=21`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${data.token}`
        },
        body: JSON.stringify({})  
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
    .then(() => {
        alert("Loaned successfully");
        setupUI();  
    })
    .catch((error) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showAlert("Loaned successfully" , "success");
    });
}



