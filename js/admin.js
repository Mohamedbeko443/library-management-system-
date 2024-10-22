let base = "vh70k80x-7170.uks1.devtunnels.ms";
let id = "";
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
            let i = 1;
            document.getElementById("tableBody").innerHTML = "";
            for (let book of books) {
                let content = `
                        <tr>
                        <td>${i}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.publicationYear}</td>
                        <td>${book.category}</td>
                        <td>${book.numberOfCopies}</td>
                        <td>${book.availableCopies}</td>
                        <td>
                            <button class="btn btn-info" onclick='editBookMood(this.dataset.book)' data-book='${JSON.stringify(book)}'>Edit</button>
                            <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                        </td>
                    </tr>
            `;
                document.getElementById("tableBody").innerHTML += content;
                i++;
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


function deleteBook(bookId) {
    const data = JSON.parse(localStorage.getItem("data"));
    console.log(bookId);
    const headers = {
        "Authorization": `Bearer ${data.token}`
    };

    fetch(`https://${base}/api/Books/DeleteBook?id=${bookId}`, {
        method: 'DELETE',
        headers: headers
    })
    .then((response) => {
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json().then((err) => Promise.reject(err));
            } else {
                return response.text().then((text) => Promise.reject({ message: text }));
            }
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            return response.text(); 
        }
    })
    .then(() => {
        showAlert("Book has been deleted successfully", "success");
        getBooks();  
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch((error) => {
        if (error.message) {
            showAlert(error.message, "danger");
        } else {
            showAlert("An unknown error occurred", "danger");
        }
        console.log(error.message);
    });
}



function getBookDetails(book){
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('publicationYear').value = book.publicationYear;
    document.getElementById('category').value = book.category;
    document.getElementById('numberOfCopies').value = book.numberOfCopies;
    document.getElementById('availableCopies').value = book.availableCopies; 
}


function editBookMood(bookString){
    let book = JSON.parse(bookString)
    console.log(book);
    addUpdateBtn = document.getElementById("addUpdateButton").innerHTML = "Update";
    getBookDetails(book);
    id = book.id;
}



function action() {
    let addUpdateBtn = document.getElementById("addUpdateButton");
    if(addUpdateBtn.innerHTML === "Add")
    {
        const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('author', document.getElementById('author').value);
    formData.append('publicationYear', document.getElementById('publicationYear').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('numberOfCopies', document.getElementById('numberOfCopies').value);
    formData.append('availableCopies', document.getElementById('availableCopies').value);


    const coverUrl = document.getElementById('coverUrl').files[0];
    if(coverUrl)
    {
        formData.append('coverUrl', coverUrl , coverUrl.name); //!
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
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json().then((err) => Promise.reject(err));
            } else {
                return response.text().then((text) => Promise.reject({ message: text }));
            }
        }
        return response.json();
    })
    .then(() => {
        showAlert("New Book Has been Added", "success");
        resetForm();
        getBooks();
    })
    .catch((error) => {
        const errorMessage = "Error!";
        showAlert(errorMessage, "danger");
        console.log("There was an error!", error.message);
    });
    }
    else
    {

        const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('author', document.getElementById('author').value);
    formData.append('publicationYear', document.getElementById('publicationYear').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('numberOfCopies', document.getElementById('numberOfCopies').value);
    formData.append('availableCopies', document.getElementById('availableCopies').value);
    const coverUrl = document.getElementById('coverUrl').files[0];
    formData.append('coverUrl', coverUrl);

    const data = JSON.parse(localStorage.getItem("data"));

    const headers = {
        "Authorization": `Bearer ${data.token}`
    };

    fetch(`https://${base}/api/Books/UpdateBook?id=${id}`, {
        method: 'PUT',
        body: formData,
        headers: headers 
    })
    .then((response) => {
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json().then((err) => Promise.reject(err));
            } else {
                return response.text().then((text) => Promise.reject({ message: text }));
            }
        }
        return response.json();
    })
    .then(() => {
        showAlert("Book Has Been Updated Successfully", "success");
        resetForm();
        getBooks();
        addUpdateBtn.innerHTML = "Add";
    })
    .catch((error) => {
        const errorMessage =  "Error!";
        showAlert(errorMessage, "danger");
        console.log("There was an error!", error);
    });

    }
}


//! cancelled
function action2() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publicationYear = document.getElementById("publicationYear").value;
    const category = document.getElementById("category").value;
    const numberOfCopies = document.getElementById("numberOfCopies").value;
    const availableCopies = document.getElementById("availableCopies").value;

    console.log(title, author, publicationYear, category, numberOfCopies, availableCopies);

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
}

















