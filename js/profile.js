const base = "vh70k80x-7170.uks1.devtunnels.ms";
showName();
getUserData();
hide();


function hide(){
    let el = document.getElementById("manage-link");
    el.style.display = "none";
}

function showName() {
    const data = JSON.parse(localStorage.getItem("data"));
    console.log(data);
    userName = document.getElementById("username").innerHTML = data.user_name;
}




function getUserData() {
    const data = JSON.parse(localStorage.getItem("data"));
    console.log(data.userId);

    fetch(`https://${base}/api/Account/GetById?id=${data.userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
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

            let content = document.getElementById("information");
            content.innerHTML = `
                <div class="row" >
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Full Name</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    ${data.firstName+" "+data.lastName}
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Email</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    ${data.email}
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <h6 class="mb-0">Phone</h6>
                                </div>
                                <div class="col-sm-9 text-secondary">
                                    ${data.phoneNumber}
                                </div>
                            </div>
                            <hr>
            `;
            //showAlert("Register Successfully" , "success");
            //setupUI();
        })
        .catch((error) => {
            const errorMessage = error.message || "Something went wrong. Please try again.";
            console.error(errorMessage);
            alert("error");
            //showAlert(errorMessage , "danger");
        });
}


getLoansData();
function getLoansData() {
    const data = JSON.parse(localStorage.getItem("data"));
    console.log(data.userId);

    fetch(`https://${base}/api/Loans/GetAllByUserId?id=${data.userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
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
            let loans = data;
            console.log(loans);
            let tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = "";
            for(let loan of loans)
            {
                let content =  `
                <tr>
                        <td>${loan.bookName}</td>
                        <td>${loan.loanDate}</td>
                        <td>${loan.returnDate}</td>
                    </tr>
                `;
                tableBody.innerHTML+=content;
            }


            //let content = document.getElementById("information");
            
            //showAlert("Register Successfully" , "success");
            //setupUI();
        })
        .catch((error) => {
            const errorMessage = error.message || "Something went wrong. Please try again.";
            console.error(errorMessage);
            alert("error");
            //showAlert(errorMessage , "danger");
        });
}



