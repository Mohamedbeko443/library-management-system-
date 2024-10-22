let base = "nk25fpg7-7170.uks1.devtunnels.ms";
authorize();
getBooks();



function authorize(){
    const token = JSON.parse(localStorage.getItem("data"));
    if(!token || token.role === "user")
        window.location.href = "/index.html";
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
            document.getElementById("tableBody").innerHTML = "";
            for (let book of books) {
                let content = `
                        <tr>
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.publicationYear}</td>
                        <td>${book.category}</td>
                        <td>${book.numberOfCopies}</td>
                        <td>${book.availableCopies}</td>
                        <td>
                            <button class="btn btn-info" onclick="editBook(${book.id})">Edit</button>
                            <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                        </td>
                    </tr>
            `;
                document.getElementById("tableBody").innerHTML += content;
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








function action2() {
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('author', document.getElementById('author').value);
    formData.append('publicationYear', document.getElementById('publicationYear').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('numberOfCopies', document.getElementById('numberOfCopies').value);
    formData.append('availableCopies', document.getElementById('availableCopies').value);
    
    // form = {
    //     title : document.getElementById("title").value,
    //     author : document.getElementById("author").value,
    //     publicationYear : document.getElementById("publicationYear").value,
    //     category : document.getElementById("category").value,
    //     numberOfCopies : document.getElementById("numberOfCopies").value,
    //     availableCopies : document.getElementById("availableCopies").value,
    //     coverUrl : document.getElementById("coverUrl").value || null
    // }
    



    const coverUrl = document.getElementById('coverUrl').files[0];
    if (coverUrl) {
        formData.append('coverUrl', coverUrl , "cover.png");
    }

    const data = JSON.parse(localStorage.getItem("data"));

    const headers = {
        "Authorization": `Bearer ${data.token}`
    };

    fetch(`https://${base}/api/Books/AddBook`, {
        method: 'POST',
        body: formData,
        headers: headers 
    })
    .then((response) => {
        if (!response.ok) {
            return response.json().then((err) => Promise.reject(err));
        }
        return response.json();
    })
    .then(() => {
        showAlert("New Book Has been Added", "success");
        resetForm();
        getBooks();
    })
    .catch((error) => {
        const errorMessage = error.message || "An unknown error occurred";
        showAlert(errorMessage, "danger");
        console.log("There was an error!", error);
    });
}



function action() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publicationYear = document.getElementById("publicationYear").value;
    const category = document.getElementById("category").value;
    const numberOfCopies = document.getElementById("numberOfCopies").value;
    const availableCopies = document.getElementById("availableCopies").value;

    console.log(firstName, lastName, username, email, phone, password);

    const params = {
        "title": title,
        "author": author,
        "publicationYear": publicationYear,
        "category": category,
        "numberOfCopies": numberOfCopies,
        "availableCopies": availableCopies
    };

    const data = JSON.parse(localStorage.getItem("data"));

    fetch(`https://${base}/api/Books/AddBook`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${data.token}`
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
        .then(() => {
            showAlert("New Book Has been Added", "success");
            resetForm();
            getBooks();
        })
        .catch((error) => {
            const errorMessage = error.message || "An unknown error occurred";
        showAlert(errorMessage, "danger");
        console.log("There was an error!", error);
        });
}




function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('publicationYear').value = '';
    document.getElementById('category').value = '';
    document.getElementById('numberOfCopies').value = '';
    document.getElementById('availableCopies').value = '';
    document.getElementById('coverUrl').value = ''; // Reset file input
    document.getElementById('addUpdateButton').innerText = 'Add Book';
    // document.getElementById('addUpdateButton').removeAttribute('data-id');
}

















